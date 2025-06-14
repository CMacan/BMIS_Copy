import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ value, onChange, className, useLabel = false, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (!value) {
            setIsFocused(false);
        }
    };

    return (
        <div className="relative w-full">
            {useLabel && (
                <label
                    className={`absolute left-3 transition-all duration-200 ease-in-out ${
                        isFocused || value ? '-top-4 text-xs text-indigo-800' : 'top-2 text-gray-500'
                    }`}
                >
                    {props.name ? props.name.charAt(0).toUpperCase() + props.name.slice(1) : ''}
                </label>
            )}
            <input
                {...props}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 ${className}`}
                placeholder={!useLabel ? (props.name ? props.name.charAt(0).toUpperCase() + props.name.slice(1) : '') : ''}
            />
        </div>
    );
}