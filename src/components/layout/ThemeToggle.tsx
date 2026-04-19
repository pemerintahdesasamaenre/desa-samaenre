'use client';

import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    // Force light mode on mount
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  // Return null because theme switching is disabled
  return null;
}
