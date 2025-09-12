import { useThree, useFrame } from "@react-three/fiber";

export function CameraLogger() {
  const { camera } = useThree();

  useFrame(() => {
    const { x, y, z } = camera.position;
    console.log(`[${x.toFixed(2)},${y.toFixed(2)}, ${z.toFixed(2)}]`);
  });

  return null;
}
