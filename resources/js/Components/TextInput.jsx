import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, value = '', useLabel = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const handleFocus = () => {
        setIsInputFocused(true);
    };

    const handleBlur = () => {
        if (!value) {
            setIsInputFocused(false);
        }
    };

    return (
        <div className="relative w-full">
            {useLabel && (
                <label
                    className={`absolute left-3 transition-all duration-200 ease-in-out ${
                        isInputFocused || value ? '-top-4 text-xs text-indigo-800' : 'top-2 text-gray-500'
                    }`}
                >
                    {props.name ? props.name.charAt(0).toUpperCase() + props.name.slice(1) : ''}
                </label>
            )}
            <input
                {...props}
                type={type}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={localRef}
                className={`rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 ${className}`}
                placeholder={!useLabel ? (props.name ? props.name.charAt(0).toUpperCase() + props.name.slice(1) : '') : ''}
            />
        </div>
    );
});