import React from "react";

interface BodyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function BodyText({
  children,
  className = "",
  as: Component = "span",
  ...props
}: BodyTextProps) {
  return (
    <Component
      className={`text-sm ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
