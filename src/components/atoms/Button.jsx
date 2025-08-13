import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 shadow-lg",
    accent: "text-white hover:brightness-110 shadow-lg" + " " + "bg-[#0059E3]",
    secondary: "bg-secondary text-white hover:brightness-110 shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold",
    ghost: "text-primary hover:bg-primary/10 font-semibold"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;