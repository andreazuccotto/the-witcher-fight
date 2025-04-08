import axios from 'axios';
import { useLoader } from '../context/LoaderContext';

export const useApi = () => {
    const { setLoading } = useLoader();

    const fetchData = async (url) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    return { fetchData };
};