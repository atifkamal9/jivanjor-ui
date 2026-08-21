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
      className={`font-amethysta text-[22px] sm:text-[24px] xd:text-[30px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

