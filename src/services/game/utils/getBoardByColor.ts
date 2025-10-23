import { BoardPiece, PieceColorTypeEnum, PieceTypeEnum } from "@/interfaces";

export const getBoardByColor = ({ color, board }: { color?: PieceColorTypeEnum; board: BoardPiece }) => {
  const filter = (color?: PieceColorTypeEnum) => {
    return board.map((array) =>
      array.map((piece) => {
        if (piece.type === PieceTypeEnum.empty) return piece;

        const sameColor = piece.color === color;
        if (!sameColor && color) {
          return {
            pos: piece.pos,
            type: PieceTypeEnum.empty,
          };
        }

        return piece;
      })
    );
  };

  return filter(color);
};
