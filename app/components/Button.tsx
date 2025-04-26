"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  submit?: boolean; // Thêm prop để xác định nếu đây là nút submit
}

const Button: React.FC<ButtonProps> = ({
  fullWidth,
  children,
  onClick,
  danger,
  disabled,
  secondary,
  submit = false, // Mặc định không phải nút submit
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (submit) {
      // Tìm form cha và submit
      const form = e.currentTarget.closest("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={clsx(
        `flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold     
        focus-visible:outline-2 
        focus-visible:outline-offset-2
        cursor-pointer
        select-none`,
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-default pointer-events-none",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
        !secondary && !danger && "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
      )}
      onClick={handleClick} // Gọi handleClick khi click
    >
      {children}
    </div>
  );
};

export default Button;