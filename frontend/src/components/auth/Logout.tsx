import { Button } from 'antd';
import { useStoreUser } from '../../store/useStoreUser';
import { useNavigate } from 'react-router';
export default function Logout() {
    const navigate = useNavigate();
    const { signOut } = useStoreUser();
    const handleSubmit = async () => {
        try {
            await signOut();
            navigate('/signin');
        } catch (error) {
            console.error(error);
        }
    };
    return <Button onClick={handleSubmit}>Logout</Button>;
}
