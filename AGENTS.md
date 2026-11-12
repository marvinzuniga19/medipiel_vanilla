# AGENTS.md --- Proyecto Medipiel

## 1. Propósito del proyecto

Este archivo establece las instrucciones de trabajo para continuar y
finalizar el desarrollo del sitio web de **Medipiel**, una clínica
dermatológica en Managua, Nicaragua.

El proyecto debe ofrecer:

-   Un sitio institucional con páginas estáticas.
-   Un catálogo de aproximadamente 300 productos dermatológicos.
-   Paginación de 12 productos por página (25 páginas cuando existan 300
    productos).
-   Búsqueda, filtros por categoría y ordenamiento.
-   Fichas individuales de producto.
-   Consultas de productos por WhatsApp; no implementar pagos en línea
    salvo solicitud expresa.
-   Un CMS pequeño para administrar páginas, productos, categorías,
    marcas e imágenes.
-   Diseño responsive, accesible, seguro y optimizado para producción.

## 2. Decisiones técnicas acordadas

Mantener estas decisiones salvo que el usuario autorice un cambio:

-   Frontend: HTML5, CSS3 y JavaScript Vanilla.
-   CMS: Decap CMS.
-   Contenido y catálogo: archivos versionados en Git; productos
    individuales en archivos de contenido y un índice JSON generado
    automáticamente.
-   Repositorio: GitHub.
-   Hosting final: Hostinger.
-   Estilo visual: premium, minimalista, limpio, dermatológico y
    profesional.
-   Paleta inicial:
    -   Marfil: `#F8F8F4`
    -   Verde salvia: `#DDE8DF`
    -   Verde principal: `#426B58`
    -   Verde oscuro: `#263D32`
-   Tipografías propuestas: Inter y Playfair Display.
-   WhatsApp: enlace de consulta con el nombre del producto. El número
    real debe solicitarse al usuario; nunca inventarlo.
-   Moneda y precios: se propuso NIO en los datos de demostración, pero
    validar moneda, precios y datos comerciales reales antes de
    publicar.

No introducir React, Vue, Angular, frameworks CSS ni un backend nuevo
sin explicar la razón y obtener aprobación.

## 3. Forma de trabajo

1.  Continuar desde el estado real de los archivos del repositorio; no
    asumir que los fragmentos de conversaciones anteriores fueron
    aplicados.
2.  Antes de modificar, inspeccionar la estructura, los archivos
    relevantes y el estado de Git.
3.  Dar instrucciones paso a paso, indicando la ruta exacta de cada
    archivo.
4.  Entregar archivos completos cuando sea más seguro que instrucciones
    parciales.
5.  No reemplazar código existente sin revisar sus dependencias.
6.  Mantener los cambios pequeños, coherentes y verificables.
7.  Después de cada etapa, proporcionar comandos concretos de prueba y
    criterios de aceptación.
8.  No afirmar que algo está implementado o probado si no se ha
    ejecutado o inspeccionado.
9.  Si faltan datos del negocio, usar marcadores claros y pedir
    confirmación antes de publicar.
10. No solicitar al usuario que comparta contraseñas, tokens, claves
    privadas ni credenciales.

## 4. Estado de partida conocido

La conversación anterior propuso esta estructura:

``` text
medipiel/
├── index.html
├── nosotros.html
├── servicios.html
├── especialistas.html
├── catalogo.html
├── contacto.html
├── producto.html
├── admin/
│   ├── index.html
│   └── config.yml
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── responsive.css
│   │   └── components.css
│   ├── js/
│   │   ├── main.js
│   │   ├── catalog.js
│   │   ├── products.js
│   │   └── whatsapp.js
│   ├── images/
│   └── icons/
├── content/
│   ├── products/
│   ├── pages/
│   └── categories/
├── data/
│   └── products-index.json
└── .github/
    └── workflows/
        └── catalog.yml
```

También se propusieron `assets/js/product-detail.js` y
`assets/js/utils.js`; crearlos si aún no existen.

**Importante:** verificar la estructura real antes de crear o mover
archivos. El ejemplo de seis productos se indicó como un único archivo
temporal `data/products-demo.json`, no como seis archivos individuales.
No confundir ese formato de demostración con el formato definitivo del
CMS.

## 5. Punto exacto para reanudar

Reanudar en la corrección y consolidación de la ficha de producto, justo
después de esta indicación:

> Agregar `product-detail.js` en `producto.html` y asegurar que
> `formatPrice()` esté disponible en esa página mediante una función
> compartida o una implementación equivalente.

