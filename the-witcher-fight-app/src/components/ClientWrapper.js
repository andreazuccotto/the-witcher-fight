"use client";

import React from 'react';
import { LoaderProvider } from '@/context/LoaderContext';
import Loader from '@/components/Loader';

export default function ClientWrapper({ children }) {
    return (
        <LoaderProvider>
            <Loader />
            {children}
        </LoaderProvider>
    );
}