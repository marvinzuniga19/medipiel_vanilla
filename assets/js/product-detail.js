const PRODUCTS_INDEX_URL = "data/products-index.json";
const detailContainer = document.getElementById("productDetail");

function showDetailMessage(message) {
  detailContainer.textContent = message;
  detailContainer.setAttribute("role", "status");
}

async function loadProductDetail() {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) {
    showDetailMessage("No se especificó un producto.");
    return;
  }

  try {
    const response = await fetch(PRODUCTS_INDEX_URL);
    if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar el producto`);

    const data = await response.json();
    if (!data || !Array.isArray(data.products)) {
      throw new Error("El índice del catálogo debe contener un arreglo 'products'.");
    }

    const product = data.products.find(item => item && item.id === productId && item.active !== false);
    if (!product) {
      showDetailMessage("Producto no encontrado.");
      return;
    }

    document.title = `${product.name} | Medipiel`;
    detailContainer.removeAttribute("role");

    const layout = document.createElement("div");
    layout.className = "detail-layout";

    const imageContainer = document.createElement("div");
    imageContainer.className = "detail-image-container";
    const imageUrl = getSafeImageUrl(product.image);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = product.name;
      image.className = "detail-image";
      image.width = 800;
      image.height = 800;
      image.addEventListener("error", () => {
        imageContainer.replaceChildren();
        imageContainer.textContent = "Imagen no disponible";
        imageContainer.classList.add("detail-image-empty");
      }, { once: true });
      imageContainer.appendChild(image);
    } else {
      imageContainer.textContent = "Imagen no disponible";
      imageContainer.classList.add("detail-image-empty");
    }

    const info = document.createElement("div");
    const brand = document.createElement("p");
    brand.className = "product-brand";
    brand.textContent = product.brand || "Medipiel";

    const title = document.createElement("h1");
    title.className = "section-title";
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = product.description || "Descripción no disponible.";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price, product.currency);

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

    info.append(brand, title, description, price, whatsappLink);
    layout.append(imageContainer, info);
    detailContainer.replaceChildren(layout);
  } catch (error) {
    console.error(error);
    showDetailMessage("No fue posible cargar la información del producto.");
  }
}

loadProductDetail();
