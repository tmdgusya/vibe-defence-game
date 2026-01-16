/**
 * Semantic class names that map to design tokens
 * Use these instead of arbitrary Tailwind classes
 */

export const panelClasses = {
  base: 'bg-panel-primary/95 border border-panel-border/50 rounded-panel p-panel shadow-md',
  elevated:
    'bg-panel-primary border border-panel-accent/30 rounded-panel p-panel shadow-panel',
  overlay:
    'bg-panel-primary/98 border border-panel-accent/20 rounded-panel p-panel-lg shadow-xl',
} as const;

export const buttonClasses = {
  primary:
    'bg-interactive-primary hover:bg-interactive-primary-hover active:bg-interactive-primary-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  success:
    'bg-interactive-success hover:bg-interactive-success-hover active:bg-interactive-success-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  warning:
    'bg-interactive-warning hover:bg-interactive-warning-hover active:bg-interactive-warning-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  danger:
    'bg-interactive-danger hover:bg-interactive-danger-hover active:bg-interactive-danger-active text-white font-medium py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  ghost:
    'bg-transparent hover:bg-panel-hover text-text-secondary hover:text-text-primary py-btn-y px-btn-x rounded-btn transition-all duration-fast',
  disabled:
    'bg-interactive-disabled text-interactive-disabled-text cursor-not-allowed py-btn-y px-btn-x rounded-btn',
} as const;

export const textClasses = {
  heading: 'font-heading text-text-primary',
  body: 'font-body text-text-secondary',
  accent: 'font-body text-text-accent',
  muted: 'font-body text-text-muted',
  gold: 'font-mono text-gold-primary',
  number: 'font-mono',
} as const;

export const towerButtonClasses = {
  peashooter:
    'bg-panel-primary border-l-4 border-tower-peashooter hover:bg-panel-hover',
  sunflower:
    'bg-panel-primary border-l-4 border-tower-sunflower hover:bg-panel-hover',
  wallnut:
    'bg-panel-primary border-l-4 border-tower-wallnut hover:bg-panel-hover',
  mortar:
    'bg-panel-primary border-l-4 border-tower-mortar hover:bg-panel-hover',
} as const;

export type PanelVariant = keyof typeof panelClasses;
export type ButtonVariant = keyof typeof buttonClasses;
export type TextVariant = keyof typeof textClasses;
export type TowerButtonVariant = keyof typeof towerButtonClasses;
