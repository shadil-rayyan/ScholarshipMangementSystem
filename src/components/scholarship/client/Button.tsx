// src/components/scholarship/client/Button.tsx
import React from 'react';

export interface ButtonProps {
    onClick: () => void;
    text: string;
    variant: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ onClick, text, variant }) => {
    const buttonClass = variant === 'primary'
        ? 'px-4 py-2 bg-blue-500 text-white rounded'
        : 'px-4 py-2 bg-gray-200 text-gray-700 rounded';

    return (
        <button onClick={onClick} className={buttonClass}>
            {text}
        </button>
    );
};
