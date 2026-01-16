import React from 'react';
import { Panel } from './design-system/Panel';
import { Text } from './design-system/Text';
import { Button } from './design-system/Button';

interface FooterProps {
  gameVersion?: string;
  fps?: number;
  level?: number;
  lives?: number;
  isPaused?: boolean;
  onPause?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  gameVersion = '1.0.0',
  fps,
  isPaused = false,
  onPause,
}) => {
  return (
    <Panel>
      <Text variant="body" className="text-xs">
        Tower Defense with Merging Mechanics
      </Text>
      <div className="flex items-center space-y-2">
        <Text variant="muted">v{gameVersion}</Text>

        {fps !== undefined && fps >= 0 && <Text variant="gold">{fps} FPS</Text>}

        {isPaused && <Text variant="accent">PAUSED</Text>}
      </div>

      <div className="flex items-center gap-2">
        {onPause && (
          <Button onClick={onPause} variant="warning">
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>
    </Panel>
  );
};

export default Footer;
