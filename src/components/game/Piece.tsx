import { useRef, useEffect, useState } from "react";
import { Object3D, Vector3Like } from "three";
import { useGame } from "@/context/GameContext";
import { Coord, PieceProps, PieceTypeEnum } from "@/interfaces";
import { getPieceNode } from "@/utils/getPieceNode";
import { ThreeEvent, useFrame } from "@react-three/fiber";

export function Piece({ object, opts }: PieceProps) {
  const ref = useRef<Object3D>(null);
  const [position, setPosition] = useState<Vector3Like>({ z: 0, x: 0, y: 0 });
  const [move, setMove] = useState<{ z?: number; x?: number } | null>(null);
  const [figure, setFigure] = useState<Object3D>(object);
  const [pos, setPos] = useState<Coord>(opts.pos);
  const [isDeleted, setIsDeleted] = useState(false);
  const { getPossibleMoves, updatePiecePosition, deletePiecePosition } = useGame();
  const handleClick = () => {
    getPossibleMoves({ ...opts, pos });
  };

  useEffect(() => {
    if (!updatePiecePosition) return;
    const { from, to, move } = updatePiecePosition;

    if (from[0] !== pos[0] || from[1] !== pos[1]) return;

    if (isDeleted && !deletePiecePosition?.skip) {
      const node = getPieceNode(`${opts.color}_${PieceTypeEnum[opts.type]}`);
      setFigure(node!);
      setIsDeleted(false);
      setMove(move!);
    }

    setPos(to);
  }, [updatePiecePosition]);

  useEffect(() => {
    if (!deletePiecePosition) return;
    const { item } = deletePiecePosition;

    if (item[0] == pos[0] && item[1] == pos[1]) {
      setIsDeleted(true);
    }
  }, [deletePiecePosition]);

  useFrame(() => {
    if (!ref.current || !move) return;
    const target = {
      x: position.x + (move.x ?? 0),
      y: position.y,
      z: position.z + (move.z ?? 0),
    };

    ref.current.position.lerp(target, 0.1);
    setPosition(target);
    setMove(null);
  });

  if (isDeleted) return null;

  return (
    <primitive
      ref={ref}
      object={figure}
      onClick={handleClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    />
  );
}