### 5.1 Centralizar utilidades

Crear `assets/js/utils.js` si no existe. Debe exportar en ámbito global
(scripts clásicos) o integrarse de forma consistente con el sistema de
módulos elegido. Para el enfoque actual de scripts clásicos, una
implementación inicial segura es:

``` javascript
function formatPrice(price, currency = "NIO") {
  if (price === null || price === undefined || price === "") {
    return "Consultar precio";
  }

  const amount = Number(price);
  if (!Number.isFinite(amount)) {
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
```

Eliminar duplicados de `formatPrice()` de `catalog.js` y
`product-detail.js` una vez que ambos carguen `utils.js`.

En `catalogo.html`, el orden de scripts debe ser:

``` html
<script src="assets/js/utils.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/whatsapp.js"></script>
<script src="assets/js/catalog.js"></script>
```

En `producto.html`:

``` html
<script src="assets/js/utils.js"></script>
<script src="assets/js/whatsapp.js"></script>
<script src="assets/js/product-detail.js"></script>
```

El script que define una función debe cargarse antes del script que la
utiliza.

### 5.2 Corregir y verificar la ficha de producto

Revisar `producto.html`, `assets/js/product-detail.js` y los estilos de
detalle.

Requisitos:

-   Leer el identificador desde
    `new URLSearchParams(window.location.search).get("id")`.
-   Buscar el producto en la fuente de datos configurada.
-   No insertar contenido de producto mediante `innerHTML`; usar
    `createElement`, `textContent` y atributos validados para evitar
    XSS.
-   Manejar identificador ausente, producto inexistente, producto
    inactivo, errores HTTP y JSON inválido.
-   Mostrar nombre, marca, descripción, imagen, precio o texto de
    consulta.
-   El enlace WhatsApp debe usar `getWhatsAppLink()` y abrir con
    `target="_blank"` más `rel="noopener noreferrer"`.
-   Validar o controlar las URLs de imágenes; no permitir esquemas
    peligrosos como `javascript:`.
-   Actualizar el título del documento con el nombre del producto.
-   Añadir navegación de regreso al catálogo.
-   Añadir estilos responsive para escritorio y móvil.
-   Asegurar que `formatPrice()` está disponible antes de ejecutar la
    ficha.

### 5.3 Corregir la carga de datos

El catálogo anterior carga `data/products-demo.json`, mientras que el
diseño definitivo contempla `data/products-index.json`. Mantener el
archivo demo solo durante pruebas. Antes de integrar el CMS, definir una
única fuente pública de datos y actualizar tanto `catalog.js` como
`product-detail.js` para utilizarla.

No intentar cargar directamente archivos JSON arbitrarios del directorio
`content/products/` desde el navegador: los navegadores no pueden listar
directorios de forma portable. El índice debe enumerar los productos
publicados.

## 6. Modelo de datos definitivo

Definir y documentar un esquema consistente. Cada producto debe incluir,
como mínimo:

-   `id`: identificador único estable.
-   `name`: nombre visible.
-   `slug`: identificador legible para URL, si se utiliza.
-   `brand`: marca.
-   `category`: identificador de categoría.
-   `description`: descripción comercial revisada.
-   `image`: ruta de imagen.
-   `price`: número o `null` si se consulta.
-   `currency`: código ISO de moneda.
-   `featured`: booleano.
-   `active`: booleano.
-   `stock`: texto opcional de disponibilidad, si la clínica lo
    confirma.

Validar datos antes de generar el índice:

-   IDs únicos y no vacíos.
-   Nombres requeridos.
-   Categorías válidas.
-   Precios numéricos no negativos o nulos.
-   Moneda válida.
-   Imágenes con rutas o URLs permitidas.
-   Productos inactivos excluidos del catálogo público.
-   Evitar afirmar existencias, beneficios médicos o indicaciones no
    verificadas.

Los productos de demostración y sus precios no son datos reales de
Medipiel. No publicarlos como si lo fueran.

## 7. Catálogo

El catálogo debe:

-   Mostrar exactamente 12 productos por página, excepto la última
    página.
-   Calcular páginas dinámicamente: `Math.ceil(total / 12)`.
-   Mantener búsqueda por nombre, marca, categoría y descripción.
-   Permitir filtro por categoría.
-   Permitir orden alfabético y por precio ascendente/descendente.
-   Reiniciar a página 1 cuando cambie búsqueda, filtro u orden.
-   Mostrar cantidad de resultados y estado vacío.
-   Deshabilitar correctamente los controles anterior/siguiente.
-   Ser usable con teclado y lectores de pantalla.
-   No generar botones para todas las páginas si el catálogo crece
    mucho; implementar una ventana de paginación razonable con anterior,
    siguiente, primera/última y páginas cercanas.
