"use client"
import { useState } from "react";
import { Head, usePage } from "@inertiajs/react"; 


export default function MainLanding() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Head title="Main Landing Page" />
            <h1 className="text-4xl font-bold mb-4">Welcome to the Main Landing Page</h1>
            <p className="text-lg text-gray-600">This is the main landing page of your application.</p>
        </div>
    );
}