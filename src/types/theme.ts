export type ThemeMode = 'dark' | 'light';

export type DeviceTier = 'desktop' | 'tablet' | 'mobile';

export interface DeviceCapabilities {
  tier: DeviceTier;
  hasWebGL: boolean;
  prefersReducedMotion: boolean;
  isTouch: boolean;
  dpr: number;
}