-   Mantener orden estable cuando los valores sean iguales.
-   Manejar productos sin precio sin tratarlos como precio cero.
-   Cargar imágenes de forma diferida y usar dimensiones/relación de
    aspecto estables.
-   Evitar insertar HTML dinámico sin sanitización.

Para 300 productos, la carga de un índice JSON único es suficiente
inicialmente. No implementar paginación de servidor salvo que los
requisitos de rendimiento lo justifiquen.

## 8. WhatsApp

Mantener la función en `assets/js/whatsapp.js`.

-   Usar el formato internacional solo con dígitos, sin `+`, espacios ni
    guiones.
-   El número actual de ejemplo `505XXXXXXXX` es un marcador y no debe
    publicarse.
-   Pedir al usuario el número oficial antes de producción.
-   Codificar el mensaje con `URLSearchParams`.
-   El mensaje debe identificar el producto consultado.
-   No prometer compra, reserva ni disponibilidad automática.

## 9. Decap CMS

Cuando catálogo y páginas estén estabilizados, configurar Decap CMS en
`admin/`.

Tareas:

1.  Crear `admin/index.html` cargando la versión estable y fijada de
    Decap CMS.
2.  Configurar `admin/config.yml`.
3.  Configurar backend GitHub con el propietario y repositorio reales,
    que deben ser proporcionados o confirmados por el usuario.
4.  Configurar rama de publicación.
5.  Crear colecciones para:
    -   Productos.
    -   Categorías.
    -   Páginas institucionales.
    -   Configuración general del sitio.
6.  Definir campos requeridos, opciones, widgets y rutas de medios.
7.  Configurar `media_folder` y `public_folder` coherentes con
    Hostinger.
8.  Probar crear, editar, desactivar y eliminar contenido.
9.  Asegurar que los productos inactivos no aparezcan públicamente.
10. Documentar el flujo de publicación y recuperación de cambios.

### Seguridad del CMS

Decap necesita autenticación para escribir en GitHub. El sitio estático
alojado en Hostinger no proporciona por sí mismo OAuth.

-   Investigar y elegir una solución de autenticación compatible y
    mantenida (por ejemplo, un servicio OAuth adecuado o proxy propio).
-   Verificar compatibilidad actual con Decap CMS, GitHub y el hosting
    elegido.
-   Nunca incrustar un token personal de GitHub, secreto OAuth o clave
    privada en HTML, CSS, JavaScript o archivos públicos.
-   Configurar secretos únicamente en el entorno seguro del proveedor
    correspondiente.
-   Aplicar permisos mínimos y proteger la rama principal cuando sea
    viable.
-   No asumir que una solución llamada "Decap Turbo" está disponible o
    es adecuada sin verificar documentación y mantenimiento.
-   No exponer el panel administrativo como sustituto de autenticación:
    proteger la escritura en el repositorio.

## 10. Generación automática del índice

Implementar un script de compilación, por ejemplo
`scripts/build-catalog.js` o equivalente, que:

1.  Lea los archivos de productos gestionados por CMS.
2.  Valide cada producto.
3.  Normalice los campos.
4.  Excluya productos inactivos.
5.  Ordene de forma determinista.
6.  Genere `data/products-index.json`.
7.  Falle con mensaje claro si encuentra datos inválidos.

Crear un workflow de GitHub Actions que ejecute la validación y
regeneración cuando cambien los productos o el script.

El workflow debe:

-   Usar versiones de acciones mantenidas y fijadas de forma razonable.
-   Tener permisos mínimos.
-   No exponer secretos en logs.
-   No crear bucles de commits innecesarios.
-   Verificar el resultado antes de publicar.
-   Documentar si el hosting se actualiza mediante integración Git de
    Hostinger o mediante otro mecanismo autorizado.

La fuente de verdad será el contenido administrado por CMS; el índice es
un artefacto generado, no un archivo que se edita manualmente.

## 11. Páginas institucionales

Completar y mantener consistentes:

-   Inicio.
-   Nosotros.
-   Servicios.
-   Especialistas.
-   Catálogo.
-   Contacto.
-   Ficha de producto.

Todas deben compartir encabezado, navegación, pie de página, tipografía,
colores y componentes.

Contenido médico:

