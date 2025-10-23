import { PieceTypeEnum } from "@/interfaces";

export const getPieceNotation = (piece: PieceTypeEnum): string => {
  const PIECE_DICT = {
    [PieceTypeEnum.empty]: "",
    [PieceTypeEnum.pawn]: "",
    [PieceTypeEnum.horse]: "N",
    [PieceTypeEnum.bishop]: "B",
    [PieceTypeEnum.rook]: "R",
    [PieceTypeEnum.queen]: "Q",
    [PieceTypeEnum.king]: "K",
  };

  return PIECE_DICT[piece];
};
