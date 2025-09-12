import { CONSTANTS } from "@/constants";
import {
  PieceArgs,
  Piece,
  PieceTypeEnum,
  PieceColorTypeEnum,
  CheckPositionArgs,
  GetMovesArgs,
  CastlingTypeEnum,
  CoordGroupArray,
  CoordGroup,
  Coord,
} from "@/interfaces";
import { arrayFilter } from "./utils/arrayFilter";
import { getSurroundings } from "./utils/getSurroundings";
import { directionsMapping } from "./utils/directionsMapping";

export class PieceFactory {
  static create(args: PieceArgs): Piece {
    switch (args.opts.type) {
      case PieceTypeEnum.pawn:
        return new Pawn(args);

      case PieceTypeEnum.horse:
        return new PieceBase(args);

      case PieceTypeEnum.bishop:
        return new PieceBase(args);

      case PieceTypeEnum.rook:
        return new PieceBase(args);

      case PieceTypeEnum.queen:
        return new PieceBase(args);

      case PieceTypeEnum.king:
        return new King(args);

      default:
        throw new Error("Unknown piece type");
    }
  }
}

class PieceBase {
  piece: PieceArgs["opts"];
  boards: PieceArgs["boards"];
  includeKing: PieceArgs["includeKing"];
  simulateMode: PieceArgs["simulateMode"];
  skipPinned: PieceArgs["skipPinned"];
  inCheck: PieceArgs["inCheck"];

  constructor(args: PieceArgs) {
    this.piece = {
      ...args.opts,
      pinned: false,
      castledAllowed: true,
    };
    this.boards = args.boards;
    this.includeKing = args.includeKing;
    this.simulateMode = args.simulateMode;
    this.skipPinned = args.skipPinned;
    this.inCheck = args.inCheck;
  }

  hasKingBehindMoves(): CoordGroup {
    const res: CoordGroup = [];
    const piece = this.piece;
    const [startY, startX] = piece.pos;
    const board = this.boards[piece.color!].map((row) => [...row]);

    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];

    for (const [dy, dx] of directions) {
      let y = startY + dy;
      let x = startX + dx;

      while (y >= 0 && y < 8 && x >= 0 && x < 8) {
        const piece = board[y][x];
        if (piece == PieceTypeEnum.king) {
          res.push([y, x]);
          break;
        }

        y += dy;
        x += dx;
      }
    }

