import { useStoreUser } from '../../store/useStoreUser';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const { accessToken, user, loading, refreshToken, fetchMe } = useStoreUser();
    const [starting, setStarting] = useState(true);

    useEffect(() => {
        const init = async () => {
            // có thể xảy ra khi refresh trang
            if (!accessToken) {
                await refreshToken();
            }

            if (accessToken && !user) {
                await fetchMe();
            }

            setStarting(false);
        };
        init();
    },[]);

    if (starting || loading) {
        return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>;
    }

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;
