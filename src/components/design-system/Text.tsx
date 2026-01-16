import React from 'react';
import { textClasses } from '../../design-system/tailwind-classes';
import type { TextProps } from '../../design-system/types';

export const Text: React.FC<TextProps> = ({
  as = 'span',
  variant = 'body',
  className = '',
  children,
}) => {
  return React.createElement(
    as,
    { className: `${textClasses[variant]} ${className}` },
    children
  );
};

export default Text;
