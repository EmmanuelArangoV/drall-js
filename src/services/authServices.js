const API_BASE = "http://localhost:3000";

class AuthServices {
    async register(user) {
        try {
            const response = await fetch(`${API_BASE}/users?email=${user.email}`);

            if(!response.ok) {
                throw new Error('Error verifying user credentials');
            }

            const exitingUser = await response.json();

            if (Array.isArray(exitingUser) && exitingUser.length > 0) {
                throw new Error('Email is already registered');
            }

            // POST: Mandar / Guardar
            // PUT: Actualizar
            // PATCH: Actualizar parcialmente
            // DELETE: Borrar --> Evitar usar

            // JSON -> "user": "luis"
            //OBJETO -> user: "luis"

            // js -> bd = JSON.stringify(user)
            // bd -> js = user.json()

            const registerResponse = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if(!registerResponse.ok) {
                throw new Error('Error registering user');
            }

            const newUser = registerResponse.json();

            return { success:true, newUser};
        }catch(error) {
            return { success:false, error: error.message};
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/users?email=${email}&password=${password}`);

            //Por seguridad
            if(!response.ok) {
                throw new Error('Error verifying user credentials');
            }

            // Obtenemos los usuarios
            const data = await response.json();

            // Validamos si usuario existe o no
            if (!Array.isArray(data) ||data.length === 0) {
                throw new Error('Invalid credentials');
            }

            // Obtenemos usuario
            const user = data[0];

            // Retornamos exitoso y el usuario
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new AuthServices();
