"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Pieces } from "./Pieces";
import { Lights } from "../Lights";
import { GridOverlay } from "./GridOverlay";
import { useGame } from "@/context/GameContext";
import { Camera } from "three";
import { Children } from "@/interfaces";
import { Aside } from "./Aside";
import { Loader } from "./Loader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Modal } from "../ui/modal/Modal";

const Box = ({ player, children }: { player: string; children?: Children }) => (
  <div className="flex justify-between px-3 py-3 md:py-6 bg-[#302E2B]">
    <h4>{player}</h4>
    {children}
  </div>
);

export function Game() {
  const cameraRef = useRef<Camera>(null);
  const ref = useRef(null);

  const { loading, camera, toogleResetCamera, toogleFreeCamera, cache } = useGame();
  const mediaQuery = useMediaQuery();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camera.position[0], camera.position[1], camera.position[2]);

      cameraRef.current.updateMatrix();
    }
  }, [camera.position, camera.resetCam]);

  const game = useMemo(() => {
    if (loading) return <Loader />;
    return (
      <section className="flex flex-col md:flex-row w-full h-full">
        <section className="relative flex flex-col w-full md:w-3/4 h-3/4 sm:h-full">
          <Box player="black">
            <div className="flex space-x-3">
              <button title="Free camera" onClick={toogleFreeCamera}>
                freeCam
              </button>
              <button title="Reset camera" onClick={toogleResetCamera}>
                resetCam
              </button>
            </div>
          </Box>

          <div className="flex-1">
            <Modal />

            <Canvas
              camera={{
                position: camera.position,
                fov: mediaQuery == "desktop" ? 2.1 : mediaQuery == "laptop" ? 2.2 : 3.1,
              }}
              gl={{ preserveDrawingBuffer: true }}
              onCreated={({ camera }) => {
                cameraRef.current = camera;
              }}
              className="bg-[#333]"
            >
              <group position={[0, 0, 0.45]}>
                <Lights />
                <primitive ref={ref} object={cache["/models/board.glb"]!} />
                <GridOverlay />
                <Pieces />
              </group>

              {camera.freeCam && <OrbitControls />}
            </Canvas>
          </div>

          <Box player="white" />
        </section>

        <section className="h-1/4 sm:h-0 md:h-full bg-[#262522]">
          <Aside />
        </section>
      </section>
    );
  }, [loading]);

  return game;
}
