import store from "../state/store.js";

// Crea un enlace (<a>) con atributos básicos
function createNavLink(text, hash, className = '') {
    const a = document.createElement('a');
    a.href = hash;
    a.className = `nav-link ${className}`.trim();
    a.textContent = text;
    return a;
}

// Crea el navbar. Se puede llamar varias veces; también expone una función update
export function createNavbar() {
    const header = document.createElement('header');
    header.classList.add('header');

    const container = document.createElement('div');
    container.classList.add('header-content');

    // Logo
    const logo = document.createElement('div');
    logo.classList.add('logo');
    const logoText = document.createElement('span');
    logoText.classList.add('logo-text');
    logoText.textContent = 'RestorApp';
    logo.appendChild(logoText);

    // Nav container
    const nav = document.createElement('nav'); nav.classList.add('nav');
    // Right side (avatar / auth actions)
    const right = document.createElement('div'); right.classList.add('nav-actions');

    // Crear enlaces por defecto
    const links = {
        home: createNavLink('Home', '#/'),
        menu: createNavLink('Menu', '#/menu'),
        profile: createNavLink('Profile', '#/profile'),
        orders: createNavLink('Orders', '#/profile'),
        admin: createNavLink('Dashboard', '#/admin'),
        login: createNavLink('Login', '#/login'),
        register: createNavLink('Register', '#/register')
    };

    // Botón logout
    const logoutBtn = document.createElement('button'); logoutBtn.classList.add('button','secondary','small'); logoutBtn.textContent = 'Log Out';
    logoutBtn.addEventListener('click', () => { store.setUser(null); window.location.hash = '#/login'; });

    // Avatar container
    const avatar = document.createElement('div'); avatar.classList.add('avatar','small'); avatar.style.display = 'none';
    const avatarImg = document.createElement('img'); avatarImg.alt = 'User'; avatar.appendChild(avatarImg);

    container.appendChild(logo);
    container.appendChild(nav);
    container.appendChild(right);
    header.appendChild(container);

    // Update function que ajusta la barra según el usuario/role
    function renderFor(user) {
        // limpiar nav y right
        while (nav.firstChild) nav.removeChild(nav.firstChild);
        while (right.firstChild) right.removeChild(right.firstChild);

        const role = user && user.role ? user.role : null;

        // Si no hay usuario
        if (!user) {
            nav.appendChild(links.home);
            nav.appendChild(links.menu);
            right.appendChild(links.login);
            right.appendChild(links.register);
            avatar.style.display = 'none';
        } else if (role === 'admin') {
            nav.appendChild(links.admin);
            // admin could still go to home if wanted
            right.appendChild(avatar);
            right.appendChild(logoutBtn);
            avatar.style.display = '';
            avatarImg.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||user.email)}&background=00D26B&color=fff&size=80`;
        } else {
            // normal user
            nav.appendChild(links.menu);
            nav.appendChild(links.profile);
            nav.appendChild(links.orders);
            right.appendChild(avatar);
            right.appendChild(logoutBtn);
            avatar.style.display = '';
            avatarImg.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||user.email)}&background=00D26B&color=fff&size=80`;
        }
    }

    // Suscribirse al store para actualziaciones de user
    store.subscribeUser(user => renderFor(user));
    // Inicializar estado
    renderFor(store.getUser());

    return header;
}
