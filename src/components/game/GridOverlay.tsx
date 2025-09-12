import { useGame } from "@/context/GameContext";
import { GridBoxOverlay } from "./GridBoxOverlay";

export function GridOverlay() {
  const { previewMoves } = useGame();

  return (
    <group position={[-0.23, 0.72, -0.23]}>
      {Array.from({ length: 8 * 8 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const isValid = previewMoves?.some(([vy, vx]) => vy === y && vx === x);
        if (!isValid) return;

        return <GridBoxOverlay key={i} position={[y, x]} />;
      })}
    </group>
  );
}
