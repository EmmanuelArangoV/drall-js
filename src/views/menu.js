import JsonService from "../services/jsonService.js";
import { CardComponent } from "../components/Card.js";
import { SideBardComponent } from "../components/Sidebar.js";

export function MenuView() {

    const main = document.createElement('main');
    main.classList.add('layout');

    // Search wrapper (creado con appendChild)
    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-wrapper');

    const searchIcon = document.createElement('svg');
    searchIcon.classList.add('search-icon');
    searchIcon.setAttribute('viewBox','0 0 24 24');
    searchIcon.innerHTML = `<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

    const input = document.createElement('input');
    input.type = 'search';
    input.classList.add('search');
    input.placeholder = 'Search food...';

    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(input);

    // Filter group
    const filterGroup = document.createElement('div');
    filterGroup.classList.add('filter-group');

    const btnAll = document.createElement('button');
    btnAll.classList.add('filter-button','active');
    btnAll.textContent = 'All';

    const btnBurgers = document.createElement('button');
    btnBurgers.classList.add('filter-button');
    btnBurgers.innerHTML = `<svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/></svg> Burgers`;

    const btnSides = document.createElement('button');
    btnSides.classList.add('filter-button');
    btnSides.innerHTML = `<svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11L12 2L21 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V20C3 20.5523 3.44772 21 4 21H9V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V21H20C20.5523 21 21 20.5523 21 20V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Sides`;

    const btnDrinks = document.createElement('button');
    btnDrinks.classList.add('filter-button');
    btnDrinks.innerHTML = `<svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H6" stroke="currentColor" stroke-width="2"/><path d="M12 2V11M12 11L9 8M12 11L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Drinks`;

    filterGroup.appendChild(btnAll);
    filterGroup.appendChild(btnBurgers);
    filterGroup.appendChild(btnSides);
    filterGroup.appendChild(btnDrinks);

    // Grid
    const grid = document.createElement('div');
    grid.classList.add('grid');
    productsRender(grid);

    const section = document.createElement('section');
    section.classList.add('content');
    const title = document.createElement('h1'); title.classList.add('page-title'); title.textContent = 'Our Menu';
    section.appendChild(title);
    section.appendChild(searchWrapper);
    section.appendChild(filterGroup);
    section.appendChild(grid);
    const sidebar = SideBardComponent();

    main.appendChild(section);
    main.appendChild(sidebar);

    return main;
}

function productsRender(grid) {

    JsonService.getProducts().then(response => {
        if(response.success) {
            const products = response.products;

            products.forEach(product => {
                const productCard = CardComponent(product);
                grid.appendChild(productCard);
            });
        }
    }) .catch(error => {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Error loading products." + error.message;
        grid.appendChild(errorMessage);
    });
}