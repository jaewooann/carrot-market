import { cls } from "@/libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cls(
        "w-full flex-1 bg-orange-500 text-white rounded-md focus:outline-none font-medium hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
        large ? "py-3 text-base" : "py-2 text-sm"
      )}
    >
      {text}
    </button>
  );
}
