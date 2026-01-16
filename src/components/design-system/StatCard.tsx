import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { colors } from '../../design-system/tokens';
import type { StatCardProps } from '../../design-system/types';

const variantStyles: Record<
  StatCardProps['variant'] & string,
  { bg: string; iconColor: string; border: string; shadow?: string }
> = {
  default: {
    bg: '#FFF9E6',
    iconColor: colors.ui.text.accent,
    border: '#8B6914',
  },
  gold: {
    bg: 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)',
    iconColor: '#FFFFFF',
    border: '#F57F17',
    shadow: '0 0 20px rgba(255, 217, 61, 0.6)',
  },
  success: {
    bg: 'linear-gradient(135deg, #58D68D 0%, #27AE60 100%)',
    iconColor: '#FFFFFF',
    border: '#1E8449',
  },
  danger: {
    bg: 'linear-gradient(135deg, #EC7063 0%, #E74C3C 100%)',
    iconColor: '#FFFFFF',
    border: '#A93226',
  },
  info: {
    bg: 'linear-gradient(135deg, #5DADE2 0%, #3498DB 100%)',
    iconColor: '#FFFFFF',
    border: '#1F618D',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = 'default',
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = shouldReduceMotion;
  const styles = variantStyles[variant];

  return (
    <motion.div
      className="relative border-card rounded-card p-card flex items-center gap-3 shadow-cartoon overflow-hidden"
      style={{
        background: styles.bg,
        borderColor: styles.border,
        boxShadow: styles.shadow,
      }}
      initial={skipAnimation ? false : { opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={
        skipAnimation
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 15,
              opacity: { duration: 0.2 },
            }
      }
      whileHover={
        !skipAnimation
          ? {
              scale: 1.05,
              rotate: 2,
              boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.25)',
              transition: { type: 'spring', stiffness: 500, damping: 15 },
            }
          : undefined
      }
      {...motionProps}
    >
      {/* Inner highlight for 3D effect */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-40"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 100%)',
        }}
      />

      {/* Icon with pulsing animation for gold variant */}
      <motion.div
        className="text-3xl flex-shrink-0"
        style={{
          color: styles.iconColor,
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
        }}
        animate={
          variant === 'gold' && !skipAnimation
            ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }
            : {}
        }
        transition={
          variant === 'gold'
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {icon}
      </motion.div>

      <div className="flex flex-col flex-1 min-w-0">
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{
            color:
              variant === 'default'
                ? colors.ui.text.muted
                : 'rgba(255,255,255,0.9)',
            textShadow:
              variant !== 'default' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {label}
        </span>
        <motion.span
          className="text-2xl font-black font-mono truncate"
          style={{
            color: variant === 'default' ? colors.ui.text.primary : '#FFFFFF',
            textShadow:
              variant !== 'default' ? '2px 2px 3px rgba(0,0,0,0.4)' : 'none',
          }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default StatCard;
