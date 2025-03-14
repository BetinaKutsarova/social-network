import { ReactNode } from 'react';

interface MessageProps {
  type: string;
  children: ReactNode;
}

export const Message = ({ type, children }: MessageProps) => {
  return (
    <div className={`message ${type}`}>
      {children}
    </div>
  );
}