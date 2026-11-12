// Reemplazar con el número oficial de Medipiel antes de publicar.
// Formato internacional, solo dígitos, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "505XXXXXXXX";

function getWhatsAppLink(productName) {
  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) return null;

  const params = new URLSearchParams();
  params.set("text", `Hola, Medipiel. Me gustaría consultar información sobre: ${productName}.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
}
