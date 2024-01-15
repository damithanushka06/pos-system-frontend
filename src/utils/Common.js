import { useNavigate } from 'react-router-dom';

export const useCommon = () => {
    const navigate = useNavigate();

    const goBackToHome = () => {
        navigate('/home');
    };

    return { goBackToHome };
};