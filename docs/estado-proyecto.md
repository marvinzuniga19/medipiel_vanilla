# Estado del proyecto Medipiel

**Registro de continuidad:** 12 de noviembre de 2026  
**Rama:** `main`  
**Estado:** trabajo local sin commit; no se ha publicado en producción.

Este documento resume lo aplicado y el punto para retomar. Antes de continuar,
revisar `AGENTS.md`, el estado de Git y los archivos actuales; hay cambios
locales pendientes que deben preservarse.

## Trabajo aplicado

### Páginas y catálogo

- `nosotros.html`, `servicios.html`, `especialistas.html` y `contacto.html`
  tenían cero bytes y ahora contienen páginas HTML con navegación, pie de
  página, metadatos y carga de estilos y menú compartidos.
- Se añadieron componentes visuales responsive para esas páginas en
  `assets/css/components.css`.
- Las páginas muestran marcadores explícitos cuando faltan datos de Medipiel.
  Nombres, credenciales, tratamientos, contacto y horarios no se inventaron.
- `assets/js/utils.js` centraliza el formato de precio y validación de URL de
  imágenes. `catalog.js` y `product-detail.js` usan el índice público
  `data/products-index.json`.
- El catálogo contempla búsqueda, categoría, ordenamiento, paginación de 12,
  estados vacíos y exclusión de productos inactivos. Las fichas muestran los
  datos del producto y tienen navegación al catálogo.
- El número de WhatsApp sigue pendiente; mientras esté el marcador, el sitio
  no genera enlaces activos de consulta.

### Datos y generación del índice

- Se añadieron `content/products.schema.json` y
  `content/categories.schema.json`.
- `scripts/build-catalog.js` valida los archivos de contenido, categorías,
  campos, precios, monedas, imágenes e IDs y genera `data/products-index.json`.
- `.github/workflows/catalog.yml` comprueba que el índice versionado coincida
  con el contenido; no crea commits automáticos.
- El arreglo demostrativo se conservó en `data/products-demo.json`, fuera de la
  fuente de productos del catálogo.
- El índice público actualmente tiene **cero productos**. No hay productos ni
  categorías reales confirmados.

### Diseño y propuesta comercial

- `assets/css/main.css` y `assets/css/components.css` utilizan la paleta marrón
  proporcionada posteriormente por el usuario: `#60361F`, `#4C2A17`,
  `#FFFAF4`, `#FEFBF4`, `#D7C5BA`, `#C3A089` y `#80685A`.
- `docs/propuesta-sitio-medipiel.md` documenta la propuesta comercial con precio
  fijo de **US$700**, incluyendo catálogo de hasta 300 productos con datos e
  imágenes aportados por Medipiel.
- **Pendiente editorial:** revisar esa propuesta antes de enviarla. Conserva la
  paleta verde anterior en su sección UX/UI, aunque el CSS ya usa la paleta
  marrón. Confirmar también que alcance, exclusiones y forma de publicación
  reflejen lo acordado con la doctora.

## Verificaciones realizadas

- Se comprobó la sintaxis de los scripts JavaScript y del generador del índice.
- Se ejecutó el generador y su modo de comprobación; el resultado actual es un
  índice válido con cero productos.
- Se validó que las cuatro páginas institucionales tengan contenido, estilos y
  script compartidos, y que `git diff --check` no reporte errores.
- Se sirvieron localmente `catalogo.html`, `producto.html` y el índice JSON y
  respondieron HTTP 200.
- **Pendiente:** inspección visual real en Chrome/Firefox, móvil, revisión de
  consola y pruebas de catálogo con 300 productos. No se afirma que el sitio
  esté aprobado o listo para producción.

## Pendientes para retomar

1. Actualizar la paleta de `docs/propuesta-sitio-medipiel.md` y revisar su texto
   comercial antes de compartirlo con la doctora.
2. Obtener aprobación de la propuesta de US$700 y los datos institucionales,
   médicos y comerciales oficiales.
3. Crear las categorías confirmadas y cargar los productos reales con sus
   precios, moneda, descripciones e imágenes autorizadas.
4. Sustituir el marcador por el número oficial de WhatsApp y comprobar el
   mensaje de consulta de producto.
5. Confirmar repositorio/rama de producción, dominio y plan de Hostinger.
6. Configurar Decap CMS con autenticación segura compatible; no publicar
   secretos o tokens en el repositorio.
7. Generar y versionar el índice con los productos aprobados; comprobar las
   fichas, las 25 páginas para 300 productos y los controles de catálogo.
8. Completar pruebas visuales, responsive, accesibilidad, enlaces, rutas de
   imágenes y consola antes del despliegue.
9. Publicar solo después de que Medipiel apruebe el contenido y confirmar
   HTTPS, autenticación del CMS y actualización del catálogo.

## Comandos útiles al retomar

Desde la raíz del repositorio:

```sh
git status --short --branch
node scripts/build-catalog.js
node scripts/build-catalog.js --check
python3 -m http.server 8000
```

Con el servidor iniciado, abrir `http://localhost:8000/` y revisar cada página.
El índice solo se puede generar con productos activos después de crear sus
categorías confirmadas en `content/categories/`.
