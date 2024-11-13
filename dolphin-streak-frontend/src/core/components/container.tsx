import { ReactNode } from "react";

interface IContainerProps {
  children: ReactNode;
}

export function Container({ children, ...props }: IContainerProps) {
  return (
    <div className="h-screen bg-[#080E1E] container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0" {...props}>
      {children}
    </div>
  );
}
