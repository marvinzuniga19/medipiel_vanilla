# Propuesta de sitio web para Medipiel

**Documento para revisión y aprobación de la doctora**  
**Inversión propuesta: US$700, pago único**  
**Proyecto:** sitio institucional y catálogo dermatológico con consultas por WhatsApp

## 1. Resumen

Se propone completar y publicar un sitio web responsive para Medipiel que presente la clínica, sus servicios y especialistas, y permita a las personas explorar un catálogo de hasta 300 productos dermatológicos. Cada producto tendrá una ficha propia y una opción para iniciar una consulta por WhatsApp.

El sitio funcionará como canal de información y contacto. **No incluirá carrito, pagos en línea, reservas ni confirmación automática de compras o existencias.** La información médica, comercial, de contacto y de productos se publicará únicamente después de que Medipiel la revise y la apruebe.

## 2. Alcance del sitio

El trabajo contempla las siguientes páginas y vistas:

1. **Inicio:** presentación de Medipiel, acceso a las secciones principales, llamados a conocer los servicios y el catálogo, y un acceso de contacto.
2. **Nosotros:** contenido institucional aprobado por la clínica.
3. **Servicios:** listado y descripción de los servicios que Medipiel confirme.
4. **Especialistas:** perfiles con nombres, fotografías, credenciales y textos autorizados por cada profesional.
5. **Catálogo:** búsqueda, filtros, ordenamiento, tarjetas de productos y navegación paginada.
6. **Ficha de producto:** detalle individual de cada artículo y enlace de consulta por WhatsApp.
7. **Contacto:** medios oficiales, ubicación y horarios que Medipiel confirme.

La navegación y el pie de página tendrán enlaces consistentes entre las secciones. También se contemplan títulos y descripciones básicos para buscadores, estructura semántica, textos alternativos y estados accesibles para los controles principales.

## 3. Diseño UX/UI

La experiencia visual seguirá una línea dermatológica, limpia y profesional, con una presentación sobria que facilite encontrar información sin distraer del contenido clínico y comercial.

### Identidad visual propuesta

- **Marfil `#F8F8F4`:** fondo claro y cálido para las páginas y las áreas de descanso visual.
- **Verde salvia `#DDE8DF`:** fondos secundarios y bloques de apoyo.
- **Verde principal `#426B58`:** botones, enlaces destacados y elementos de interacción.
- **Verde oscuro `#263D32`:** títulos y textos de énfasis.
- **Tipografías:** Inter para textos de lectura e interfaz; Playfair Display para títulos destacados.

### Comportamiento de la interfaz

- Diseño adaptable a móvil, tableta y escritorio.
- Encabezado con marca y navegación clara; en móvil, navegación compacta.
- Jerarquía visible entre títulos, descripciones, controles y acciones.
- Botones y controles con estados de foco y etiquetas comprensibles.
- Imágenes de producto con proporción estable para que las tarjetas no cambien de tamaño al cargar.
- Estados informativos cuando el catálogo está cargando, no encuentra resultados o no puede cargar los datos.
- Llamados a la acción consistentes: ver producto, explorar productos y consultar por WhatsApp.

La propuesta de diseño usa la paleta y las tipografías acordadas como punto de partida. El logotipo y las fotografías institucionales serán los que Medipiel proporcione y autorice. Si no están disponibles al inicio, se utilizarán marcadores provisionales y no se presentarán como recursos oficiales.

## 4. Catálogo de hasta 300 productos

El catálogo está preparado para organizar hasta 300 productos en un índice público generado desde archivos de contenido. El diseño de navegación considera **12 productos por página**, equivalente a 25 páginas cuando existan 300 productos activos.

### Funciones para visitantes

- Buscar por nombre, marca, categoría o descripción.
- Filtrar por categoría.
- Ordenar alfabéticamente y por precio ascendente o descendente.
- Ver el total de resultados y un mensaje cuando la búsqueda no encuentre productos.
- Usar controles de página anterior y siguiente, primera y última página, y páginas cercanas a la página actual.
- Abrir una ficha individual desde cada tarjeta.
- Consultar el precio cuando no exista uno aprobado, en vez de mostrar un valor inventado o tratarlo como cero.

### Información de cada producto

El registro de producto contempla identificador, nombre, marca, categoría, descripción, imagen, precio o indicación de consultar, moneda, producto destacado y estado activo/inactivo. La disponibilidad o existencias solo se mostrarán si Medipiel facilita y autoriza ese dato.

Los productos inactivos se excluirán del catálogo público. Los productos, precios, marcas, descripciones, imágenes y afirmaciones sobre beneficios deben ser proporcionados o aprobados por Medipiel antes de publicación.

### Carga inicial de productos

El precio incluye la carga inicial de **hasta 300 productos**, siempre que Medipiel entregue la información revisada en una hoja de cálculo clara y las imágenes correspondientes, o una fuente equivalente acordada. También incluye normalización básica de los registros para que sigan el esquema del catálogo.

