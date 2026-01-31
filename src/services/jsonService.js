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
}

export default new JsonService();