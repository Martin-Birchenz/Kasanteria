# Nüdo e Hilarias — E-commerce & Panel de Administración

Plataforma web de comercio electrónico y gestión integral desarrollada para **Nüdo e Hilarias** (mercería, telas e hilados). Permite la exploración interactiva del catálogo, armado de pedidos a medida y un panel de administración completo para el control de inventario, rubros y pedidos.

---

## Características Principales

### Tienda Pública (Storefront)
* **Catálogo interactivo:** Navegación dinámica por categorías, subcategorías y etiquetas de stock.
* **Ficha de producto detallada:** Galería de imágenes, selector de variantes/colores, cantidades y cálculo en vivo.
* **Carrito de compras:** Gestión de productos seleccionados y checkout guiado (pedidos por WhatsApp / contacto directo).
* **Piezas destacadas:** Exhibición prioritaria de productos en portada.

### Panel de Administración (Dashboard)
* **Gestión de Productos (CRUD):** Creación, edición, baja lógica (*soft delete*) y carga múltiple de imágenes.
* **Control de visibilidad y destacados:** Activación/pausa de productos y asignación a destacados en un clic.
* **Control de Stock y Alertas:** Umbral de stock mínimo con advertencias visuales automáticas.
* **Gestión de Rubros:** Creación y organización de categorías principales y subcategorías.
* **Gestión de Pedidos:** Visualización de órdenes entrantes, detalles de cliente/entrega y actualización de estado (*pendiente*, *completado*, *cancelado*).

---

## Stack Tecnológico

* **Frontend:**
  * React (Vite)
  * React Router DOM
  * Context API (Autenticación y Carrito de compras)
  * CSS3 puro (estética editorial / responsive)
* **Backend:**
  * Node.js & Express
  * Arquitectura por capas (Rutas, Controladores, Servicios, Repositorios)
  * Multer & `multer-storage-cloudinary`
  * JSON Web Tokens (JWT) para autenticación Bearer
* **Base de Datos:**
  * MySQL (Aiven Cloud)
* **Almacenamiento Multimedia:**
  * Cloudinary (persistencia y optimización de imágenes en la nube)
* **Despliegue e Infraestructura:**
  * Frontend: **Vercel**
  * Backend: **Render**

---

## Decisiones Clave de Arquitectura & Resiliencia

* **Estrategia de Autenticación Híbrida / Móvil:** Implementación de tokens JWT persistidos en el cliente y enviados mediante la cabecera `Authorization: Bearer <token>`, evitando el bloqueo de cookies de terceros (*Cross-Site Cookies/ITP*) en navegadores móviles (iOS Safari / Android Chrome).
* **Almacenamiento Multimedia Desacoplado:** Migración de almacenamiento local a Cloudinary, previniendo la pérdida de archivos ante el reinicio del sistema de archivos efímero de Render.
* **Integridad Referencial (Soft Delete):** Preservación del histórico de pedidos mediante bajas lógicas (`is_active = 0`) para productos con órdenes de compra asociadas.

---

## 📂 Estructura del Proyecto

```text
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/             # Recursos estáticos e imágenes base
│   │   ├── components/         # Componentes reutilizables (Navbar, Footer, Loader, etc.)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Vistas públicas y de administración
│   │   ├── services/           # Llamadas a la API (api.js, adminService.js)
│   │   └── styles/             # Hojas de estilo modulares
│   └── package.json
│
└── server/                     # Backend (Node.js + Express)
    ├── src/
    │   ├── config/             # Configuración de Cloudinary y Base de Datos
    │   ├── controllers/        # Controladores de lógica de endpoints
    │   ├── middlewares/        # Autenticación y subida de archivos
    │   ├── repositories/       # Consultas y persistencia SQL
    │   ├── routes/             # Definición de rutas y endpoints
    │   └── services/           # Lógica de negocio (ProductService, etc.)
    └── package.json
