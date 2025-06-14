import UserLayout from "@/Layouts/UserLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import React, { useState, useRef, useEffect } from "react";

export default function Complaint() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select Category");
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        comp_title: '',
        comp_category: '',
        comp_description: '',
        comp_location: '',
    });

    const categories = [
        "Noise Complaint",
        "Safety Concern",
        "Environmental Issue",
        "Infrastructure Problem",
        "Public Disturbance",
        "Sanitation Issue",
        "Traffic Concern",
        "Others"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('complaints.store'));
    };

    return (
        <UserLayout>
            <Head title="Submit Complaint" />
            <div className="pl-8">
                <Link 
                    href="/dashboard" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
                <div className="mb-8">
                    <h3 className="text-gray-900 text-3xl font-semibold mb-3">Submit Complaint Form</h3>
                    <p className="text-gray-600">
                        Submit your complaints here. Our team will review and take appropriate action as soon as possible.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="mb-8">
                        <h3 className="text-gray-900 text-2xl font-semibold mb-3">Complaint Information</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="comp_title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input 
                                    name="comp_title" 
                                    id="comp_title" 
                                    value={data.comp_title}
                                    onChange={e => setData('comp_title', e.target.value)}
                                    placeholder="Enter a brief title" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {errors.comp_title && <div className="text-red-500">{errors.comp_title}</div>}
                            </div>

                            <div className="space-y-2" ref={dropdownRef}>
                                <label className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg bg-white flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {data.comp_category || selectedCategory}
                                        <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            <div className="p-2">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Search categories..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCategories.map((category) => (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setData('comp_category', category);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.comp_category && <div className="text-red-500">{errors.comp_category}</div>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="comp_description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="comp_description"
                                name="comp_description"
                                value={data.comp_description}
                                onChange={e => setData('comp_description', e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Please provide detailed information about your complaint..."
                            />
                            {errors.comp_description && <div className="text-red-500">{errors.comp_description}</div>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="comp_location" className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                id="comp_location"
                                name="comp_location"
                                value={data.comp_location}
                                onChange={e => setData('comp_location', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter the location related to the complaint"
                            />
                            {errors.comp_location && <div className="text-red-500">{errors.comp_location}</div>}
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                {processing ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    )
}