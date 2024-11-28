// OptionButton.tsx
import { ButtonHTMLAttributes } from "react";

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  option: {
    id: string;
    label: string;
    flag?: string;
    icon?: JSX.Element;
  };
  isSelected: boolean;
  onOptionSelect: (id: string) => void;
}

export function OptionButton({
  option,
  isSelected,
  onOptionSelect,
  ...props
}: OptionButtonProps) {
  return (
    <button
      onClick={() => onOptionSelect(option.id)}
      className={`w-full flex items-center p-4 rounded-lg transition-colors ${
        isSelected ? "bg-[#5AB9EA]" : "bg-gray-900 hover:bg-gray-800"
      }`}
      {...props}
    >
      {option.flag && <span className="text-2xl mr-3">{option.flag}</span>}
      {option.icon && <span className="mr-3">{option.icon}</span>}
      <span className="text-sm font-medium">{option.label}</span>
    </button>
  );
}
