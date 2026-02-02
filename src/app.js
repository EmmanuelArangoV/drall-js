import { LoginView } from "./views/login.js";
import { RegisterView } from "./views/register.js";
import { MenuView } from "./views/menu.js";
import { AdminView } from "./views/admin.js";
import { ProfileView } from "./views/profile.js";
import { ErrorView } from "./views/error.js";
import { createNavbar } from "./components/Navbar.js";
import store from "./state/store.js";

const app = document.getElementById('app');

// Contenedor principal donde montamos navbar + vista
function clearApp() {
    while (app.firstChild) app.removeChild(app.firstChild);
}

// Mapa de rutas: path -> { view, requiresAuth, allowedRoles }
const routeMap = {
    '/': { view: MenuView },
    '/menu': { view: MenuView },
    '/login': { view: LoginView },
    '/register': { view: RegisterView },
    '/admin': { view: AdminView, requiresAuth: true, allowedRoles: ['admin'] },
    '/profile': { view: ProfileView, requiresAuth: true, allowedRoles: ['user'] },
    '/error': { view: ErrorView }
};

function parseLocationHashWithQuery() {
    // Ejemplos de hash: '#/admin', '#/error?code=403'
    const hash = window.location.hash || '#/';
    const pathWithQuery = hash.startsWith('#') ? hash.slice(1) : hash;
    const [pathname, queryString] = pathWithQuery.split('?');

    const query = {};
    if (queryString) {
        queryString.split('&').forEach(pair => {
            const [k, v] = pair.split('=');
            if (k) query[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
        });
    }

    return { pathname, query };
}

function roleGuard(route) {
    if (!route.requiresAuth) return true;
    const user = store.getUser();
    if (!user) return false;
    if (route.allowedRoles && route.allowedRoles.length > 0) {
        return route.allowedRoles.includes(user.role);
    }
    return true;
}

function route() {
    const { pathname, query } = parseLocationHashWithQuery();
    const route = routeMap[pathname] || routeMap['/error'];

    // Guard
    if (!roleGuard(route)) {
        window.location.hash = '#/error?code=403';
        return;
    }

    // Render
    clearApp();
    // Navbar montado en todas las páginas
    const navbar = createNavbar();
    app.appendChild(navbar);

    // Render view
    try {
        let viewEl;
        if (route.view === ErrorView) {
            // Pasar opciones si existen
            const code = query && query.code ? Number(query.code) : undefined;
            viewEl = ErrorView({ code });
        } else {
            viewEl = route.view ? route.view() : ErrorView({ code: 404 });
        }
        app.appendChild(viewEl);
    } catch (e) {
        console.error('Error rendering view', e.message || e);
        const err = ErrorView({ code: 500, message: 'Rendering error' });
        app.appendChild(err);
    }
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);

// Export route for tests or usage
export { route };
