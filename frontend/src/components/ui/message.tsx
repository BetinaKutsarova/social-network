import { MessageProps } from '../../types/message.types';

export const Message = ({ type, children }: MessageProps) => {
  return (
    <div className={`message ${type}`}>
      {children}
    </div>
  );
}