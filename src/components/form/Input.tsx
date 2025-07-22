import { FC, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui Input 컴포넌트

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const CustomInput: FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Input {...props} />
    </div>
  );
};

export default CustomInput;
