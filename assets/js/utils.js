function formatPrice(price, currency = "NIO") {
  if (price === null || price === undefined || price === "") {
    return "Consultar precio";
  }

  const amount = Number(price);
  if (!Number.isFinite(amount) || amount < 0) {
    return "Consultar precio";
  }

  try {
    return new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("es-NI")} ${currency}`;
  }
}

function getSafeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value, document.baseURI);
    const isLocal = url.origin === window.location.origin;
    if (isLocal || url.protocol === "https:") return url.href;
  } catch {
    return null;
  }

  return null;
}
