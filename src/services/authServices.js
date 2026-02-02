import JsonService from './jsonService.js';

class AuthServices {
    async register(user) {
        try {
            // Verificar existencia por email
            const existing = await JsonService.getUserByEmail(user.email);
            if (!existing.success) {
                throw new Error(existing.error || 'Error verifying user');
            }

            if (Array.isArray(existing.users) && existing.users.length > 0) {
                throw new Error('Email is already registered');
            }

            const created = await JsonService.createUser(user);
            if (!created.success) throw new Error(created.error || 'Error registering user');

            return { success: true, user: created.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const res = await JsonService.getUserByCredentials(email, password);
            if (!res.success) throw new Error(res.error || 'Error verifying credentials');

            const data = res.users;
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid credentials');
            }

            const user = data[0];
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new AuthServices();
