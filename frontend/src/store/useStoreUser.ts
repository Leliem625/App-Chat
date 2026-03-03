import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { message } from 'antd';
import type { AuthUser } from '@/types/store';
import { persist } from 'zustand/middleware';
import { useStoreChat } from './useStoreChat';
export const useStoreUser = create<AuthUser>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            loading: false,

            setAccessToken: (accessToken) => {
                set({ accessToken });
            },
            clearState: () => {
                set({ accessToken: null, user: null, loading: false });
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('chat-storage');
                useStoreChat.getState().reset();
            },
            signUp: async (username, password, email, firstName, lastName) => {
                try {
                    set({ loading: true });

                    //  gọi api
                    await authService.signUp(username, password, email, firstName, lastName);

                    toast.success('Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.');
                } catch (error) {
                    console.error(error);
                    toast.error('Đăng ký không thành công');
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
            signIn: async (email: string, password: string) => {
                try {
                    set({ loading: true });
                    localStorage.clear();
                    useStoreChat.getState().reset();
                    const { accessToken } = await authService.signIn(email, password);
                    get().setAccessToken(accessToken);
                    await get().fetchMe();
                    useStoreChat.getState().fetchConversations();
                    toast.success('Đăng nhập thành công!');
                } catch (error) {
                    console.error(error);
                    message.error('Đăng nhập thất bại!');
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
            signOut: async () => {
                try {
                    get().clearState();
                    await authService.signOut();
                    message.success('Đăng xuất thành công!');
                } catch (error) {
                    console.error(error);
                    toast.error('Lỗi xảy ra khi logout. Hãy thử lại!');
                }
            },
            fetchMe: async () => {
                try {
                    set({ loading: true });
                    const user = await authService.fetchMe();

                    set({ user });
                } catch (error) {
                    console.error(error);
                    set({ user: null, accessToken: null });
                    toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!');
                } finally {
                    set({ loading: false });
                }
            },
            refreshToken: async () => {
                try {
                    set({ loading: true });
                    const { user, fetchMe, setAccessToken } = get();
                    const accessToken = await authService.refreshToken();
                    useStoreChat.getState().fetchConversations();
                    setAccessToken(accessToken);

                    if (!user) {
                        await fetchMe();
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    get().clearState();
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
        },
    ),
);
