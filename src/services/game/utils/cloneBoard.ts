import { BoardPiece } from "@/interfaces";

export const cloneBoard = (board: BoardPiece): BoardPiece => {
  return board.map((row) =>
    row.map((cell) => ({
      pos: [...cell.pos],
      type: cell.type,
      color: cell.color,
      pinned: cell.pinned,
      castledAllowed: cell.castledAllowed ? { ...cell.castledAllowed } : undefined,
    }))
  );
};
