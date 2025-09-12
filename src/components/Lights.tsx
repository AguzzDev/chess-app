import { useRef, useEffect } from "react";
import { DirectionalLight } from "three";

export function Lights() {
  const dirLightRef = useRef<DirectionalLight>(null);

  useEffect(() => {
    if (dirLightRef.current) {
      dirLightRef.current.target.position.set(0, 0, 0);
      dirLightRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      <ambientLight intensity={.3} />
      <directionalLight
        ref={dirLightRef}
        position={[0, 2, .5]}
        intensity={3}
        castShadow
      />
    </>
  );
}
