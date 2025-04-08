import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { useLoader } from './context/LoaderContext';
import HomePage from './pages/HomePage';
import AnotherPage from './pages/AnotherPage';

const Routes = () => {
    const { setLoading } = useLoader();
    const history = useHistory();

    useEffect(() => {
        const unlisten = history.listen(() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500); // Simula un caricamento
        });

        return () => unlisten();
    }, [history, setLoading]);

    return (
        <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/another" component={AnotherPage} />
        </Switch>
    );
};

export default function AppRoutes() {
    return (
        <Router>
            <Routes />
        </Router>
    );
}