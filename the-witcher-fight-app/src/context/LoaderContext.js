// filepath: c:\Users\andrea.zuccotto\Progetti\the-witcher-fight\the-witcher-fight-app\src\context\LoaderContext.js
"use client";

import React, { createContext, useState, useContext } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);