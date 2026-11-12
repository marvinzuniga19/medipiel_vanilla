# Esquema y generación del catálogo

## Fuente de verdad

- Productos: objetos JSON individuales en `content/products/`.
- Categorías: objetos JSON individuales en `content/categories/`.
- Índice público generado: `data/products-index.json`.
- Datos ficticios para pruebas: `data/products-demo.json`; el generador los
  ignora y no se deben presentar como catálogo real.

Los esquemas JSON están en `content/products.schema.json` y
`content/categories.schema.json`. El generador aplica además reglas que JSON
Schema por sí solo no puede comprobar: IDs duplicados, pertenencia a categorías
activas, códigos de moneda reconocidos, rutas de imagen admitidas y exclusión
de productos inactivos.

## Crear o actualizar contenido

1. Confirma con Medipiel los datos comerciales y la categoría.
2. Añade un archivo de producto con un único objeto en `content/products/` y,
   si hace falta, su categoría en `content/categories/`.
3. Ejecuta `node scripts/build-catalog.js` para validar y regenerar el índice.
4. Revisa `data/products-index.json` y confirma que solo contiene productos
   activos.
5. Ejecuta `node scripts/build-catalog.js --check` antes de enviar los cambios.

El producto requiere `id`, `name`, `brand`, `category`, `description`,
`image`, `price`, `currency`, `featured` y `active`. `price` puede ser `null`
para mostrar “Consultar precio”. `slug` y `stock` son opcionales. Las imágenes
deben ser HTTPS o estar bajo `assets/images/`; no se admiten esquemas como
`javascript:`.

## Workflow

GitHub Actions valida y compara el índice generado con el índice versionado en
cambios a productos, categorías o al generador. La acción no escribe de vuelta
al repositorio ni crea commits automáticos. Quien edite contenido debe generar
y versionar `data/products-index.json` en el mismo cambio. El despliegue de
Hostinger debe consumir ese índice versionado; el procedimiento de despliegue
se concretará al confirmar el plan de hosting.
