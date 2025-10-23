import { Coord, PieceColorTypeEnum, PieceTypeEnum, Mock, MockItem, MockItemResponse, BoardCustom } from "@/interfaces";

const rowOfPawns = (col: number) => Array.from({ length: 8 }, (_, i) => [[col, i], PieceTypeEnum.pawn] as [Coord, PieceTypeEnum]);
const castlingBoard: BoardCustom = {
  black: [[[0, 4], PieceTypeEnum.king], [[0, 0], PieceTypeEnum.rook], [[0, 7], PieceTypeEnum.rook], ...rowOfPawns(1)],
  white: [[[7, 4], PieceTypeEnum.king], [[7, 0], PieceTypeEnum.rook], [[7, 7], PieceTypeEnum.rook], ...rowOfPawns(6)],
};
const pawnBoard: BoardCustom = {
  black: [
    [[0, 4], PieceTypeEnum.king],
    [[1, 4], PieceTypeEnum.pawn],
  ],
  white: [
    [[7, 4], PieceTypeEnum.king],
    [[6, 3], PieceTypeEnum.pawn],
  ],
};
const horseBoard: BoardCustom = {
  black: [...rowOfPawns(0), ...rowOfPawns(1), [[0, 4], PieceTypeEnum.king], [[2, 2], PieceTypeEnum.horse], [[3, 3], PieceTypeEnum.pawn]],
  white: [...rowOfPawns(6), ...rowOfPawns(7), [[7, 4], PieceTypeEnum.king], [[5, 2], PieceTypeEnum.horse], [[4, 3], PieceTypeEnum.pawn]],
};
const bishopBoard: BoardCustom = {
  black: [
    [[0, 4], PieceTypeEnum.king],
    [[3, 3], PieceTypeEnum.bishop],
  ],
  white: [
    [[7, 4], PieceTypeEnum.king],
    [[4, 3], PieceTypeEnum.bishop],
  ],
};
const rookBoard: BoardCustom = {
  black: [[[0, 4], PieceTypeEnum.king]],
  white: [
    [[7, 4], PieceTypeEnum.king],
    [[4, 3], PieceTypeEnum.rook],
  ],
};
const queenBoard: BoardCustom = {
  black: [[[0, 4], PieceTypeEnum.king]],
  white: [
    [[7, 4], PieceTypeEnum.king],
    [[4, 3], PieceTypeEnum.queen],
  ],
};
const kingBoard: BoardCustom = {
  black: [[[1, 4], PieceTypeEnum.king]],
  white: [[[6, 4], PieceTypeEnum.king]],
};
const pinnedBoard: BoardCustom = {
  black: [[[0, 4], PieceTypeEnum.king]],
  white: [[[7, 4], PieceTypeEnum.king]],
};
const checksAndMatesBoard: BoardCustom = {
  black: [
    [[0, 4], PieceTypeEnum.king],
    [[0, 7], PieceTypeEnum.queen],
  ],
  white: [[[7, 6], PieceTypeEnum.king]],
};
const crowningBoard: BoardCustom = {
  black: [[[0, 4], PieceTypeEnum.king]],
  white: [
    [[1, 2], PieceTypeEnum.pawn],
    [[7, 4], PieceTypeEnum.king],
  ],
};
//castling
const createCastlingItem = ({ testType = "default", name, isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    board: castlingBoard,
    initOpts,
    ...override,
  };
};
//basic
const createBasicPawnItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    board: pawnBoard,
    initOpts,
    ...override,
  };
};
const createBasicHorseItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const pos = !isBlack ? [5, 2] : [2, 2];
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    piecePos: pos as Coord,
    board: horseBoard,
    initOpts,
    ...override,
  };
};
const createBasicBishopItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    piecePos: [4, 3] as Coord,
    board: bishopBoard,
    initOpts,
    ...override,
  };
};
const createBasicRookItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    piecePos: [4, 3] as Coord,
    board: rookBoard,
    initOpts,
    ...override,
  };
};
const createBasicQueenItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    piecePos: [4, 3] as Coord,
    board: queenBoard,
    initOpts,
    ...override,
  };
};
const createBasicKingItem = ({ testType = "default", name, isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const pos = !isBlack ? [6, 4] : [1, 4];
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    piecePos: pos as Coord,
    board: kingBoard,
    initOpts,
    ...override,
  };
};
//pinned
const createBasicPinnedItem = ({ name, testType = "default", isBlack = false, ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  const initOpts = isBlack ? ({ playerStart: PieceColorTypeEnum.black } as MockItem["initOpts"]) : undefined;

  return {
    name,
    testType,
    board: pinnedBoard,
    piecePos: [6, 3],
    initOpts,
    response: {
      possibleMoves: [],
    },
    ...override,
  };
};
//checks
const createBasicChecksAndMatesItem = ({ name, testType = "default", ...override }: MockItem & { isBlack?: boolean }): MockItemResponse => {
  return {
    name,
    testType,
    board: checksAndMatesBoard,
    piecePos: [7, 6],
    response: {
      possibleMoves: [],
    },
    ...override,
  };
};

export const MOCKS: Mock = {
  castling: [
    createCastlingItem({
      name: "Castling cannot be performed after moving the king",
      testType: "all",
      moves: [
        [
          [7, 4],
          [7, 5],
        ],
        [
          [0, 4],
          [0, 5],
        ],
      ],
      piecePos: [7, 5],
      response: {
        history: "Kf1|Kf8",
        possibleMoves: [
          [7, 6],
          [7, 4],
        ],
      },
    }),
    createCastlingItem({
      name: "Possible moves with white pieces",
      testType: "getPossibleMoves",
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 5],
          [7, 3],
          [7, 7],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      name: "Possible moves with black pieces",
      testType: "getPossibleMoves",
      isBlack: true,
      piecePos: [0, 4],
      response: {
        possibleMoves: [
          [0, 5],
          [0, 3],
          [0, 7],
          [0, 0],
        ],
      },
    }),
    createCastlingItem({
      name: "Short castling with the white pieces",
      moves: [
        [
          [7, 4],
          [7, 7],
        ],
      ],
      response: {
        history: "O-O",
      },
    }),
    createCastlingItem({
      name: "Long castling with the white pieces",
      moves: [
        [
          [7, 4],
          [7, 0],
        ],
      ],
      response: {
        history: "O-O-O",
      },
    }),
    createCastlingItem({
      name: "Short castling with the black pieces",
      isBlack: true,
      moves: [
        [
          [0, 4],
          [0, 7],
        ],
      ],
      response: {
        history: "O-O",
      },
    }),
    createCastlingItem({
      name: "Long castling with the black pieces",
      isBlack: true,
      piecePos: [0, 4],
      moves: [
        [
          [0, 4],
          [0, 0],
        ],
      ],
      response: {
        history: "O-O-O",
      },
    }),
    createCastlingItem({
      testType: "all",
      name: "Castling not allowed in check",
      board: {
        black: [
          [[0, 2], PieceTypeEnum.king],
          [[0, 5], PieceTypeEnum.rook],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      isBlack: true,
      moves: [
        [
          [0, 5],
          [0, 4],
        ],
      ],
      response: {
        history: "Re8+",
        possibleMoves: [
          [7, 5],
          [7, 3],
          [6, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because rook in f8 is blocking",
      board: {
        black: [[[0, 5], PieceTypeEnum.rook]],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 4],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because rook in d8 is blocking",
      board: {
        black: [[[0, 3], PieceTypeEnum.rook]],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 5],
          [6, 4],
          [6, 5],
          [7, 7],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because bishop in h6 is blocking",
      board: {
        black: [[[2, 7], PieceTypeEnum.bishop]],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 5],
          [7, 3],
          [6, 4],
          [6, 5],
          [7, 7],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Castling not allowed because the bishops in h6-a6 are blocking",
      board: {
        black: [
          [[2, 7], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because bishop in h2 is blocking",
      board: {
        black: [
          [[6, 7], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because bishop in g2 is blocking",
      board: {
        black: [
          [[6, 6], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because bishop in a7 is blocking",
      board: {
        black: [
          [[1, 0], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because queen in g2 is blocking",
      board: {
        black: [
          [[6, 6], PieceTypeEnum.queen],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because pawn in g2 is blocking",
      board: {
        black: [
          [[6, 6], PieceTypeEnum.pawn],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Short castling not allowed because horse in h3 is blocking",
      board: {
        black: [
          [[5, 7], PieceTypeEnum.horse],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because bishop in a2 is blocking",
      board: {
        black: [
          [[0, 4], PieceTypeEnum.king],
          [[6, 0], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because bishop in b2 is blocking",
      board: {
        black: [
          [[6, 1], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because bishop in c2 is blocking",
      board: {
        black: [
          [[6, 2], PieceTypeEnum.bishop],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [6, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because bishop in d2 is blocking",
      board: {
        black: [
          [[0, 4], PieceTypeEnum.king],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
          [7, 0],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because queen in b2 is blocking",
      board: {
        black: [
          [[6, 1], PieceTypeEnum.queen],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [[7, 3]],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because pawn in b2 is blocking",
      board: {
        black: [
          [[0, 2], PieceTypeEnum.king],
          [[6, 1], PieceTypeEnum.pawn],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
        ],
      },
    }),
    createCastlingItem({
      testType: "getPossibleMoves",
      name: "Long castling not allowed because horse in a3 is blocking",
      board: {
        black: [
          [[5, 0], PieceTypeEnum.horse],
          [[2, 0], PieceTypeEnum.bishop],
        ],
        white: [
          [[7, 4], PieceTypeEnum.king],
          [[7, 0], PieceTypeEnum.rook],
          [[7, 7], PieceTypeEnum.rook],
        ],
      },
      piecePos: [7, 4],
      response: {
        possibleMoves: [
          [7, 3],
          [6, 3],
          [6, 5],
        ],
      },
    }),
  ],
  basics: {
    pawn: [
      createBasicPawnItem({
        name: "Possibles moves with white pawn",
        piecePos: [6, 3],
        response: {
          possibleMoves: [
            [5, 3],
            [4, 3],
          ],
        },
      }),
      createBasicPawnItem({
        name: "Possibles moves with black pawn",
        isBlack: true,
        piecePos: [1, 4],
        response: {
          possibleMoves: [
            [2, 4],
            [3, 4],
          ],
        },
      }),
      createBasicPawnItem({
        name: "Possibles moves with white pawn with piece in front",
        board: {
          ...pawnBoard,
          white: [...pawnBoard.white, [[4, 3], PieceTypeEnum.pawn]],
        },
        piecePos: [6, 3],
        response: {
          possibleMoves: [[5, 3]],
        },
      }),
      createBasicPawnItem({
        name: "White possibles moves with white pawn in row 4 and black pawn in row 3",
        testType: "move",
        piecePos: [4, 3],
        moves: [
          [
            [6, 3],
            [4, 3],
          ],
          [
            [1, 4],
            [3, 4],
          ],
        ],
        response: {
          possibleMoves: [
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicPawnItem({
        name: "Black possibles moves with white pawn in row 4 and black pawn in row 3",
        isBlack: true,
        testType: "move",
        piecePos: [3, 4],
        moves: [
          [
            [1, 4],
            [3, 4],
          ],
          [
            [6, 3],
            [4, 3],
          ],
        ],
        response: {
          possibleMoves: [
            [4, 4],
            [4, 3],
          ],
        },
      }),
    ],
    horse: [
      createBasicHorseItem({
        name: "Possibles moves with white horse in c3",
        response: {
          possibleMoves: [
            [4, 0],
            [3, 1],
            [3, 3],
            [4, 4],
          ],
        },
      }),
      createBasicHorseItem({
        name: "Possibles moves with black horse in c6",
        isBlack: true,
        response: {
          possibleMoves: [
            [3, 4],
            [4, 3],
            [4, 1],
            [3, 0],
          ],
        },
      }),
      createBasicHorseItem({
        name: "White horse in c3 moves to d5 and takes piece",
        testType: "moveAndGetHistory",
        moves: [
          [
            [5, 2],
            [3, 3],
          ],
        ],
        response: {
          history: "Nxd5",
        },
      }),
      createBasicHorseItem({
        name: "Black horse in c6 moves to d4 and takes piece",
        testType: "moveAndGetHistory",
        isBlack: true,
        moves: [
          [
            [2, 2],
            [4, 3],
          ],
        ],
        response: {
          history: "Nxd4",
        },
      }),
    ],
    bishop: [
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with empty board",
        board: bishopBoard,
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [6, 1],
            [7, 0],
            [3, 2],
            [2, 1],
            [1, 0],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with white pawn in c5",
        board: {
          ...bishopBoard,
          white: [...bishopBoard.white, [[3, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [6, 1],
            [7, 0],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with white pawns in c5-e5",
        board: {
          ...bishopBoard,
          white: [...bishopBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [6, 1],
            [7, 0],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with white pawns in c5-e5-c3",
        board: {
          ...bishopBoard,
          white: [...bishopBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with white pawns in c5-e5-c3-e3",
        board: {
          ...bishopBoard,
          white: [...bishopBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn], [[5, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with black pawn in c5",
        board: {
          ...bishopBoard,
          black: [...bishopBoard.black, [[3, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [6, 1],
            [7, 0],
            [3, 2],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with black pawns in c5-e5",
        board: {
          ...bishopBoard,
          black: [...bishopBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [6, 1],
            [7, 0],
            [3, 2],
            [3, 4],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with black pawns in c5-e5-c3",
        board: {
          ...bishopBoard,
          black: [...bishopBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 2],
            [3, 2],
            [3, 4],
          ],
        },
      }),
      createBasicBishopItem({
        name: "Possibles moves with white bishop in d4 with black pawns in c5-e5-c3-e3",
        board: {
          ...bishopBoard,
          black: [...bishopBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn], [[5, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [5, 2],
            [3, 2],
            [3, 4],
          ],
        },
      }),
      createBasicBishopItem({
        name: "White bishop in d4 takes e5",
        testType: "moveAndGetHistory",
        board: {
          ...bishopBoard,
          black: [...bishopBoard.black, [[3, 4], PieceTypeEnum.pawn]],
        },
        moves: [
          [
            [4, 3],
            [3, 4],
          ],
        ],
        response: {
          history: "Bxe5",
        },
      }),
    ],
    rook: [
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with empty board",
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 3],
            [6, 3],
            [7, 3],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with white pawn in d5",
        board: {
          ...rookBoard,
          white: [...rookBoard.white, [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 3],
            [6, 3],
            [7, 3],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with white pawns in d5-e4",
        board: {
          ...rookBoard,
          white: [...rookBoard.white, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 3],
            [6, 3],
            [7, 3],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with white pawns in d5-e4-d3",
        board: {
          ...rookBoard,
          white: [...rookBoard.white, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with black pawns in d5-e4-d3-c4",
        board: {
          ...rookBoard,
          white: [...rookBoard.white, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 3], PieceTypeEnum.pawn], [[4, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with white pawn in d5",
        board: {
          ...rookBoard,
          black: [...rookBoard.black, [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 3],
            [6, 3],
            [7, 3],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 3],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with black pawns in d5-e4",
        board: {
          ...rookBoard,
          black: [...rookBoard.black, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 3],
            [6, 3],
            [7, 3],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 3],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with black pawns in d5-e4-d3",
        board: {
          ...rookBoard,
          black: [...rookBoard.black, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 3],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 3],
          ],
        },
      }),
      createBasicRookItem({
        name: "Possibles moves with white rook in d4 with black pawns in d5-e4-d3-c4",
        board: {
          ...rookBoard,
          black: [...rookBoard.black, [[3, 3], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 3], PieceTypeEnum.pawn], [[4, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 3],
            [4, 2],
            [3, 3],
          ],
        },
      }),
      createBasicRookItem({
        name: "White rook in d4 takes d5",
        testType: "moveAndGetHistory",
        board: {
          ...rookBoard,
          black: [...rookBoard.black, [[3, 3], PieceTypeEnum.pawn]],
        },
        moves: [
          [
            [4, 3],
            [3, 3],
          ],
        ],
        response: {
          history: "Rxd5",
        },
      }),
    ],
    queen: [
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with empty board",
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [2, 1],
            [1, 0],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5",
        board: {
          ...queenBoard,
          white: [...queenBoard.white, [[3, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5",
        board: {
          ...queenBoard,
          white: [...queenBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5",
        board: {
          ...queenBoard,
          white: [...queenBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5,e4",
        board: {
          ...queenBoard,
          white: [...queenBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5,e4,e3",
        board: {
          ...queenBoard,
          white: [...queenBoard.white, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5,e4,e3,d3",
        board: {
          ...queenBoard,
          white: [
            ...queenBoard.white,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5,e4,e3,d3,c3",
        board: {
          ...queenBoard,
          white: [
            ...queenBoard.white,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 2], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [4, 2],
            [4, 1],
            [4, 0],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with white pawn in c5,d5,e5,e4,e3,d3,c3,c4",
        board: {
          ...queenBoard,
          white: [
            ...queenBoard.white,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 2], PieceTypeEnum.pawn],
            [[4, 2], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
            [2, 5],
            [1, 6],
            [0, 7],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [4, 5],
            [4, 6],
            [4, 7],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5,e4",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 4],
            [6, 5],
            [7, 6],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5,e4,e3",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 2], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[3, 4], PieceTypeEnum.pawn], [[4, 4], PieceTypeEnum.pawn], [[5, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 4],
            [5, 3],
            [6, 3],
            [7, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5,e4,e3,d3",
        board: {
          ...queenBoard,
          black: [
            ...queenBoard.black,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 4],
            [5, 3],
            [5, 2],
            [6, 1],
            [7, 0],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5,e4,e3,d3,c3",
        board: {
          ...queenBoard,
          black: [
            ...queenBoard.black,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 2], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 4],
            [5, 3],
            [5, 2],
            [4, 2],
            [4, 1],
            [4, 0],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "Possibles moves with white queen in d4 with black pawn in c5,d5,e5,e4,e3,d3,c3,c4",
        board: {
          ...queenBoard,
          black: [
            ...queenBoard.black,
            [[3, 2], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[3, 4], PieceTypeEnum.pawn],
            [[4, 4], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 2], PieceTypeEnum.pawn],
            [[4, 2], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [4, 4],
            [5, 4],
            [5, 3],
            [5, 2],
            [4, 2],
            [3, 2],
            [3, 3],
            [3, 4],
          ],
        },
      }),
      createBasicQueenItem({
        name: "White queen in d4 takes d5",
        testType: "moveAndGetHistory",
        board: {
          ...queenBoard,
          black: [...queenBoard.black, [[3, 3], PieceTypeEnum.pawn]],
        },
        moves: [
          [
            [4, 3],
            [3, 3],
          ],
        ],
        response: {
          history: "Qxd5",
        },
      }),
    ],
    king: [
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with empty board",
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
            [5, 3],
            [5, 4],
            [5, 5],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with full white pawns in first ring",
        board: {
          ...kingBoard,
          white: [
            ...kingBoard.white,
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 5], PieceTypeEnum.pawn],
            [[6, 3], PieceTypeEnum.pawn],
            [[6, 5], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[7, 3], PieceTypeEnum.pawn],
            [[7, 4], PieceTypeEnum.pawn],
            [[7, 5], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with full black pawns on first ring",
        board: {
          ...kingBoard,
          black: [
            ...kingBoard.black,
            [[5, 3], PieceTypeEnum.pawn],
            [[5, 4], PieceTypeEnum.pawn],
            [[5, 5], PieceTypeEnum.pawn],
            [[6, 3], PieceTypeEnum.pawn],
            [[6, 5], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[7, 3], PieceTypeEnum.pawn],
            [[7, 4], PieceTypeEnum.pawn],
            [[7, 5], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
            [5, 3],
            [5, 4],
            [5, 5],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with white pawn on the second ring e4",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
            [5, 3],
            [5, 4],
            [5, 5],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with white pawns on the second ring e4-d4",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[4, 4], PieceTypeEnum.pawn], [[4, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
            [5, 3],
            [5, 4],
            [5, 5],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawn on the second ring e4",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[4, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
            [5, 4],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawns on the second ring e4-d4",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[4, 4], PieceTypeEnum.pawn], [[4, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
            [6, 3],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawns on the second ring e4-d4-c3",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[4, 4], PieceTypeEnum.pawn], [[4, 3], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
            [7, 3],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawns on the second ring e4-d4-c3-c2",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[4, 4], PieceTypeEnum.pawn], [[4, 3], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn], [[6, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [6, 5],
            [7, 5],
            [7, 4],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawns on the second ring e4-d4-c3-c2-g3",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[4, 4], PieceTypeEnum.pawn], [[4, 3], PieceTypeEnum.pawn], [[5, 2], PieceTypeEnum.pawn], [[6, 2], PieceTypeEnum.pawn], [[5, 6], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [7, 5],
            [7, 4],
          ],
        },
      }),
      createBasicKingItem({
        name: "Possibles moves by the white king in e2 with black pawns on the second ring e4-d4-c3-c2-g3-g2",
        board: {
          ...kingBoard,
          black: [
            ...kingBoard.black,
            [[4, 4], PieceTypeEnum.pawn],
            [[4, 3], PieceTypeEnum.pawn],
            [[5, 2], PieceTypeEnum.pawn],
            [[6, 2], PieceTypeEnum.pawn],
            [[5, 6], PieceTypeEnum.pawn],
            [[6, 6], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [[7, 4]],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with empty board",
        response: {
          possibleMoves: [
            [1, 5],
            [2, 5],
            [2, 4],
            [2, 3],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with full black pawns in first ring",
        board: {
          ...kingBoard,
          black: [
            ...kingBoard.black,
            [[0, 3], PieceTypeEnum.pawn],
            [[0, 4], PieceTypeEnum.pawn],
            [[0, 5], PieceTypeEnum.pawn],
            [[1, 3], PieceTypeEnum.pawn],
            [[1, 5], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[2, 3], PieceTypeEnum.pawn],
            [[2, 4], PieceTypeEnum.pawn],
            [[2, 5], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with full white pawns on first ring",
        board: {
          ...kingBoard,
          white: [
            ...kingBoard.white,
            [[0, 3], PieceTypeEnum.pawn],
            [[0, 4], PieceTypeEnum.pawn],
            [[0, 5], PieceTypeEnum.pawn],
            [[1, 3], PieceTypeEnum.pawn],
            [[1, 5], PieceTypeEnum.pawn],
            [[5, 3], PieceTypeEnum.pawn],
            [[2, 3], PieceTypeEnum.pawn],
            [[2, 4], PieceTypeEnum.pawn],
            [[2, 5], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [2, 5],
            [2, 4],
            [2, 3],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with black pawn on the second ring e5",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [2, 5],
            [2, 4],
            [2, 3],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with black pawns on the second ring e5-d5",
        board: {
          ...kingBoard,
          black: [...kingBoard.black, [[3, 4], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [2, 5],
            [2, 4],
            [2, 3],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[3, 4], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [2, 4],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5-d5",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[3, 4], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [1, 3],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5-d5-c6",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[3, 4], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[2, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [0, 3],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5-d5-c6-c7",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[3, 4], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[2, 2], PieceTypeEnum.pawn], [[1, 2], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [1, 5],
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5-d5-c6-c7-g6",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[3, 4], PieceTypeEnum.pawn], [[3, 3], PieceTypeEnum.pawn], [[2, 2], PieceTypeEnum.pawn], [[1, 2], PieceTypeEnum.pawn], [[2, 6], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [0, 4],
            [0, 5],
          ],
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Possibles moves by the black king in e7 with white pawn on the second ring e5-d5-c6-c7-g6-g7",
        board: {
          ...kingBoard,
          white: [
            ...kingBoard.white,
            [[3, 4], PieceTypeEnum.pawn],
            [[3, 3], PieceTypeEnum.pawn],
            [[2, 2], PieceTypeEnum.pawn],
            [[1, 2], PieceTypeEnum.pawn],
            [[2, 6], PieceTypeEnum.pawn],
            [[1, 6], PieceTypeEnum.pawn],
          ],
        },
        response: {
          possibleMoves: [[0, 4]],
        },
      }),
      createBasicKingItem({
        name: "White king in e2 takes e3",
        testType: "move",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[5, 4], PieceTypeEnum.pawn]],
        },
        moves: [
          [
            [6, 4],
            [5, 4],
          ],
        ],
        response: {
          history: "Kxe3",
        },
      }),
      createBasicKingItem({
        isBlack: true,
        name: "Black king in e7 takes e6",
        testType: "move",
        board: {
          ...kingBoard,
          white: [...kingBoard.white, [[2, 4], PieceTypeEnum.pawn]],
        },
        moves: [
          [
            [1, 4],
            [2, 4],
          ],
        ],
        response: {
          history: "Kxe6",
        },
      }),
    ],
  },
  pinned: {
    pawn: [
      createBasicPinnedItem({
        name: "Pawn pinned by bishop",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.bishop]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.pawn]],
        },
      }),
      createBasicPinnedItem({
        name: "Pawn pinned by queen",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.pawn]],
        },
      }),
      createBasicPinnedItem({
        name: "Pawn pinned by queen in c3",
        board: {
          black: [...pinnedBoard.black, [[5, 2], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [[5, 2]],
        },
      }),
      createBasicPinnedItem({
        name: "Pawn pinned by queen in b4",
        board: {
          black: [...pinnedBoard.black, [[4, 1], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [],
        },
      }),
      createBasicPinnedItem({
        name: "Pawn not pinned by horse c4",
        board: {
          black: [...pinnedBoard.black, [[4, 2], PieceTypeEnum.horse]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.pawn]],
        },
        response: {
          possibleMoves: [
            [5, 3],
            [4, 3],
          ],
        },
      }),
      createBasicPinnedItem({
        name: "Pawn pinned by rook cannot capture",
        board: {
          black: [...pinnedBoard.black, [[4, 4], PieceTypeEnum.rook], [[5, 5], PieceTypeEnum.pawn]],
          white: [...pinnedBoard.white, [[6, 4], PieceTypeEnum.pawn]],
        },
        piecePos: [6, 4],
        response: {
          possibleMoves: [[5, 4]],
        },
      }),
    ],
    bishop: [
      createBasicPinnedItem({
        name: "Bishop pinned by bishop",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.bishop]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.bishop]],
        },
        response: {
          possibleMoves: [[3, 0]],
        },
      }),
      createBasicPinnedItem({
        name: "Bishop pinned by queen",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.bishop]],
        },
        response: {
          possibleMoves: [[3, 0]],
        },
      }),
      createBasicPinnedItem({
        name: "Bishop not pinned by horse c4",
        board: {
          black: [...pinnedBoard.black, [[4, 2], PieceTypeEnum.horse]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.bishop]],
        },
        response: {
          possibleMoves: [
            [7, 2],
            [5, 2],
            [4, 1],
            [3, 0],
            [5, 4],
            [4, 5],
            [3, 6],
            [2, 7],
          ],
        },
      }),
      createBasicPinnedItem({
        name: "Bishop pinned by rook cannot capture",
        board: {
          black: [...pinnedBoard.black, [[4, 4], PieceTypeEnum.rook], [[5, 5], PieceTypeEnum.pawn]],
          white: [...pinnedBoard.white, [[6, 4], PieceTypeEnum.bishop]],
        },
      }),
    ],
    horse: [
      createBasicPinnedItem({
        name: "Horse pinned by bishop",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.bishop]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.horse]],
        },
      }),
      createBasicPinnedItem({
        name: "Horse pinned by queen",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.horse]],
        },
      }),
      createBasicPinnedItem({
        name: "Horse not pinned by horse c4",
        board: {
          black: [...pinnedBoard.black, [[4, 2], PieceTypeEnum.horse]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.horse]],
        },
        response: {
          possibleMoves: [
            [7, 5],
            [7, 1],
            [5, 1],
            [4, 2],
            [4, 4],
            [5, 5],
          ],
        },
      }),
      createBasicPinnedItem({
        name: "Horse pinned by rook cannot capture",
        board: {
          black: [...pinnedBoard.black, [[4, 4], PieceTypeEnum.rook], [[4, 5], PieceTypeEnum.pawn]],
          white: [...pinnedBoard.white, [[6, 4], PieceTypeEnum.horse]],
        },
        response: {
          possibleMoves: [],
        },
      }),
    ],
    rook: [
      createBasicPinnedItem({
        name: "Rook pinned by bishop",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.bishop]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.rook]],
        },
      }),
      createBasicPinnedItem({
        name: "Rook pinned by queen",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.rook]],
        },
      }),
      createBasicPinnedItem({
        name: "Rook not pinned by horse c4",
        board: {
          black: [...pinnedBoard.black, [[4, 2], PieceTypeEnum.horse]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.rook]],
        },
        response: {
          possibleMoves: [
            [6, 4],
            [6, 5],
            [6, 6],
            [6, 7],
            [7, 3],
            [6, 2],
            [6, 1],
            [6, 0],
            [5, 3],
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
          ],
        },
      }),
      createBasicPinnedItem({
        name: "Rook pinned by rook but I can still capture it",
        board: {
          black: [...pinnedBoard.black, [[4, 4], PieceTypeEnum.rook], [[4, 5], PieceTypeEnum.pawn]],
          white: [...pinnedBoard.white, [[6, 4], PieceTypeEnum.rook]],
        },
        piecePos: [6, 4],
        response: {
          possibleMoves: [[4, 4]],
        },
      }),
    ],
    king: [],
    queen: [
      createBasicPinnedItem({
        name: "Queen pinned by bishop",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.bishop]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.queen]],
        },
        response: {
          possibleMoves: [[3, 0]],
        },
      }),
      createBasicPinnedItem({
        name: "Queen pinned by queen",
        board: {
          black: [...pinnedBoard.black, [[3, 0], PieceTypeEnum.queen]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.queen]],
        },
        response: {
          possibleMoves: [[3, 0]],
        },
      }),
      createBasicPinnedItem({
        name: "Queen not pinned by horse c4",
        board: {
          black: [...pinnedBoard.black, [[4, 2], PieceTypeEnum.horse]],
          white: [...pinnedBoard.white, [[6, 3], PieceTypeEnum.queen]],
        },
        response: {
          possibleMoves: [
            [6, 4],
            [6, 5],
            [6, 6],
            [6, 7],
            [7, 3],
            [7, 2],
            [6, 2],
            [6, 1],
            [6, 0],
            [5, 2],
            [4, 1],
            [3, 0],
            [5, 3],
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
            [5, 4],
            [4, 5],
            [3, 6],
            [2, 7],
          ],
        },
      }),
      createBasicPinnedItem({
        name: "Queen pinned by rook cannot capture",
        board: {
          black: [...pinnedBoard.black, [[4, 4], PieceTypeEnum.rook], [[5, 5], PieceTypeEnum.pawn]],
          white: [...pinnedBoard.white, [[6, 4], PieceTypeEnum.queen]],
        },
        piecePos: [6, 4],
        response: {
          possibleMoves: [[4, 4]],
        },
      }),
    ],
  },
  checksAndMates: {
    checks: [
      createBasicChecksAndMatesItem({
        name: "Black moves the queen to g8, delivering check on g1possibleMoves: h1,h2,f1,f2",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 7], to: [0, 6] },
        },
        response: {
          possibleMoves: [
            [7, 7],
            [7, 5],
            [6, 5],
            [6, 7],
          ],
          history: "Qg8+",
        },
      }),
      createBasicChecksAndMatesItem({
        name: "Black moves the queen to g8, delivering check on g1, possibleMoves: f1,h2",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 7], to: [0, 6] },
        },
        board: {
          ...checksAndMatesBoard,
          white: [...checksAndMatesBoard.white, [[7, 7], PieceTypeEnum.rook], [[6, 5], PieceTypeEnum.rook]],
        },
        response: {
          possibleMoves: [
            [7, 5],
            [6, 7],
          ],
          history: "Qg8+",
        },
      }),
      createBasicChecksAndMatesItem({
        name: "Cover check on g2 by rook",
        testType: "all",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 7], to: [0, 6] },
        },
        board: {
          ...checksAndMatesBoard,
          white: [...checksAndMatesBoard.white, [[7, 7], PieceTypeEnum.rook], [[6, 5], PieceTypeEnum.rook]],
        },
        piecePos: [6, 5],
        moves: [
          [
            [6, 5],
            [6, 6],
          ],
        ],
        response: {
          possibleMoves: [[6, 6]],
          history: "Qg8+|Rg2",
        },
      }),
      createBasicChecksAndMatesItem({
        name: "Cover check on g7 by rook and take piece on g7",
        testType: "all",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 7], to: [0, 6] },
        },
        board: {
          black: [...checksAndMatesBoard.black, [[6, 6], PieceTypeEnum.queen], [[1, 2], PieceTypeEnum.pawn]],
          white: [...checksAndMatesBoard.white, [[7, 7], PieceTypeEnum.rook], [[6, 7], PieceTypeEnum.rook]],
        },
        piecePos: [6, 7],
        moves: [
          [
            [6, 7],
            [6, 6],
          ],
          [
            [1, 2],
            [2, 2],
          ],
          [
            [6, 6],
            [0, 6],
          ],
        ],
        response: {
          possibleMoves: [[6, 6]],
          history: "Qg8+|Rxg2|c6|Rxg8+",
        },
      }),
      createBasicChecksAndMatesItem({
        name: "Taking the queen on g2, which delivers check because it is undefended",
        testType: "all",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 6], to: [6, 6] },
        },
        board: {
          black: [...checksAndMatesBoard.black, [[0, 6], PieceTypeEnum.queen], [[1, 2], PieceTypeEnum.pawn]],
          white: checksAndMatesBoard.white,
        },
        piecePos: [7, 6],
        moves: [
          [
            [7, 6],
            [6, 6],
          ],
        ],
        response: {
          possibleMoves: [[6, 6]],
          history: "Qg2+|Kxg2",
        },
      }),
      createBasicChecksAndMatesItem({
        name: "Cannot take in g2 because is piece protected",
        board: {
          black: [...checksAndMatesBoard.black, [[0, 6], PieceTypeEnum.queen], [[6, 6], PieceTypeEnum.queen], [[1, 2], PieceTypeEnum.pawn]],
          white: [...checksAndMatesBoard.white, [[7, 7], PieceTypeEnum.rook], [[6, 7], PieceTypeEnum.rook]],
        },
        piecePos: [7, 6],
        response: {
          possibleMoves: [],
          history: "",
        },
      }),
    ],
    mates: [
      createBasicChecksAndMatesItem({
        name: "Black moves the queen to g8, delivering check on g1possibleMoves: h1,h2,f1,f2",
        initOpts: {
          playerStart: PieceColorTypeEnum.black,
          move: { from: [0, 7], to: [0, 6] },
        },
        board: {
          black: checksAndMatesBoard.black,
          white: [...checksAndMatesBoard.white, [[7, 7], PieceTypeEnum.pawn], [[6, 7], PieceTypeEnum.pawn], [[7, 5], PieceTypeEnum.pawn], [[6, 5], PieceTypeEnum.pawn]],
        },
        response: {
          history: "Qg8#",
        },
      }),
    ],
  },
  crowning: [],
};
