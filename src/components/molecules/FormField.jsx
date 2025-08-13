import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="text-error text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormField;