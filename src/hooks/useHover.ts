import { useState, useCallback } from "react";

export function useHover() {
  const [hovered, setHovered] = useState<boolean>(false);

  const onPointerOver = useCallback(() => setHovered(true), []);
  const onPointerOut = useCallback(() => setHovered(false), []);

  return {
    hovered,
    eventHandlers: {
      onPointerOver,
      onPointerOut,
    },
  };
}
