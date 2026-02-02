const API_BASE = "http://localhost:3000";

class JsonService {

    // USERS
    async getUsers() {
        try {
            const res = await fetch(`${API_BASE}/users`);
            if (!res.ok) throw new Error('Error fetching users');
            const users = await res.json();
            return { success: true, users };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserById(id) {
        try {
            const res = await fetch(`${API_BASE}/users/${id}`);
            if (!res.ok) throw new Error('User not found');
            const user = await res.json();
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserByEmail(email) {
        try {
            const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
            if (!res.ok) throw new Error('Error fetching user by email');
            const data = await res.json();
            return { success: true, users: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createUser(user) {
        try {
            const res = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (!res.ok) throw new Error('Error creating user');
            const newUser = await res.json();
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserByCredentials(email, password) {
        try {
            const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (!res.ok) throw new Error('Error verifying credentials');
            const data = await res.json();
            return { success: true, users: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // PRODUCTS
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE}/products`);

            if(!response.ok) {
                throw new Error('Error fetching products');
            }
            const products = await response.json();

            return { success: true, products };
        } catch(error) {
            return { success: false, error: error.message };
        }
    }

    async getProductById(id) {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`);
            if (!res.ok) throw new Error('Product not found');
            const product = await res.json();
            return { success: true, product };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ORDERS
    async getOrders() {
        try {
            const res = await fetch(`${API_BASE}/orders`);
            if (!res.ok) throw new Error('Error fetching orders');
            const orders = await res.json();
            return { success: true, orders };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getOrderById(id) {
        try {
            const res = await fetch(`${API_BASE}/orders/${id}`);
            if (!res.ok) throw new Error('Order not found');
            const order = await res.json();
            return { success: true, order };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateOrder(id, patch) {
        try {
            const res = await fetch(`${API_BASE}/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Error updating order');
            }
            const data = await res.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async postOrder(order) {
        try {
            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Error posting order');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new JsonService();