import React from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
  loading,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
      cursor-pointer
        inline-flex
        w-full
        justify-center
        rounded-md
        bg-white
        px-4
        py-2
        text-gray-500
        shadow-sm
        ring-1
        ring-inset
        ring-gray-300
        hover:bg-gray-50
        focus:outline-offset-0
        "
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
