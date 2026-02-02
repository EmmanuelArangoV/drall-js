export function ErrorView(opts = {}) {
    const { code = 404, message = '' } = opts;

    const main = document.createElement('main');
    main.classList.add('container');

    const card = document.createElement('div'); card.classList.add('card');
    const h1 = document.createElement('h1'); h1.textContent = code === 403 ? '403 - Forbidden' : code === 500 ? '500 - Server Error' : '404 - Not Found';
    const p = document.createElement('p');
    if (message) p.textContent = message;
    else {
        if (code === 403) p.textContent = 'You do not have permission to view this page.';
        else if (code === 500) p.textContent = 'An unexpected error occurred while rendering the page.';
        else p.textContent = 'The page you are looking for could not be found.';
    }

    const back = document.createElement('a'); back.href = '#/'; back.classList.add('link'); back.textContent = 'Go back home';

    card.appendChild(h1);
    card.appendChild(p);
    card.appendChild(back);

    main.appendChild(card);
    return main;
}
