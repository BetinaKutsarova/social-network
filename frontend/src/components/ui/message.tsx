import { MessageProps } from '../../interfaces/message';

export const Message = ({ type, children }: MessageProps) => {
  return (
    <div className={`message ${type}`}>
      {children}
    </div>
  );
}