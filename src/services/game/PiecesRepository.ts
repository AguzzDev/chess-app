/* eslint-disable @typescript-eslint/no-unused-expressions */
import { CONSTANTS } from "@/constants";
import {
  Piece,
  PieceTypeEnum,
  PieceColorTypeEnum,
  GetMovesArgs,
  CastlingTypeEnum,
  CoordGroupArray,
  CoordGroup,
  Coord,
  CheckPossibleMovesPieceArgs,
  PieceFlags,
  PieceObj,
  BoardPiece,
} from "@/interfaces";
import { arrayFilter, getSurroundings, directionsMapping, getBoardByColor } from "./utils";
import { cloneBoard } from "./utils/cloneBoard";

export class PieceFactory {
  static create(args: PieceObj): Piece {
    switch (args.type) {
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

export class PieceBase {
  piece: PieceObj;
  flags?: PieceFlags | null;
  board: BoardPiece;

  constructor(args: PieceObj) {
    this.board = [];
    this.piece = {
      ...args,
      pinned: false,
      castledAllowed: {
        large: true,
        short: true,
      },
    };
  }

  /**
   * Checks if the piece has the king behind it
   */
  hasKingBehindMoves(): CoordGroup {
    const res: CoordGroup = [];
    const piece = this.piece;
    const [startY, startX] = piece.pos;

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
        const piece = this.board[y][x].type;
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

  /**
   * Checks if the piece in this position is a valid box to save its moves
   */
  checkIfAValidBox({ pos }: { pos: Coord }): {
    valid: boolean;
    isOpponent?: boolean;
    isMine?: boolean;
    isEmpty?: boolean;
  } {
    const [y, x] = pos;
    const piece = this.piece;
    const board = this.board;
    if (y > 7 || y < 0 || x > 7 || x < 0) return { valid: false };

    const currentItem = board![y][x] as PieceObj;
    if (currentItem.type == PieceTypeEnum.empty) {
      return { valid: true, isEmpty: true };
    }

    const isKing = currentItem.type === PieceTypeEnum.king && !!this.flags?.includeKing;
    if (isKing) {
      return { valid: true, isOpponent: true };
    }

    const isMine = currentItem.color === piece.color;
    if (isMine) return { valid: true, isMine: true, isOpponent: false };

    const isOpponent = currentItem.color !== piece.color;
    if (isOpponent) {
      return { valid: true, isMine: false, isOpponent: true };
    }

    return { valid: false, isOpponent: false, isMine: false };
  }

  /**
   * Checks if the piece is pinned
   */
  checkIfPiecePinned(): { exist: boolean; res: CoordGroup } {
    const res = {
      exist: false,
      res: [] as CoordGroup,
    };
    const piece = this.piece;
    if (piece.type === PieceTypeEnum.king) return res;

    const [startY, startX] = piece.pos;
    const color = piece.color!;
    const opponentColor = color === PieceColorTypeEnum.black ? PieceColorTypeEnum.white : PieceColorTypeEnum.black;
    const simulateBoard = cloneBoard(this.board);
    const turnBoard = getBoardByColor({ color, board: simulateBoard });
    const opponentBoard = getBoardByColor({ color: opponentColor, board: simulateBoard });
    const pieceMovesAndSurroundings: CoordGroupArray = [];

    simulateBoard[startY][startX].type = PieceTypeEnum.empty;

    const kingPos = turnBoard
      .map((group, y) =>
        group.map((item, x) => {
          return item.type === PieceTypeEnum.king && [y, x];
        })
      )
      .flat()
      .filter(Boolean)
      .flat() as Coord;

    const pieceMoves = this.checkPossibleMoves({ board: simulateBoard, flags: { ...this.flags, skipPinned: true, skipExtraPawnMove: true } });
    const kingBehindMoves = this.hasKingBehindMoves();

    pieceMovesAndSurroundings.push(pieceMoves.flat(), kingBehindMoves);
    opponentBoard.forEach((group, y) =>
      group.forEach((item, x) => {
        const value = item.type;
        if (value === -1 || value === PieceTypeEnum.king) return;

        const moves = PieceFactory.create({
          pos: [y, x],
          color: opponentColor,
          type: value as PieceTypeEnum,
        }).checkPossibleMoves({
          board: simulateBoard,
          flags: { includeKing: true, skipPinned: true },
        });

        const pointingToKing = moves.filter((arr) => arr.some(([y, x]) => y === kingPos[0] && x === kingPos[1])).flat();
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

          movesToOpponentPiece.length > 0 ? res.res.push(...movesToOpponentPiece.flat()!) : res.res.push(...movesToDefend.flat()!);

          if (isKing.length > 0) {
            res.exist = true;
            piece.pinned = true;
          }
        }
      })
    );

    return res;
  }

  /**
   * Obtains all moves by direction of the piece
   */
  getMovesByDirection({ directions, pos, steps = 8 }: GetMovesArgs): CoordGroupArray {
    const [startY, startX] = pos;

    return directionsMapping([startY, startX], directions, steps, ([y, x], internal) => {
      if (!this.flags!.skipPinned) {
        const pinned = this.checkIfPiecePinned();
        if (pinned.exist) {
          internal.push(...pinned.res);
          return "stopAll";
        }
      }

      const { isOpponent, isMine, isEmpty } = this.checkIfAValidBox({
        pos: [y, x],
      });
      if (JSON.stringify(pos) === JSON.stringify([y, x])) {
        return "continue";
      }
      if (isMine && !this.flags?.simulateMode) {
        return "break";
      }
      if (!!isEmpty || !!isMine) {
        internal.push([y, x]);
        return "continue";
      }
      if (!!isOpponent) {
        internal.push([y, x]);
        return "break";
      }

      return "continue";
    });
  }

  /**
   * Obtains all moves of the piece
   */
  checkPossibleMoves({ board, flags }: CheckPossibleMovesPieceArgs): CoordGroupArray {
    this.flags = flags;
    this.board = board;

    const twoSteps = [PieceTypeEnum.king, PieceTypeEnum.horse, PieceTypeEnum.pawn];
    const moves = this.getMovesByDirection({
      directions: CONSTANTS.PIECES.DIRECTIONS[this.piece.type],
      pos: this.piece.pos,
      steps: twoSteps.includes(this.piece.type) ? 2 : 8,
    });
    if (this.piece.pinned) return moves;
    if (this.flags.inCheck?.status && this.piece.type !== PieceTypeEnum.king) {
      return arrayFilter({
        type: "equal",
        arrays: { arr: moves.flat(), arrToFilter: this.flags.inCheck!.moves! },
      });
    }

    return moves;
  }

  /**
   * Reset pinned state to default
   */
  clearPinned() {
    this.piece.pinned = false;
  }
}

class Pawn extends PieceBase {
  constructor(piece: PieceObj) {
    super(piece);
  }

  override checkPossibleMoves({ board, flags }: CheckPossibleMovesPieceArgs): CoordGroupArray {
    const res: CoordGroupArray = [];
    const colorBlack = this.piece.color === PieceColorTypeEnum.black;
    const [fromY, fromX] = this.piece.pos;

    res.push(...super.checkPossibleMoves({ board, flags }));
    if (!this.piece.pinned && !flags?.skipExtraPawnMove && (fromY === 1 || fromY === 6)) {
      const emptyPosition1 = this.board?.[colorBlack ? fromY + 1 : fromY - 1]?.[fromX]?.type == PieceTypeEnum.empty;
      const emptyPosition2 = this.board?.[colorBlack ? fromY + 2 : fromY - 2]?.[fromX]?.type == PieceTypeEnum.empty;
      if (emptyPosition1 && emptyPosition2) {
        const sumY = colorBlack ? fromY + 2 : fromY - 2;
        const { valid } = this.checkIfAValidBox({
          pos: [sumY, fromX],
        });
        if (valid) {
          res.push([[sumY, fromX]]);
        }
      }
    }

    const [startY, startX] = this.piece.pos;
    const filtered = res
      .filter((item) => item.length > 0)
      .filter(([coord]) => {
        const [y, x] = coord;
        const dy = y - startY;
        const dx = x - startX;

        const isVertical = dx === 0 && dy !== 0;
        const isDiagonal = Math.abs(dx) === Math.abs(dy) && dx !== 0;

        return isVertical || isDiagonal;
      })
      .filter((v) => v.some(([y]) => (colorBlack ? y > startY : y < startY)))
      .filter(([coord]) => {
        const [y, x] = coord;
        const pieceAtTarget = board![y][x];
        const dx = x - startX;

        const isVertical = dx === 0;
        const isDiagonal = Math.abs(dx) === Math.abs(y - startY) && dx !== 0;

        if (isVertical && pieceAtTarget.type === PieceTypeEnum.empty) return true;
        if (isDiagonal && pieceAtTarget.type !== PieceTypeEnum.empty) return true;
        return false;
      });

    return filtered;
  }
}

class King extends PieceBase {
  constructor(piece: PieceObj) {
    super(piece);
  }

  override checkPossibleMoves({ board, flags }: CheckPossibleMovesPieceArgs): CoordGroupArray {
    const result: CoordGroupArray = [];
    const castlingData: CoordGroup = [];
    const controlledSquares: CoordGroup = [];

    const piece = this.piece;
    const [startY, startX] = piece.pos;
    result.push(...super.checkPossibleMoves({ board, flags }));
    const simulateBoard = cloneBoard(this.board);
    const color = this.piece.color!;
    const opponentColor = color === PieceColorTypeEnum.black ? PieceColorTypeEnum.white : PieceColorTypeEnum.black;
    const opponentBoard = getBoardByColor({ color: opponentColor, board: simulateBoard });
    const turnBoard = getBoardByColor({ color, board: simulateBoard });

    const surroundings = getSurroundings({
      pos: [startY, startX],
    }) as CoordGroupArray;

    const getMovesBlocked = (): CoordGroup => {
      const piecesMoves: [Coord, CoordGroupArray][] = [];
      const kingMoves: CoordGroup = surroundings.flat();

      opponentBoard.forEach((group, y) =>
        group.forEach((item, x) => {
          const value = item.type;
          if (value === PieceTypeEnum.empty || value === PieceTypeEnum.king) return;

          const moves = PieceFactory.create({
            pos: [y, x],
            color: opponentColor,
            type: value,
          }).checkPossibleMoves({
            board: simulateBoard,
            flags: { simulateMode: true, skipPinned: true },
          });

          controlledSquares.push(...moves.flat());
        })
      );

      const isProtected = (targetPos: Coord): boolean => {
        return piecesMoves.some(([from, moves]) =>
          moves.some(([coord]) => {
            return JSON.stringify(coord) === JSON.stringify(targetPos) && JSON.stringify(from) !== JSON.stringify(targetPos);
          })
        );
      };

      const legalKingMoves = kingMoves.filter((move) => {
        const squareControlled = controlledSquares.some((c) => JSON.stringify(c) === JSON.stringify(move));

        if (!squareControlled) {
          return false;
        }

        const [y, x] = move;
        const enemyPiece = opponentBoard[y]?.[x];
        if (enemyPiece && enemyPiece.type !== PieceTypeEnum.empty) {
          return !isProtected(move);
        }
        return true;
      });

      return legalKingMoves;
    };

    const castlingMapper = (type: CastlingTypeEnum) => {
      if (!piece.castledAllowed![type]) return;
      if ((startY !== 0 && startY !== 7) || (startX !== 3 && startX !== 4)) return;
      if (this.flags?.inCheck) return;

      const res: CoordGroup = [];
      const start = type === CastlingTypeEnum.short ? startX + 1 : startX - 1;
      const end = type === CastlingTypeEnum.short ? 7 : 0;
      const piecesBlocking = getMovesBlocked();

      const cond = type === CastlingTypeEnum.short ? piecesBlocking.some(([y, x]) => y === startY && x >= start) : piecesBlocking.some(([y, x]) => y === startY && x <= start);
      if (cond) return;

      for (let x = start; type === CastlingTypeEnum.short ? x <= end : x >= end; type === CastlingTypeEnum.short ? x++ : x--) {
        const value = turnBoard[startY][x].type;
        if (value == PieceTypeEnum.rook) {
          res.push([startY, x]);
        }
        if (value != PieceTypeEnum.empty) break;
      }

      result.push(res);
      castlingData.push(...res);
    };

    castlingMapper(CastlingTypeEnum.short);
    castlingMapper(CastlingTypeEnum.large);

    return arrayFilter({
      type: "twoArrayNotContain",
      arrays: {
        arr: result,
        arrToFilter: getMovesBlocked(),
      },
    });
  }
}
