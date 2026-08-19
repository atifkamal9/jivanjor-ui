import React from "react";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Title({
  children,
  className = "",
  as: Component = "h2",
  ...props
}: TitleProps) {
  return (
    <Component
      className={`font-amethysta text-[20px] sm:text-[24px] 2xl:text-[34px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

