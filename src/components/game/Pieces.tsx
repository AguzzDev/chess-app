"use client";
import { Piece } from "./Piece";
import { PieceColorTypeEnum, PieceTypeEnum } from "@/interfaces";
import { CONSTANTS } from "@/constants";
import { useGame } from "@/context/GameContext";
import { getPieceNode } from "@/utils/getPieceNode";

export function Pieces() {
  const size = CONSTANTS.BOX_SIZE;
  const { getBoard, restart } = useGame();
  const { board, boardColor } = getBoard();

  return (
    <group key={JSON.stringify(restart)} position={[-0.23, 0.665, -0.23]}>
      {Array.from({ length: 8 * 8 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);

        const value = PieceTypeEnum[board[y][x]];
        const color =
          PieceColorTypeEnum[boardColor[y][x] as PieceColorTypeEnum];
        if (!value) return null;

        const node = getPieceNode(`${color}_${value}`);
        if (!node) return;

        return (
          <group key={i} position={[x * size, 0.1, y * size]}>
            <Piece
              object={node}
              opts={{
                pos: [y, x],
                color,
                type: board[y][x],
              }}
            />
          </group>
        );
      })}
    </group>
  );
}
