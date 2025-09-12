import { PieceTypeEnum } from "@/interfaces";

export const getPieceNotation = (piece: PieceTypeEnum) => {
  const PIECE_DICT = {
    [PieceTypeEnum.pawn]: "",
    [PieceTypeEnum.horse]: "N",
    [PieceTypeEnum.bishop]: "B",
    [PieceTypeEnum.rook]: "R",
    [PieceTypeEnum.queen]: "Q",
    [PieceTypeEnum.king]: "K",
  };

  return PIECE_DICT[piece];
};
