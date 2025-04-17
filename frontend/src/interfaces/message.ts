import { ReactNode } from 'react';

export interface MessageProps {
  type: 'error' | 'success',
  children: ReactNode;
}