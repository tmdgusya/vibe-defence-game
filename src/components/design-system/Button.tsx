import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import type { ButtonProps } from '../../design-system/types';

const variantStyles: Record<
  ButtonProps['variant'] & string,
  { bg: string; border: string; shadow: string }
> = {
  primary: {
    bg: 'linear-gradient(180deg, #5DADE2 0%, #3498DB 100%)',
    border: '#1F618D',
    shadow: '0 6px 0 #1F618D',
  },
  success: {
    bg: 'linear-gradient(180deg, #58D68D 0%, #27AE60 100%)',
    border: '#1E8449',
    shadow: '0 6px 0 #1E8449',
  },
  warning: {
    bg: 'linear-gradient(180deg, #F5B041 0%, #F39C12 100%)',
    border: '#B9770E',
    shadow: '0 6px 0 #B9770E',
  },
  danger: {
    bg: 'linear-gradient(180deg, #EC7063 0%, #E74C3C 100%)',
    border: '#A93226',
    shadow: '0 6px 0 #A93226',
  },
  ghost: {
    bg: 'transparent',
    border: '#8B6914',
    shadow: 'none',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size: _size = 'md',
  disabled = false,
  loading = false,
  className = '',
  children,
  onClick,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = shouldReduceMotion || disabled || loading;
  const styles = variantStyles[variant];

  return (
    <motion.button
      type="button"
      className={`
        relative
        px-btn-x py-btn-y
        rounded-btn
        font-body font-bold text-base
        text-white
        transition-all duration-fast
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:translate-y-2'}
        ${variant === 'ghost' ? 'text-text-primary border-3' : 'border-btn'}
        ${className}
      `}
      style={{
        background: styles.bg,
        borderColor: styles.border,
        boxShadow: disabled || loading ? '0 2px 0 #95A5A6' : styles.shadow,
        textShadow:
          variant !== 'ghost' ? '0 2px 2px rgba(0, 0, 0, 0.2)' : 'none',
      }}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={
        skipAnimation
          ? undefined
          : {
              scale: 1.05,
              y: -2,
              boxShadow:
                styles.shadow && !disabled
                  ? `0 8px 0 ${styles.border}`
                  : styles.shadow,
              transition: { type: 'spring', stiffness: 500, damping: 20 },
            }
      }
      whileTap={
        skipAnimation
          ? undefined
          : {
              scale: 0.95,
              y: 4,
              boxShadow:
                styles.shadow && !disabled
                  ? `0 2px 0 ${styles.border}`
                  : styles.shadow,
            }
      }
      {...motionProps}
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block mr-2"
        >
          ⟳
        </motion.span>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
