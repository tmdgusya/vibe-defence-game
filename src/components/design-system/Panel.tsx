import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface PanelProps extends HTMLMotionProps<'div'> {
  variant?: 'base' | 'elevated' | 'overlay';
  children: React.ReactNode;
  noAnimation?: boolean;
}

const variantClasses: Record<PanelProps['variant'] & string, string> = {
  base: 'bg-gradient-panel border-panel border-panel-border rounded-panel p-panel shadow-panel',
  elevated:
    'bg-gradient-panel border-panel border-gold-primary rounded-panel p-panel shadow-panel',
  overlay:
    'bg-panel-primary/98 border-panel border-panel-accent rounded-panel p-panel-lg shadow-xl',
};

export const Panel: React.FC<PanelProps> = ({
  variant = 'base',
  children,
  noAnimation = false,
  className = '',
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = noAnimation || shouldReduceMotion;

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className} relative`}
      initial={skipAnimation ? false : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        skipAnimation
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 20,
              opacity: { duration: 0.3 },
            }
      }
      style={{
        backdropFilter: variant === 'overlay' ? 'blur(10px)' : undefined,
      }}
      {...motionProps}
    >
      {/* Add inner highlight for 3D effect */}
      <div
        className="absolute top-0 left-0 right-0 h-2 rounded-t-panel opacity-30"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
        }}
      />
      {children}
    </motion.div>
  );
};

export default Panel;
