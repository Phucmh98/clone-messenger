"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  danger,
  disabled,
  secondary,
}) => {
  return (
    <button
      type={type}
      className={clsx(
        `flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold     
        focus-visible:outline-2 
        focus-visible:outline-offset-2`,
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-default",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
        !secondary && !danger && "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
};

export default Button;
