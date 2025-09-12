import { CONSTANTS } from "@/constants";
import { useGame } from "@/context/GameContext";
import { useHover } from "@/hooks/useHover";
import { useCursor } from "@react-three/drei";

export function GridBoxOverlay({ position }: { position: number[] }) {
  const size = CONSTANTS.BOX_SIZE;
  const [y, x] = position;

  const { moveTo } = useGame();
  const { hovered, eventHandlers } = useHover();

  useCursor(hovered);

  const handleClick = () => {
    moveTo({ to: [y, x] });
  };

  return (
    <group
      position={[x * size, 0.05, y * size]}
      onClick={handleClick}
      {...eventHandlers}
    >
      <mesh>
        <boxGeometry args={[size / 1.4, size / 1.4, size / 1.4]} />
        <meshBasicMaterial color="limegreen" />
      </mesh>
    </group>
  );
}
