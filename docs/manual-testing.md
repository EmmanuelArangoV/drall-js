Manual de pruebas - RestorApp

Resumen de cambios:
- Implementado router en `src/app.js` que escucha `load` y `hashchange`.
- `Navbar` movido a `src/components/Navbar.js` y construido con appendChild.
- `admin` y `profile` convertidos a vistas en `src/views/admin.js` y `src/views/profile.js`.
- `src/views/error.js` implementada para mostrar 403/404/500.
- `src/state/store.js` refactorizado: ahora persiste `cart` y `user` en localStorage; expone `getUser`, `setUser`, `getRole`, `subscribeUser`, además de la API del carrito existente.
- `login` y `register` actualizados para usar hash-routes y guardar usuario en store.

Pasos de prueba manual rápida:
1. Iniciar el backend JSON-server (si aplica):
   - Asegúrate de tener `json-server` corriendo en `http://localhost:3000` con `db.json`.
2. Abrir `index.html` en el navegador (o servir la carpeta con un servidor estático).
3. Verificar navegación:
   - Ir a `#/menu` debería mostrar el menú.
   - Ir a `#/login` muestra el formulario de login.
4. Probar registro:
   - Crear un usuario en `#/register` (role: user o admin).
   - Tras registro deberías ir a `#/login`.
5. Probar login:
   - Hacer login con credenciales guardadas en `json-server`.
   - Al iniciar sesión se guarda el usuario en `localStorage` bajo la key `restautant_session` y la navbar cambia.
   - Si el role es `admin`, al loguearse se redirige a `#/admin`.
6. Probar guard de rutas:
   - Abrir `#/admin` sin estar logueado debe redirigir a `#/error?code=403`.
   - Abrir `#/admin` como usuario `role: user` debe redirigir igualmente a `#/error?code=403`.
7. Verificar persistencia:
   - Recargar la página tras estar logueado debe mantener el estado (navbar con avatar y links correspondientes).
8. Probar carrito (sin cambios):
   - Ir a `#/menu`, añadir productos; comprobar que el `store` mantiene el carrito en localStorage.

Ubicaciones importantes:
- Router: `src/app.js`
- Store: `src/state/store.js`
- Navbar: `src/components/Navbar.js`
- Vistas: `src/views/*.js` (menu, login, register, admin, profile, error)

Notas y supuestos:
- `AuthServices` y `JsonService` usan `http://localhost:3000` como API. Se asume que JSON Server está corriendo con la estructura esperada.
- He convertido `admin.html` y `profile.html` en páginas puente que redirigen a `index.html#/admin` y `index.html#/profile` para evitar enlaces rotos.
- Se conservó la API pública del carrito (`addToCart`, `updateQuantity`, etc.) para no romper la funcionalidad existente.

Siguientes pasos recomendados:
- Integrar llamadas reales a la API para cargar órdenes en `AdminView`.
- Añadir tests unitarios para `store` y el router.
- Mejorar accesibilidad y refinamiento visual del `Navbar` y las vistas.
