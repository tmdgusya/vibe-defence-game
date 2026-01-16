import React from 'react';

// Color path types for type-safe token access
export type ColorPath =
  | `ui.panel.\${string}`
  | `ui.overlay.\${string}`
  | `ui.text.\${string}`
  | `ui.gold.\${string}`
  | `interactive.\${string}.\${string}`
  | `tower.\${string}.\${string}`
  | `feedback.\${string}`
  | `level.\${string}`;

// Animation preset types
export type AnimationPreset =
  | 'fadeIn'
  | 'slideUp'
  | 'scaleIn'
  | 'buttonHover'
  | 'buttonTap'
  | 'goldPulse';

// Component variant types
export interface PanelProps {
  variant?: 'base' | 'elevated' | 'overlay';
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface TowerButtonProps {
  towerType: 'peashooter' | 'sunflower' | 'wallnut' | 'mortar';
  name: string;
  cost: number;
  icon: string;
  description?: string;
  affordable: boolean;
  selected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: 'default' | 'gold' | 'success' | 'danger' | 'info';
}

export interface TextProps {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
  variant?: 'heading' | 'body' | 'accent' | 'muted' | 'gold' | 'number';
  className?: string;
  children: React.ReactNode;
}
