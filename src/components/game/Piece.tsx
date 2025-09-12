import { useRef, useEffect, useState } from "react";
import { useCursor } from "@react-three/drei";
import { Object3D } from "three";
import { useGame } from "@/context/GameContext";
import { Coord, PieceProps, PieceTypeEnum } from "@/interfaces";
import { useHover } from "@/hooks/useHover";
import { getPieceNode } from "@/utils/getPieceNode";

export function Piece({ object, opts }: PieceProps) {
  const ref = useRef<Object3D>(null);
  const [figure, setFigure] = useState<Object3D>(object);
  const [pos, setPos] = useState<Coord>(opts.pos);
  const [isDeleted, setIsDeleted] = useState(false);
  const { getPossibleMoves, updatePiecePosition, deletePiecePosition } =
    useGame();
  const { hovered, eventHandlers } = useHover();
  const handleClick = () => {
    getPossibleMoves({ ...opts, pos });
  };
  useCursor(hovered);

  useEffect(() => {
    if (!updatePiecePosition) return;
    if (isDeleted) {
      const node = getPieceNode(`${opts.color}_${PieceTypeEnum[opts.type]}`);
      setFigure(node!);
      setIsDeleted(false);
    }
    const { from, to } = updatePiecePosition;
    if (from[0] !== pos[0] || from[1] !== pos[1]) return;

    setPos(to);
  }, [updatePiecePosition]);

  useEffect(() => {
    if (!deletePiecePosition) return;
    if (deletePiecePosition[0] == pos[0] && deletePiecePosition[1] == pos[1]) {
      setIsDeleted(true);
    }
  }, [deletePiecePosition]);

  if (isDeleted) return null;

  return (
    <primitive
      ref={ref}
      object={figure}
      onClick={handleClick}
      {...eventHandlers}
    />
  );
}
