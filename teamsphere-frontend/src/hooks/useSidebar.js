import { useState } from 'react';

export function useSidebar() {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);
  return { open, toggle };
} 