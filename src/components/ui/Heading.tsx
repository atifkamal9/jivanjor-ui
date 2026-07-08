import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({
  children,
  className = "",
  ...props
}: HeadingProps) {
  return (
    <h1
      className={`font-amethysta font-normal leading-normal text-[34px] xl:text-[56px] ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}
