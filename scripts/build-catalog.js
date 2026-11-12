#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const productsDirectory = path.join(root, "content", "products");
const categoriesDirectory = path.join(root, "content", "categories");
const outputPath = path.join(root, "data", "products-index.json");
const checkOnly = process.argv.includes("--check");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  console.error(`Error de catálogo: ${message}`);
  process.exitCode = 1;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${path.relative(root, filePath)}: JSON inválido (${error.message})`);
  }
}

function jsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
    .map(entry => path.join(directory, entry.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b), "en"));
}

function isValidImage(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (/^https:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return Boolean(url.hostname);
    } catch {
      return false;
    }
  }
  return /^assets\/images\/(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value)
    && !value.includes("\\");
}

function isValidCurrency(value) {
  if (typeof value !== "string" || !/^[A-Z]{3}$/.test(value)) return false;
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: value }).format(0);
    return true;
  } catch {
    return false;
  }
}

function loadCategories() {
  const files = jsonFiles(categoriesDirectory);
  const categories = new Set();

  for (const filePath of files) {
    const category = readJson(filePath);
    if (!category || Array.isArray(category) || typeof category !== "object") {
      throw new Error(`${path.relative(root, filePath)} debe contener un objeto de categoría.`);
    }
    if (typeof category.id !== "string" || !slugPattern.test(category.id)) {
      throw new Error(`${path.relative(root, filePath)} requiere un id de categoría válido.`);
    }
    if (typeof category.name !== "string" || !category.name.trim()) {
      throw new Error(`${path.relative(root, filePath)} requiere un nombre de categoría.`);
    }
    if (category.active !== undefined && typeof category.active !== "boolean") {
      throw new Error(`${path.relative(root, filePath)}: active debe ser booleano.`);
    }
    if (categories.has(category.id)) throw new Error(`ID de categoría duplicado: ${category.id}.`);
    if (category.active !== false) categories.add(category.id);
  }

  return { categories, hasDefinitions: files.length > 0 };
}

function validateProduct(product, filePath, knownCategories) {
  const label = path.relative(root, filePath);
  if (!product || Array.isArray(product) || typeof product !== "object") {
    throw new Error(`${label} debe contener un único objeto de producto (no un arreglo).`);
  }

  const requiredStrings = ["id", "name", "brand", "category", "description", "image"];
  for (const field of requiredStrings) {
    if (typeof product[field] !== "string" || !product[field].trim()) {
      throw new Error(`${label}: '${field}' es obligatorio y debe ser texto no vacío.`);
    }
  }

  if (!slugPattern.test(product.id)) throw new Error(`${label}: id debe ser un slug en minúsculas separado por guiones.`);
  if (product.slug !== undefined && (typeof product.slug !== "string" || !slugPattern.test(product.slug))) {
    throw new Error(`${label}: slug debe ser un slug en minúsculas separado por guiones.`);
  }
  if (!slugPattern.test(product.category)) throw new Error(`${label}: category debe ser un identificador slug válido.`);
  if (!knownCategories.hasDefinitions) {
    throw new Error(`${label}: define la categoría '${product.category}' en content/categories/ antes de añadir productos.`);
  }
  if (!knownCategories.categories.has(product.category)) {
    throw new Error(`${label}: la categoría '${product.category}' no está definida o está inactiva en content/categories/.`);
  }
  if (product.price !== null && (typeof product.price !== "number" || !Number.isFinite(product.price) || product.price < 0)) {
    throw new Error(`${label}: price debe ser un número no negativo o null.`);
  }
  if (!isValidCurrency(product.currency)) throw new Error(`${label}: currency debe ser un código ISO 4217 válido en mayúsculas.`);
  if (typeof product.featured !== "boolean") throw new Error(`${label}: featured debe ser booleano.`);
  if (typeof product.active !== "boolean") throw new Error(`${label}: active debe ser booleano.`);
  if (!isValidImage(product.image)) {
    throw new Error(`${label}: image debe ser una URL HTTPS o una ruta permitida dentro de assets/images/.`);
  }
  if (product.stock !== undefined && product.stock !== null && typeof product.stock !== "string") {
    throw new Error(`${label}: stock debe ser texto o null.`);
  }

  const normalized = {
    id: product.id.trim(),
    name: product.name.trim(),
    brand: product.brand.trim(),
    category: product.category.trim(),
    description: product.description.trim(),
    image: product.image.trim(),
    price: product.price,
    currency: product.currency,
    featured: product.featured,
    active: product.active
  };
  if (product.slug !== undefined) normalized.slug = product.slug.trim();
  if (product.stock !== undefined) normalized.stock = product.stock === null ? null : product.stock.trim();
  return normalized;
}

function stableText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buildIndex() {
  const categoryDefinitions = loadCategories();
  const allProducts = [];
  const ids = new Set();

  for (const filePath of jsonFiles(productsDirectory)) {
    const product = validateProduct(readJson(filePath), filePath, categoryDefinitions);
    if (ids.has(product.id)) throw new Error(`ID de producto duplicado: '${product.id}'.`);
    ids.add(product.id);
    if (product.active) allProducts.push(product);
  }

  allProducts.sort((a, b) =>
    stableText(a.name).localeCompare(stableText(b.name), "en") || a.id.localeCompare(b.id, "en")
  );

  return { products: allProducts, total: allProducts.length };
}

try {
  const generated = `${JSON.stringify(buildIndex(), null, 2)}\n`;

  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== generated) {
      throw new Error("data/products-index.json no coincide con el contenido. Ejecuta: node scripts/build-catalog.js");
    }
    console.log(`Índice validado: ${JSON.parse(generated).total} productos activos.`);
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, generated);
    console.log(`Índice generado: ${JSON.parse(generated).total} productos activos en data/products-index.json.`);
  }
} catch (error) {
  fail(error.message);
}
