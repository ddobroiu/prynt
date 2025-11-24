import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900 dark:border-gray-700 dark:hover:bg-gray-800",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
      ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-gray-800",
      link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    };

    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ""}`;

    if (asChild) {
      const child = React.Children.only(props.children) as React.ReactElement<any, any>;
      // Extragem children din props pentru a nu le pasa mai departe ca proprietate
      const { children, ...rest } = props;
      
      return React.cloneElement(child, {
        // Combinăm clasele existente ale copilului cu cele ale butonului
        className: `${combinedClasses} ${child.props.className || ""}`,
        // Pasăm restul proprietăților (ex: onClick)
        ...(rest as any)
      });
    }

    return <button className={combinedClasses} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };