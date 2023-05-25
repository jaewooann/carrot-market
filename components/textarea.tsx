import type { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  name?: string;
  label?: string;
  register: UseFormRegisterReturn;
  required: boolean;
  [key: string]: any;
}

export default function TextArea({
  name,
  label,
  register,
  required,
  ...rest
}: TextAreaProps): JSX.Element {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={name}
        className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500"
        rows={4}
        required={required}
        {...register}
        {...rest}
      />
    </div>
  );
}
