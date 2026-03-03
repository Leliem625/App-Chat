import { BrowserRouter, Routes, Route } from 'react-router';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ChatAppPage from './pages/ChatAppPage';
import { Toaster } from 'sonner';
import Protected from './components/auth/Protected';
import { useStoreUser } from './store/useStoreUser';
import { useStoreSocket } from './store/useStoreSocket';
import { useEffect } from 'react';
function App() {
    const{accessToken} = useStoreUser();
    const{connectSocket, disconnectSocket} = useStoreSocket();
    useEffect(()=>{
        if(accessToken){
            connectSocket();
        }
        return () => disconnectSocket();
    },[accessToken])
    return (
        <>
            <Toaster richColors />
            <BrowserRouter>
                <Routes>
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route element={<Protected />}>
                        <Route path="/" element={<ChatAppPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
