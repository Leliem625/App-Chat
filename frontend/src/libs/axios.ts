import { useStoreUser } from '../store/useStoreUser';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
//Tự động gắn acesssToken vào headers
api.interceptors.request.use((config) => {
    const { accessToken } = useStoreUser.getState();
  
    if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
    }

    return config;
});
//Tự refresh khi tokne hết hạn
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // những api không cần check
        if (
            originalRequest.url.includes('/auth/signin') ||
            originalRequest.url.includes('/auth/signup') ||
            originalRequest.url.includes('/auth/refresh')
        ) {
            return Promise.reject(error);
        }

        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            try {
                const re = await api.post('/auth/refresh');
                const newAccessToken = re.data.accessToken;

                useStoreUser.getState().setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useStoreUser.getState().clearState();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
export default api;
