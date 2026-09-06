"use client";

import { FC } from "react";
import Ballpit, { BallpitBackgroundProps } from "./Ballpit";

/**
 * Reusable zero-gravity floating ballpit background.
 * Simply drop `<BallpitBackground />` inside any relative container.
 *
 * Example:
 * ```tsx
 * <section className="relative overflow-hidden">
 *   <BallpitBackground />
 *   <div className="relative z-10">Your Content</div>
 * </section>
 * ```
 */
export const BallpitBackground: FC<BallpitBackgroundProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      <Ballpit {...props} />
    </div>
  );
};

export default BallpitBackground;
