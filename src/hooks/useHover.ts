import { useCallback, useRef } from "react";

export function useHover() {
  const hovered = useRef(false);

  const onPointerOver = useCallback(() => {
    hovered.current = true;
  }, []);

  const onPointerOut = useCallback(() => {
    hovered.current = false;
  }, []);

  return {
    hovered: hovered.current,
    eventHandlers: {
      onPointerOver,
      onPointerOut,
    },
  };
}
