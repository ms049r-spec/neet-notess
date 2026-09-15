import { useState, useEffect } from 'react';
import { DeviceCapabilities, DeviceTier } from '../types/theme';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function useDeviceTier(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    const isClient = typeof window !== 'undefined';
    const width = isClient ? window.innerWidth : 1200;
    const isTouch = isClient ? 'ontouchstart' in window || navigator.maxTouchPoints > 0 : false;
    const prefersReducedMotion = isClient
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    const hasWebGL = isClient ? detectWebGL() : true;
    const dpr = isClient ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    let tier: DeviceTier = 'desktop';
    if (width < 640) {
      tier = 'mobile';
    } else if (width < 1024) {
      tier = 'tablet';
    }

    return {
      tier,
      hasWebGL,
      prefersReducedMotion,
      isTouch,
      dpr,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      let tier: DeviceTier = 'desktop';
      if (width < 640) {
        tier = 'mobile';
      } else if (width < 1024) {
        tier = 'tablet';
      }

      setCapabilities((prev) => ({
        ...prev,
        tier,
        isTouch,
        prefersReducedMotion,
        dpr,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}
