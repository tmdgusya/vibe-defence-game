import { useReducedMotion } from 'framer-motion';
import { animation } from '../tokens';

export function useAnimationPreset(preset: keyof typeof animation.presets) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      initial: {},
      animate: {},
      exit: {},
      transition: { duration: 0 },
    };
  }

  return animation.presets[preset];
}

export function useButtonAnimation(disabled: boolean = false) {
  const shouldReduceMotion = useReducedMotion();

  if (disabled || shouldReduceMotion) {
    return {
      whileHover: undefined,
      whileTap: undefined,
    };
  }

  return {
    whileHover: animation.presets.buttonHover,
    whileTap: animation.presets.buttonTap,
  };
}