    return res;
  }

  checkIfAValidBox({ pos, color }: CheckPositionArgs): {
    valid: boolean;
    isOpponent?: boolean;
    isMine?: boolean;
  } {
    const y = pos[0];
    const x = pos[1];

    const board = this.boards;
    const whiteBoard = board.white;
    const blackBoard = board.black;

    if (y > 7 || y < 0 || x > 7 || x < 0) return { valid: false };
    const isKing =
      (this.boards.normal[y][x] as PieceTypeEnum | number) ==
      PieceTypeEnum.king;
    if (isKing) {
      return { valid: this.includeKing! };
    }

    const isMine =
      color === PieceColorTypeEnum.black
        ? blackBoard[y][x] != -1
        : whiteBoard[y][x] != -1;
    if (isMine) return { valid: false, isMine: true };

    const isOpponent =
      color === PieceColorTypeEnum.black
        ? whiteBoard[y][x] != -1
        : blackBoard[y][x] != -1;

    if (this.piece.type == PieceTypeEnum.pawn) {
      const [, fromX] = this.piece.pos;
      if (isOpponent && x === fromX) return { valid: false };
      if (!isOpponent && fromX != x) return { valid: false };
    }

    return { valid: true, isOpponent };
  }

  checkIfPiecePinned(): { exist: boolean; res: CoordGroup } {
    const res = {
      exist: false,
      res: [] as CoordGroup,
    };
    const piece = this.piece;
    if (piece.type === PieceTypeEnum.king) return res;

    const [startY, startX] = this.piece.pos;
    const color = this.piece.color!;
    const opponentColor =
      color === PieceColorTypeEnum.black
        ? PieceColorTypeEnum.white
        : PieceColorTypeEnum.black;
    const board = this.boards[color].map((row) => [...row]);
    const opponentBoard = this.boards[opponentColor].map((row) => [...row]);
    const normalBoard = this.boards.normal.map((row) => [...row]);
    const allBoards = {
      black: color === PieceColorTypeEnum.black ? board : opponentBoard,
      white: color === PieceColorTypeEnum.white ? board : opponentBoard,
      normal: normalBoard,
    };
    const pieceMovesAndSurroundings: CoordGroupArray = [];

    board[startY][startX] = -1;
    normalBoard[startY][startX] = -1;

    const kingPos = board
      .map((group, y) =>
        group.map((number, x) => {
          return number === 5 && [y, x];
        })
      )
      .flat()
      .filter(Boolean)
      .flat() as Coord;

    const pieceMoves = PieceFactory.create({
      opts: piece,
      boards: allBoards,
      skipPinned: true,
    }).checkPossibleMoves();

    const kingBehindMoves = this.hasKingBehindMoves();
    if (kingBehindMoves.length === 0) {
      return res;
    }
    pieceMovesAndSurroundings.push(pieceMoves.flat(), kingBehindMoves);

    opponentBoard.forEach((group, y) =>
      group.forEach((value, x) => {
        if (value === -1 || value === PieceTypeEnum.king) return;

        const moves = PieceFactory.create({
          opts: {
            pos: [y, x],
            color: opponentColor,
            type: value as PieceTypeEnum,
          },
          boards: allBoards,
          skipPinned: true,
          includeKing: true,
        }).checkPossibleMoves();

        const pointingToKing = moves
          .filter((arr) =>
            arr.some(([y, x]) => y === kingPos[0] && x === kingPos[1])
          )
          .flat();
        if (pointingToKing.length > 0) {
          pointingToKing.unshift([y, x]);

          const pointingToOpponentPiece = arrayFilter({
            type: "twoArrayContain",
            arrays: {
              arr: pieceMovesAndSurroundings,
              arrToFilter: [...pointingToKing],
            },
          }) as CoordGroupArray;
          const filtered = arrayFilter({
            type: "twoArrayContain",
            arrays: {
              arr: pointingToOpponentPiece,
              arrToFilter: pointingToKing,
            },
          }) as CoordGroupArray;
          const isKing = arrayFilter({
            type: "oneArrayContain",
            arrays: { arr: filtered, arrToFilter: kingPos },
          });

          const movesToOpponentPiece = arrayFilter({
            type: "oneArrayContainExact",
            arrays: { arr: pointingToOpponentPiece, arrToFilter: [y, x] },
          });
          const movesToDefend = arrayFilter({
            type: "twoArrayContainExact",
            arrays: { arr: pieceMoves, arrToFilter: pointingToKing },
          });

          if (movesToOpponentPiece.length > 0) {
            res.res.push(...movesToOpponentPiece.flat()!);
          } else {
            res.res.push(...movesToDefend.flat()!);
          }

          if (isKing.length > 0) {
            res.exist = true;
            piece.pinned = true;
          }
        }
      })
    );

    return res;
  }

  getMovesByDirection({ directions, pos, steps = 8 }: GetMovesArgs) {
    const [startY, startX] = pos;

    return directionsMapping(
      [startY, startX],
      directions,
      steps,
      ([y, x], internal) => {
        if (!this.skipPinned) {
          const pinned = this.checkIfPiecePinned();
          if (pinned.exist) {
            internal.push(...pinned.res);
            return "stopAll";
          }
        }

        const { valid, isOpponent, isMine } = this.checkIfAValidBox({
          pos: [y, x],
          color: this.piece.color,
        });

        if (!valid) {
          if (isMine && this.simulateMode) internal.push([y, x]);
          return "break";
        }

        internal.push([y, x]);
        if (isOpponent && !this.simulateMode) return "break";

        return "continue";
      }
    );
  }

  checkPossibleMoves(): CoordGroupArray {
    const twoSteps = [
      PieceTypeEnum.king,
      PieceTypeEnum.horse,
      PieceTypeEnum.pawn,
    ];
    const moves = this.getMovesByDirection({
      directions: CONSTANTS.PIECES.DIRECTIONS[this.piece.type],
      pos: this.piece.pos,
      steps: twoSteps.includes(this.piece.type) ? 2 : 8,
    });

    if (this.piece.pinned) return moves;
    if (this.inCheck?.status && this.piece.type !== PieceTypeEnum.king) {
      return arrayFilter({
        type: "equal",
        arrays: { arr: moves.flat(), arrToFilter: this.inCheck!.moves! },
      });
    }

    return moves;
  }
}

class Pawn extends PieceBase {
  constructor(piece: PieceArgs) {
    super(piece);
  }

