import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Heading({
  children,
  className = "",
  as: Component = "h1",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={`font-amethysta font-normal leading-normal text-[24px] md:text-[36px] xd:text-[42px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

