import { FC, HTMLAttributes } from 'react';

export interface BallpitProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: (number | string)[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxVelocity?: number;
  minVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
}

export declare const AWARAA_BALLPIT_COLORS: string[];

export interface BallpitBackgroundProps extends BallpitProps {
  className?: string;
}

export declare const BallpitBackground: FC<BallpitBackgroundProps>;
declare const Ballpit: FC<BallpitProps>;
export default Ballpit;