  override checkPossibleMoves(): CoordGroupArray {
    const res: CoordGroupArray = [];
    const colorBlack = this.piece.color === PieceColorTypeEnum.black;
    const [fromY, fromX] = this.piece.pos;

    res.push(...super.checkPossibleMoves());
    if (this.piece.pinned || this.inCheck) return res;

    if (fromY === 1 || fromY === 6) {
      const sumY = colorBlack ? fromY + 2 : fromY - 2;
      const { valid } = this.checkIfAValidBox({
        pos: [sumY, fromX],
        color: this.piece.color,
      });
      if (valid) {
        res.push([[sumY, fromX]]);
      }
    }

    return res.filter((v) =>
      v.some(([y]) => (colorBlack ? y > fromY : y < fromY))
    );
  }
}

class King extends PieceBase {
  constructor(piece: PieceArgs) {
    super(piece);
  }

  override checkPossibleMoves(): CoordGroupArray {
    const result: CoordGroupArray = [];

    const piece = this.piece;
    const [startY, startX] = piece.pos;
    const color = this.piece.color!;
    const opponentColor =
      color === PieceColorTypeEnum.black
        ? PieceColorTypeEnum.white
        : PieceColorTypeEnum.black;
    const board = this.boards[color];
    const opponentBoard = this.boards[opponentColor];
    const normalBoard = this.boards.normal;
    const allBoards = this.boards;
    result.push(...super.checkPossibleMoves());

    const getMovesBlocked = ({
      surroundings,
    }: {
      surroundings?: CoordGroupArray;
    }): CoordGroup => {
      const res = [] as CoordGroup;

      opponentBoard.forEach((group, y) =>
        group.forEach((value, x) => {
          if (value === -1 || value == PieceTypeEnum.king) return;
          const moves = PieceFactory.create({
            opts: {
              pos: [y, x],
              color: opponentColor,
              type: value as PieceTypeEnum,
            },
            boards: allBoards,
            includeKing: true,
          })
            .checkPossibleMoves()
            .flat();

          const isOpponentPiece = opponentBoard[y][x] === value;
          if (value === PieceTypeEnum.pawn && surroundings) {
            const arr = surroundings[1]
              .map(([y, x]) => {
                const piece = normalBoard[y][x];
                const isOpponentPiece = opponentBoard[y][x] === value;

                if (piece === PieceTypeEnum.pawn) {
                  if (!isOpponentPiece) return null;

                  const cond =
                    opponentColor === PieceColorTypeEnum.black
                      ? y <= startY
                      : y >= startY;
                  if (!cond) return null;

                  return [y, x];
                }
              })
              .filter(Boolean);
            if (arr.length > 0) {
              (arr as CoordGroup).forEach(([y, x]) => {
                const piece = normalBoard[y][x];
                if (piece != PieceTypeEnum.pawn) {
                  res.push([y, x]);
                  return;
                }

                const y1 =
                  opponentColor === PieceColorTypeEnum.black ? y + 1 : y - 1;

                res.push([y1, x + 1]);
                res.push([y1, x - 1]);
              });
            }
          } else {
            if (isOpponentPiece) {
              res.push(...moves);
            }
          }
        })
      );

      return res;
    };

    const castlingMapper = (type: CastlingTypeEnum) => {
      if ((startY !== 0 && startY !== 7) || (startX !== 3 && startX !== 4))
        return;
      if (this.inCheck) return;
      const res: CoordGroup = [];
      const start = type === CastlingTypeEnum.short ? startX + 1 : startX - 1;
      const end = type === CastlingTypeEnum.short ? 7 : 0;
      const piecesBlocking = getMovesBlocked({});

      const cond =
        type === CastlingTypeEnum.short
          ? piecesBlocking.some(([y, x]) => y === startY && x >= start)
          : piecesBlocking.some(([y, x]) => y === startY && x <= start);
      if (cond) return;

      for (
        let i = start;
        type === CastlingTypeEnum.short ? i <= end : i >= end;
        type === CastlingTypeEnum.short ? i++ : i--
      ) {
        const value = board[startY][i];
        const opponentValue = opponentBoard[startY][i];

        if (value !== -1 || opponentValue !== -1) {
          if (value === PieceTypeEnum.rook && (i === 0 || i === 7))
            res.push([startY, i]);
          break;
        }
      }

      result.push(res);
    };

    castlingMapper(CastlingTypeEnum.short);
    castlingMapper(CastlingTypeEnum.large);

    const movesBlocked = () => {
      return getMovesBlocked({
        surroundings: getSurroundings({
          pos: [startY, startX],
        }) as CoordGroupArray,
      });
    };

    return arrayFilter({
      type: "twoArrayNotContain",
      arrays: {
        arr: result,
        arrToFilter: movesBlocked(),
      },
    });
  }
}
