import api from '../libs/axios';

export const authService = {
    signUp: async (username: string, password: string, email: string, firstname: string, lastname: string) => {
        const res = await api.post(
            '/auth/signup',
            { username, password, email, firstname, lastname },
            { withCredentials: true },
        );

        return res.data;
    },
    signIn: async (email: string, password: string) => {
        const res = await api.post('/auth/signin', { email, password }, { withCredentials: true });
        return res.data;
    },
    signOut: async () => {
        const res = await api.get('/auth/signout', { withCredentials: true });
        return res.data;
    },
    fetchMe: async () => {
        const res = await api.get('/user/getme', { withCredentials: true });
        return res.data.user;
    },
    refreshToken: async () => {
        const res = await api.post('/auth/refresh', { withCredentials: true });
        return res.data.accessToken;
    },
};