No incluye investigar precios, redactar 300 descripciones desde cero, crear fotografías de producto ni verificar indicaciones médicas. Esas tareas requieren contenido aprobado por la clínica y, si se solicitan, se cotizarán antes de realizarlas.

## 5. Fichas de producto

Cada producto activo tendrá una dirección propia y una página que podrá mostrar:

- Nombre y marca.
- Descripción proporcionada o aprobada por Medipiel.
- Imagen del producto.
- Precio y moneda aprobados, o el texto “Consultar precio”.
- Botón de consulta por WhatsApp con el nombre del producto en el mensaje.
- Enlace para regresar al catálogo.

Las fichas no afirmarán disponibilidad, resultados médicos ni recomendaciones personalizadas sin autorización expresa. El contenido del sitio no sustituye la consulta con un profesional de salud.

## 6. Consultas por WhatsApp

Cada botón abrirá WhatsApp en una pestaña nueva con un mensaje preparado que identifica el producto consultado. El visitante podrá revisar y enviar el mensaje desde su propia cuenta.

Para activar esta función en producción, Medipiel debe proporcionar el número oficial de WhatsApp en formato internacional, solo con dígitos. El número actual de ejemplo del proyecto es un marcador y **no se publicará como contacto real**.

WhatsApp se usará para consultas. El sitio no prometerá que el producto está en existencia, no procesará pagos y no completará una compra o reserva automáticamente.

## 7. Administración y actualización del catálogo

El proyecto contempla organizar los productos en archivos versionados y generar un índice JSON público para que el catálogo pueda cargar hasta 300 registros sin intentar leer directorios desde el navegador. Se incluye validación de campos, IDs duplicados, categoría, moneda, precio e imagen, además de excluir productos inactivos.

La configuración de Decap CMS y su autenticación segura se realizará cuando Medipiel confirme el repositorio y el método de publicación disponible. El acceso requiere cuentas y permisos que serán gestionados por Medipiel; no se solicitarán contraseñas ni tokens por este documento. Cualquier tarifa de un proveedor externo de autenticación, si la solución elegida la requiere, no forma parte del precio de desarrollo.

## 8. Entregables incluidos

- Sitio con las páginas y vistas descritas en esta propuesta.
- Diseño adaptable a móvil, tableta y escritorio.
- Catálogo con filtros, búsqueda, ordenamiento y paginación de 12 productos.
- Fichas individuales y enlaces de consulta por WhatsApp.
- Carga inicial de hasta 300 productos con datos e imágenes proporcionados y aprobados por Medipiel.
- Estructura de datos y generación del índice público del catálogo.
- Configuración de Decap CMS para administrar productos y categorías, con autenticación protegida mediante el método compatible que se acuerde.
- Dos rondas de ajustes visuales o de contenido dentro del alcance aprobado.
- Publicación inicial en el hosting existente, siempre que el plan permita alojar el sitio estático y Medipiel confirme dominio, repositorio y configuración. Las credenciales se gestionan de forma segura y no se solicitan por chat.
- Instrucciones básicas para actualizar el catálogo y validar el índice.

## 9. Inversión

### Precio fijo del proyecto: **US$700**

El precio cubre el alcance descrito en esta propuesta, incluida la carga inicial de hasta 300 productos bajo las condiciones indicadas. No incluye dominio, hosting, tarifas de terceros, creación de contenido comercial o médico que no haya sido proporcionado, ni funcionalidades adicionales fuera de alcance.

Los cambios adicionales solicitados después de aprobar el diseño y las dos rondas incluidas se estimarán y aprobarán por separado antes de ejecutarse.

## 10. Información que debe proporcionar Medipiel

Para preparar el contenido y publicar correctamente, la clínica debe confirmar:

- Logotipo y fotografías propias autorizadas, si están disponibles.
- Textos institucionales y servicios reales.
- Nombres, fotografías, credenciales y biografías autorizadas de especialistas.
- Dirección, teléfono, correo, horarios y dominio oficiales.
- Número oficial de WhatsApp.
- Hoja de cálculo de productos y categorías, con precios y moneda confirmados.
- Imágenes autorizadas para los productos.
- Repositorio y rama de GitHub sera la del desarrollador web, y modalidad/plan de Hostinger para definir la publicación que tiene costo adicional al momento de la compra del plan.

La información médica, de contacto y comercial debe ser revisada por Medipiel antes de ponerse en producción. Los datos de demostración existentes en el repositorio no se consideran información real.

## 11. Aprobación

La aprobación de esta propuesta confirma el alcance descrito y el precio fijo de **US$700**. Los detalles de calendario y forma de pago se acordarán antes de iniciar la etapa de producción.

**Nombre y aprobación de la doctora:** ______________________________________

**Fecha:** __________________________
