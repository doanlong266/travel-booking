import React from 'react';

export type SmoothTabVariant = 'pill' | 'underline';

export interface ISmoothTabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface SmoothTabsProps {
  items: ISmoothTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: SmoothTabVariant;
  className?: string;
  navClassName?: string;
  contentClassName?: string;
  layoutId?: string;
  directionAware?: boolean;
  enableSmoothHeight?: boolean;
  renderContent?: boolean;
  extraRight?: React.ReactNode;
}

export interface SmoothTabContentProps {
  activeKey: string;
  direction: number;
  children: React.ReactNode;
  className?: string;
  enableSmoothHeight?: boolean;
}
