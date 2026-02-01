const API_BASE = "http://localhost:3000";

class JsonService {

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