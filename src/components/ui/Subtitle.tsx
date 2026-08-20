import React from "react";

interface SubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Subtitle({
  children,
  className = "",
  as: Component = "p",
  ...props
}: SubtitleProps) {
  return (
    <Component
      className={`font-google-sans text-base sm:text-xl xd:text-[22px] leading-normal ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

