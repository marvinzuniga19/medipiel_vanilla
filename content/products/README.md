# Productos de contenido

Cada producto fuente se guarda en un archivo JSON individual dentro de este
directorio. El archivo debe contener un objeto, no una lista. Sigue
`content/products.schema.json`; los campos obligatorios también se validan al
generar el catálogo.

Las categorías se guardan como objetos JSON individuales en
`content/categories/` y siguen `content/categories.schema.json`. El campo
`category` de cada producto debe coincidir con el `id` de una categoría activa.
Los productos inactivos se validan, pero se excluyen del índice público.

`index.json` es un archivo heredado y no es fuente de productos. No lo edites
para publicar el catálogo. El índice público es `data/products-index.json` y se
genera desde los archivos individuales mediante `node scripts/build-catalog.js`.

El archivo `data/products-demo.json` contiene datos ficticios para desarrollo.
No se importa en el índice y no debe publicarse como información comercial real.