-   No inventar credenciales, nombres de especialistas, tratamientos
    disponibles, horarios, dirección exacta, teléfonos ni afirmaciones
    clínicas.
-   Utilizar marcadores provisionales claramente identificados.
-   Pedir a Medipiel la validación del contenido médico antes de
    publicación.
-   No presentar información comercial como consejo médico
    personalizado.

## 12. Calidad, accesibilidad y rendimiento

Antes de considerar terminado el sitio:

-   Probar en Chrome/Firefox y dispositivos móviles.
-   Verificar enlaces internos y rutas de imágenes.
-   Revisar errores de consola y solicitudes fallidas.
-   Añadir etiquetas semánticas y jerarquía correcta de encabezados.
-   Añadir etiquetas `label` para controles y estados accesibles.
-   Comprobar contraste, foco visible y navegación por teclado.
-   Añadir textos alternativos útiles a imágenes.
-   Optimizar imágenes (WebP/AVIF cuando sea posible), dimensiones y
    carga diferida.
-   Añadir metadatos SEO, títulos y descripciones únicas.
-   Añadir favicon y Open Graph.
-   Configurar página 404.
-   Revisar seguridad de enlaces externos.
-   No almacenar datos personales de pacientes en el catálogo ni en el
    CMS público.
-   Probar que las 300 fichas y las 25 páginas de catálogo funcionen con
    datos representativos.

## 13. Publicación en Hostinger

Antes del despliegue:

1.  Confirmar el plan de Hostinger y que admite el flujo de publicación
    previsto.
2.  Confirmar dominio y DNS con el usuario.
3.  Configurar repositorio Git y rama de producción.
4.  Verificar la carpeta de publicación y rutas relativas/absolutas.
5.  Confirmar HTTPS.
6.  Configurar redirecciones y página 404.
7.  Probar el CMS en el dominio real y verificar autenticación.
8.  Comprobar que las publicaciones del CMS se reflejan en el catálogo.
9.  Hacer copia de seguridad del repositorio y documentar restauración.
10. Ejecutar una lista de comprobación final.

No asumir que todos los planes de Hostinger ofrecen las mismas funciones
Git o despliegue. Verificar el plan real antes de elegir el
procedimiento.

## 14. Datos pendientes de confirmar con el usuario

Solicitar solo cuando sean necesarios:

-   URL o nombre del repositorio GitHub.
-   Número oficial de WhatsApp.
-   Dominio de Medipiel.
-   Plan y modalidad de hosting Hostinger.
-   Dirección, teléfono, correo y horarios oficiales.
-   Servicios reales de la clínica.
-   Nombres, fotografías y credenciales autorizadas de especialistas.
-   Marcas, categorías y datos reales de los 300 productos.
-   Moneda y precios definitivos.
-   Logotipo y fotografías propias, si existen.
-   Quiénes administrarán el CMS y qué permisos necesitan.

Nunca inventar estos datos.

## 15. Criterios de finalización

El proyecto solo se considera terminado cuando:

-   Todas las páginas institucionales están completas y aprobadas.
-   El diseño funciona en móvil, tableta y escritorio.
-   El catálogo procesa 300 productos reales.
-   Se muestran 12 productos por página y la paginación es correcta.
-   Búsqueda, filtros y ordenamiento funcionan.
-   Cada producto tiene una ficha accesible y correcta.
-   WhatsApp abre con el producto en el mensaje y el número oficial.
-   Decap CMS permite administrar las colecciones previstas con
    autenticación segura.
-   El índice se genera automáticamente y valida datos.
-   El sitio está desplegado en Hostinger con HTTPS.
-   No hay errores críticos de consola, enlaces rotos ni imágenes
    faltantes.
-   El contenido médico, comercial y de contacto ha sido aprobado por
    Medipiel.
-   Existe documentación de mantenimiento, publicación y recuperación.

## 16. Próxima acción inmediata

No comenzar todavía el CMS. Primero inspeccionar el repositorio y
retomar el punto 5:

1.  Revisar `producto.html`.
2.  Revisar `assets/js/product-detail.js`.
3.  Revisar `assets/js/catalog.js`.
4.  Revisar `assets/js/whatsapp.js`.
5.  Crear o corregir `assets/js/utils.js`.
6.  Cargar los scripts en el orden correcto.
7.  Probar catálogo y ficha de producto con el servidor local.
8.  Corregir errores detectados antes de avanzar.

Trabajar por etapas, informar qué archivos se modificaron y proporcionar
los comandos exactos para verificar cada entrega.
