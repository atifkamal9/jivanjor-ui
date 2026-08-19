import React from "react";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Paragraph({
  children,
  className = "",
  as: Component = "p",
  ...props
}: ParagraphProps) {
  return (
    <Component
      className={`font-google-sans text-base md:text-lg ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
