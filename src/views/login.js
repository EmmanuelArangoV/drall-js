import AuthServices from "../services/authServices.js";

export function LoginView() {
    const main = document.createElement('main');
    main.classList.add('container');

    // Header / Brand Section
    const brand = document.createElement('div'); // <div>
    brand.classList.add('brand');
    brand.innerHTML = `
            <div class="icon-circle">
                <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 9H9V2H15V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 11V13H21V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 13L6 22H18L16 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h1 class="title">RestorApp</h1>
            <p class="subtitle">Login to your account</p>`;

    // Form Section
    const form = document.createElement('form');
    form.classList.add('form');
    form.innerHTML = `
            <div class="field">
                <label for="email" class="label">Email Address</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="email" id="email" class="input" placeholder="name@example.com">
                </div>
            </div>

            <div class="field">
                <label for="password" class="label">Password</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="password" id="password" class="input" placeholder="••••••••">
                </div>
            </div>
            
            <p id="login-error" class="form-error" style="display:none;color:red;"></p>

            <button type="submit" class="button primary">Sign In</button>

            <p class="footer-text">
                Don't have an account? <a href="register.html" class="link">Sign up</a>
            </p>`;

    // Footer
    const footer = document.createElement('footer');
    footer.classList.add('page-footer');
    footer.innerHTML = "RestorApp Academic Simulation"


    const card = document.createElement('div');
    card.classList.add('card');
    card.appendChild(brand);
    card.appendChild(form);

    main.appendChild(card);
    main.appendChild(footer);

    loginRequest(main);

    return main;
}

function loginRequest(main) {
    const formEvent = main.querySelector('.form');
    const errorMsg = main.querySelector('#login-error'); // Mensaje de error

    formEvent.addEventListener('submit', async (e) => {
        e.preventDefault(); // Esto hace que no se recargue la página al enviar el formulario

        const email = formEvent.querySelector('#email').value.toLowerCase();
        const password = formEvent.querySelector('#password').value;

        // Vamos a crear la API para login en la carpeta de services (authServices)
        try {
            if (!email || !password) {
                throw new Error("Email or password is required");
            }

            // Es obligatorio enviar los dos parámetros, de lo contrario son null
            const response = await AuthServices.login(email, password);

            if (!response.success) {
                throw new Error (response.error || 'Error during login. Please try again.');
            }

            console.log(response);
            window.location.hash = '#dashboard';
        } catch (error) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = error.message || 'Error during login. Please try again later.';
        }
    });
}




