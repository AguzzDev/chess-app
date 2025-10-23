"use client";
import { Piece } from "./Piece";
import { PieceTypeEnum } from "@/interfaces";
import { CONSTANTS } from "@/constants";
import { useGame } from "@/context/GameContext";
import { getPieceNode } from "@/utils/getPieceNode";
import React, { useMemo } from "react";

export const Pieces = () => {
  const { loading, board } = useGame();
  const size = CONSTANTS.BOX_SIZE;

  const render = useMemo(() => {
    return (
      <group position={[-0.23, 0.665, -0.23]}>
        {board?.flatMap((row, y) =>
          row.map((piece, x) => {
            if (piece.type === PieceTypeEnum.empty) return null;
            const node = getPieceNode(`${piece.color}_${PieceTypeEnum[piece.type]}`);
            if (!node) return null;

            return (
              <group key={`${y}-${x}`} position={[x * size, 0.1, y * size]}>
                <Piece
                  object={node}
                  opts={{
                    pos: piece.pos,
                    color: piece.color,
                    type: piece.type,
                  }}
                />
              </group>
            );
          })
        )}
      </group>
    );
  }, [loading]);

  return render
};
