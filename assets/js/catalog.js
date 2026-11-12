const PRODUCTS_PER_PAGE = 12;
const PRODUCTS_INDEX_URL = "data/products-index.json";

const grid = document.getElementById("catalogGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const resultsCount = document.getElementById("resultsCount");
const pagination = document.getElementById("pagination");
const catalogMessage = document.getElementById("catalogMessage");

let products = [];
let currentPage = 1;

const categoryNames = {
  "limpieza-facial": "Limpieza facial",
  "protectores-solares": "Protectores solares",
  hidratacion: "Hidratación",
  "tratamientos-faciales": "Tratamientos faciales"
};

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function createProductImage(product) {
  const container = document.createElement("div");
  container.className = "product-image";

  const imageUrl = getSafeImageUrl(product.image);
  if (!imageUrl) {
    container.textContent = "Imagen no disponible";
    container.classList.add("product-image-empty");
    return container;
  }

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = product.name;
  image.loading = "lazy";
  image.width = 600;
  image.height = 600;
  image.addEventListener("error", () => {
    container.replaceChildren();
    container.textContent = "Imagen no disponible";
    container.classList.add("product-image-empty");
  }, { once: true });
  container.appendChild(image);
  return container;
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  const info = document.createElement("div");
  info.className = "product-info";

  const brand = document.createElement("span");
  brand.className = "product-brand";
  brand.textContent = product.brand || "Medipiel";

  const name = document.createElement("h2");
  name.className = "product-name";
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product.price, product.currency);

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const detailLink = document.createElement("a");
  detailLink.className = "btn btn-outline";
  detailLink.href = `producto.html?id=${encodeURIComponent(product.id)}`;
  detailLink.textContent = "Ver producto";
  actions.appendChild(detailLink);

  const whatsappLink = document.createElement("a");
  whatsappLink.className = "btn";
  whatsappLink.textContent = "Consultar por WhatsApp";
  const whatsappUrl = getWhatsAppLink(product.name);
  if (whatsappUrl) {
    whatsappLink.href = whatsappUrl;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
  } else {
    whatsappLink.setAttribute("aria-disabled", "true");
    whatsappLink.title = "WhatsApp aún no está configurado";
  }
  actions.appendChild(whatsappLink);

  info.append(brand, name, price, actions);
  article.append(createProductImage(product), info);
  return article;
}

function populateCategories() {
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  categoryFilter.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Todas las categorías";
  categoryFilter.appendChild(defaultOption);

  categories.sort((a, b) => a.localeCompare(b, "es")).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryNames[category] || category;
    categoryFilter.appendChild(option);
  });
}

function getFilteredProducts() {
  const search = normalizeText(searchInput.value);
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  const filtered = products.filter(product => {
    const searchable = normalizeText([
      product.name,
      product.brand,
      product.description,
      product.category
    ].join(" "));
    return searchable.includes(search) && (!category || product.category === category);
  });

  const compareName = (a, b) => a.name.localeCompare(b.name, "es");
  const compareStableId = (a, b) => String(a.id).localeCompare(String(b.id), "es");
  const hasPrice = product => typeof product.price === "number" && Number.isFinite(product.price);

  filtered.sort((a, b) => {
    let result = 0;
    if (sort === "name-asc") result = compareName(a, b);
    else if (sort === "price-asc" || sort === "price-desc") {
      if (hasPrice(a) !== hasPrice(b)) return hasPrice(a) ? -1 : 1;
      if (hasPrice(a) && hasPrice(b)) {
        result = sort === "price-asc" ? a.price - b.price : b.price - a.price;
      }
    } else {
      result = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    }
    return result || compareStableId(a, b);
  });

  return filtered;
}

function createPageButton(label, page, disabled = false, active = false, ariaLabel = label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "page-button";
  button.textContent = label;
  button.disabled = disabled;
  button.setAttribute("aria-label", ariaLabel);

  if (active) {
    button.classList.add("active");
    button.setAttribute("aria-current", "page");
  }

  button.addEventListener("click", () => {
    currentPage = page;
    renderCatalog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  return button;
}

function renderPagination(totalPages) {
  pagination.replaceChildren();
  if (totalPages <= 1) return;

  pagination.setAttribute("aria-label", `Paginación, página ${currentPage} de ${totalPages}`);
  pagination.appendChild(createPageButton("‹", currentPage - 1, currentPage === 1, false, "Página anterior"));

  const pages = new Set([1, totalPages]);
  for (let page = Math.max(1, currentPage - 2); page <= Math.min(totalPages, currentPage + 2); page++) pages.add(page);
  const orderedPages = [...pages].sort((a, b) => a - b);
  let previousPage = 0;

  orderedPages.forEach(page => {
    if (page - previousPage > 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "…";
      ellipsis.setAttribute("aria-hidden", "true");
      pagination.appendChild(ellipsis);
    }
    pagination.appendChild(createPageButton(String(page), page, false, page === currentPage, `Página ${page}`));
    previousPage = page;
  });

  pagination.appendChild(createPageButton("›", currentPage + 1, currentPage === totalPages, false, "Página siguiente"));
}

function renderCatalog() {
  const filtered = getFilteredProducts();
  const totalProducts = filtered.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  currentPage = totalPages ? Math.min(currentPage, totalPages) : 1;

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = filtered.slice(start, start + PRODUCTS_PER_PAGE);
  grid.replaceChildren(...visibleProducts.map(createProductCard));

  resultsCount.textContent = `Mostrando ${totalProducts ? start + 1 : 0}–${Math.min(start + PRODUCTS_PER_PAGE, totalProducts)} de ${totalProducts} productos`;
  catalogMessage.textContent = totalProducts ? "" : "No encontramos productos con esos criterios.";
  renderPagination(totalPages);
}

async function loadProducts() {
  try {
    catalogMessage.textContent = "Cargando catálogo…";
    const response = await fetch(PRODUCTS_INDEX_URL);
    if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar el catálogo`);

    const data = await response.json();
    if (!data || !Array.isArray(data.products)) {
      throw new Error("El índice del catálogo debe contener un arreglo 'products'.");
    }

    products = data.products.filter(product =>
      product && typeof product.id === "string" && product.id.trim() &&
      typeof product.name === "string" && product.name.trim() &&
      product.active !== false
    );
    populateCategories();
    renderCatalog();
  } catch (error) {
    console.error(error);
    resultsCount.textContent = "Catálogo no disponible.";
    catalogMessage.textContent = "No pudimos cargar los productos. Intenta nuevamente más tarde.";
  }
}

searchInput.addEventListener("input", () => { currentPage = 1; renderCatalog(); });
categoryFilter.addEventListener("change", () => { currentPage = 1; renderCatalog(); });
sortFilter.addEventListener("change", () => { currentPage = 1; renderCatalog(); });
loadProducts();
