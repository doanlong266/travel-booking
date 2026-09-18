import React, { useId } from 'react';
import { motion } from 'framer-motion';
import type { SmoothTabsProps } from './types';
import { useTabDirection } from './useTabDirection';
import { SmoothTabContent } from './SmoothTabContent';

export const SmoothTabs: React.FC<SmoothTabsProps> = ({
  items,
  activeKey,
  onChange,
  variant = 'pill',
  className = '',
  navClassName = '',
  contentClassName = '',
  layoutId,
  directionAware = true,
  enableSmoothHeight = true,
  renderContent = true,
  extraRight,
}) => {
  const autoId = useId();
  const indicatorLayoutId = layoutId || `smooth-tab-indicator-${autoId}`;

  const keys = items.map((it) => it.key);
  const { direction } = useTabDirection(activeKey, keys);

  const activeItem = items.find((it) => it.key === activeKey);

  return (
    <div className={`smooth-tabs smooth-tabs--${variant} ${className}`}>
      {/* Navigation List */}
      <div className={`smooth-tabs__nav-list ${navClassName}`} role="tablist">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={item.disabled}
              className={`smooth-tabs__item ${isActive ? 'smooth-tabs__item--active' : ''} ${
                item.disabled ? 'smooth-tabs__item--disabled' : ''
              }`}
              onClick={() => !item.disabled && onChange(item.key)}
            >
              {/* Active Indicator with Spring Physics */}
              {isActive && (
                <motion.div
                  layoutId={indicatorLayoutId}
                  className="smooth-tabs__indicator"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                  }}
                  style={{ willChange: 'transform' }}
                />
              )}

              {/* Tab Item Inner Content */}
              <span className="smooth-tabs__item-inner">
                {item.icon && <span className="smooth-tabs__item-icon">{item.icon}</span>}
                <span className="smooth-tabs__item-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="smooth-tabs__item-badge">{item.badge}</span>
                )}
              </span>
            </button>
          );
        })}

        {extraRight && <div className="smooth-tabs__nav-extra">{extraRight}</div>}
      </div>

      {/* Render Animated Content Pane if specified */}
      {renderContent && activeItem?.content && (
        <SmoothTabContent
          activeKey={activeKey}
          direction={directionAware ? direction : 0}
          className={contentClassName}
          enableSmoothHeight={enableSmoothHeight}
        >
          {activeItem.content}
        </SmoothTabContent>
      )}
    </div>
  );
};
