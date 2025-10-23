import {
  Board,
  PieceTypeEnum,
  PieceColorTypeEnum,
  MoveToArgs,
  GetPossibleMovesArgs,
  BoardColumnTypeEnum,
  UpdateHistoryArgs,
  BoardGame,
  BoardStatus,
  PieceObj,
  BoardMappingArgs,
  BoardMappingTypeEnum,
  BoardEachStatus,
  MoveToResponse,
  BoardTypeEnum,
  GameStatusTypeEnum,
  CastlingTypeEnum,
  BoardCustom,
  GetMovesToKingResponse,
  Coord,
  CoordWithGroupArray,
  CoordGroup,
  CoordGroupArray,
  FromTo,
  GameMoveType,
  Piece,
  BoardPiece,
  BoardCustomValues,
  BoardFactoryArgs,
  GameRepositoryInterface,
  ReviewBoardRepositoryInterface,
  GetBoardArgs,
  GetPieceArgs,
  StartGameArgs,
} from "@/interfaces";
import { PieceFactory } from "./PiecesRepository";
import { CONSTANTS } from "@/constants";
import { SocketRepository } from "./SocketRepository";
import { arrayFilter, getPieceNotation, getSurroundings, directionsMapping, getBoardByColor } from "./utils";

export class BoardFactory {
  static create({ type, customBoard, historyMoves }: BoardFactoryArgs): GameRepositoryInterface {
    switch (type) {
      case BoardTypeEnum.classic:
        return new ClassicBoardRepository();

      case BoardTypeEnum.test:
        return new TestBoardRepository(customBoard! as BoardCustom);

      case BoardTypeEnum.review:
        return new ReviewBoardRepository(historyMoves!);
    }
  }
}

export class BoardRepository {
  socket: SocketRepository;
  private status: BoardStatus;
  private board: Board;
  game: BoardGame;

  constructor() {
    this.socket = new SocketRepository();
    this.game = {
      move: 0,
      history: {
        notation: [],
        moves: [],
      },
      turn: PieceColorTypeEnum.white,
      gameEnd: false,
      type: BoardTypeEnum.classic,
    };
    this.board = this.createEmptyBoard();
    this.status = {
      check: { pos: null, status: false },
      mate: { pos: null, status: false },
    };
  }

  /**
   * Generate an empty 8x8 board
   */
  protected createEmptyBoard(): Board {
    return Array.from({ length: 8 }, (_, x) =>
      Array.from({ length: 8 }, (_, y) => {
        return {
          piece: {
            pos: [x, y],
            type: PieceTypeEnum.empty,
          },
        };
      })
    );
  }

  /**
   * Initializes a new game.
   * @param {Object} [args] Optional (used in testing)
   */
  startGame(_: StartGameArgs): void {
    this.board = this.initBoard();
  }

  /**
   * Ends the game and restart values
   */
  protected endGame() {
    this.status.mate.status = true;
    this.game = {
      move: 0,
      type: this.game.type,
      history: this.game.history,
      turn: PieceColorTypeEnum.white,
      gameEnd: true,
    };
  }

  /**
   * Creates the board
   * @returns {Board} board
   */
  protected initBoard(): Board {
    const board = this.getBoard("all");
    const pieces = CONSTANTS.BOARD.INIT;
    const pawns = CONSTANTS.BOARD.PAWNS;

    const create = ({ row, pieces, color }: { row: number; pieces: PieceTypeEnum[]; color: PieceColorTypeEnum }) => {
      return pieces.map((type: PieceTypeEnum, i) => (this.board[row][i] = this.createPiece({ pos: [row, i], type, color })));
    };

    board[0] = create({ row: 0, pieces, color: PieceColorTypeEnum.black });
    board[1] = create({ row: 1, pieces: pawns, color: PieceColorTypeEnum.black });
    board[6] = create({ row: 6, pieces: pawns, color: PieceColorTypeEnum.white });
    board[7] = create({ row: 7, pieces, color: PieceColorTypeEnum.white });
    return this.board;
  }

  /**
   * Obtains the entire movement history
   */
  getHistory(): string {
    return this.game.history.notation.join("|");
  }

  /**
   * Gets the board and returns it formatted by the object or normal
   */
  getBoard(type: GetBoardArgs): Board | BoardPiece {
    if (type === "all") {
      return this.board as Board;
    }

    const boardPiece = this.board.map((arr) => arr.map((item) => item.piece));
    return boardPiece as BoardPiece;
  }

  /**
   * Obtains the oppossite color of the current turn
   */
  protected getOppositeColor() {
    return this.getColor() === PieceColorTypeEnum.white ? PieceColorTypeEnum.black : PieceColorTypeEnum.white;
  }

  /**
   * Obtains the current turn
   */
  protected getColor() {
    return this.game.turn;
  }

  /**
   * Obtains a piece and returns it filtered by the object or normal
   */
  protected getPiece({ pos, type = "obj" }: GetPieceArgs): number | Piece | PieceObj {
    const board = this.board;
    const piece = board[pos[0]][pos[1]];

    if (type === "obj") {
      return (piece as Piece).piece;
    }

    return piece as Piece;
  }

  /**
   * Maps the board and performs different operations
   */
  protected boardMapping({ arr, opts, type }: BoardMappingArgs) {
    const res: CoordWithGroupArray = [];

    for (const row of arr) {
      for (const item of row) {
        const pos = item.pos;
        const value = item.type;

        if (value == -1) continue;
        if (type == BoardMappingTypeEnum.findKing) {
          if (value === 5) {
            return pos;
          }
        }
        if (type == BoardMappingTypeEnum.findMovesPointingToKing) {
          const moves = this.getPossibleMoves({
            pos,
            isServer: true,
          });
          const isCheck =
            arrayFilter({
              arrays: {
                arr: moves,
                arrToFilter: opts.arr,
              },
              type: "oneArrayContain",
            }).length > 0;

          if (isCheck) {
            return pos;
          }
        }
        if (type == BoardMappingTypeEnum.getPieceMoves) {
          const moves = this.getPossibleMoves({
            pos,
            includeKing: value === PieceTypeEnum.king,
            simulateMode: false,
            isServer: true,
          });

          if (value === PieceTypeEnum.king) {
            const checkPiece = arrayFilter({
              arrays: {
                arr: moves,
                arrToFilter: opts!.checkPiece!.pos,
              },
              type: "oneArrayContain",
            });

            const filtered = arrayFilter({
              arrays: {
                arr: moves,
                arrToFilter: [...opts.arr, ...opts.movesToKing.secondary],
              },
              type: "twoArrayNotContain",
            });

            const result = checkPiece.length > 0 ? [...filtered, ...checkPiece] : filtered;

            if (result.length > 0) {
              res.push([pos, result.flat()]);
            }
          } else {
            const filtered = arrayFilter({
              arrays: {
                arr: moves,
                arrToFilter: opts.arr,
              },
              type: "twoArrayContain",
            });

            if (filtered.length > 0) {
              res.push([pos, filtered.flat()]);
            }
          }
        }
        if (type == BoardMappingTypeEnum.filterPieces) {
          if (pos[0] === opts.arr[0] && pos[1] === opts.arr[1]) return;

          const moves = this.getPossibleMoves({
            pos,
            includeKing: true,
            simulateMode: true,
            isServer: true,
          });
          const filtered = arrayFilter({
            arrays: {
              arr: moves,
              arrToFilter: [opts.arr],
            },
            type: "twoArrayContain",
          });
          if (filtered.length > 0) {
            return true;
          }
        }
        if (type == BoardMappingTypeEnum.removeMoves) {
          const moves = this.getPossibleMoves({
            pos,
            includeKing: true,
            simulateMode: true,
            isServer: true,
          });

          return arrayFilter({
            arrays: {
              arr: moves,
              arrToFilter: opts.arr,
            },
            type: "clearWithFilter",
          });
        }
        if (type == BoardMappingTypeEnum.all) {
          const moves = this.getPossibleMoves({ pos, isServer: true });
          res.push([pos, moves.flat()]);
        }
      }
    }

    return !!res.length ? res : false;
  }

  /**
   * Obtains the king and returns {position, surroundings, combination}
   */
  protected getKingPosition(color: PieceColorTypeEnum) {
    const findKing = this.boardMapping({
      arr: getBoardByColor({ color, board: this.getBoard() as BoardPiece }),
      type: BoardMappingTypeEnum.findKing,
    });
    const pos = findKing as Coord;
    const surroundings = getSurroundings({ pos, nRings: 1 });

    return {
      kingPos: pos,
      kingSurroundings: surroundings,
      kingAllPos: [...surroundings, pos],
    };
  }

  /**
   * Obtains the king moves and returns {direct: moves, secondary: moves}
   */
  protected getMovesToKing(args: PieceObj): GetMovesToKingResponse {
    const { pos, type, color } = args;
    const { kingPos } = this.getKingPosition(color!)!;
    const [startY, startX] = pos;
    const directions = CONSTANTS.PIECES.DIRECTIONS[type];

    const res = directionsMapping([startY, startX], directions, 8, ([y, x], internal) => {
      internal.push([y, x]);
      if (y === kingPos[0] && x === kingPos[1]) return "break";
      return "continue";
    });

    return {
      direct: arrayFilter({
        arrays: { arr: res, arrToFilter: [kingPos] },
        type: "twoArrayContain",
      }).flat(),
      secondary: arrayFilter({
        arrays: { arr: res, arrToFilter: [kingPos] },
        type: "twoArrayNotContain",
      }).flat(),
    };
  }

  /**
   * Creates a piece using PieceRepository
   */
  protected createPiece(opts: PieceObj) {
    return PieceFactory.create(opts);
  }

  /**
   * Obtains all moves of the piece and returns them
   */
  getPossibleMoves(args: GetPossibleMovesArgs): CoordGroupArray {
    const isServer = !!args.isServer;
    const mate = this.status.mate;
    if (mate.status) {
      return [];
    }

    const getPiece = this.getPiece({ pos: args.pos, type: "all" }) as Piece;
    if (getPiece.piece.color != this.getColor() && !isServer) return [];
    const getBoard = this.getBoard() as BoardPiece;
    const movesResponse = getPiece.checkPossibleMoves({
      board: getBoard,
      flags: { skipPinned: !!args.skipPinned, includeKing: !!args.includeKing, simulateMode: false, inCheck: this.status.check.status ? this.status.check : undefined },
    });

    const res = arrayFilter({
      type: "clear",
      arrays: {
        arr: movesResponse,
      },
    });
    return res;
  }

  /**
   * Moves the piece and makes updates in the game
   */
  async moveTo({ from, to, skipSpecificMove = false }: MoveToArgs): Promise<MoveToResponse> {
    if (this.status.check.status) {
      this.updateCheck();
    }

    const methods = (args: { type: GameStatusTypeEnum; pieceFrom: PieceObj; pieceTo: PieceObj }): MoveToResponse | void => {
      const { type, pieceTo, pieceFrom } = args;
      const [toY, toX] = pieceTo.pos;

      if (type == GameStatusTypeEnum.previewMove) {
        this.updateTurn();
        return;
      }

      if (this.game.type != BoardTypeEnum.review) {
        const inCheck = this.isInCheck();
        if (!inCheck) {
          const isDrowned = this.isDrowned();
          if (isDrowned) return;
        }
        this.updateHistory({
          piece: args.type === GameStatusTypeEnum.crowning ? pieceTo.type : pieceFrom.type,
          pieceCapture: args.type === GameStatusTypeEnum.crowning ? pieceFrom.type : pieceTo.type,
          move: `${BoardColumnTypeEnum[toX]}${8 - toY}`,
          type,
        });
        this.updateOpening();
      }

      this.updateTurn();
      this.socket.publish("UpdateGame", this.game);
    };

    const specificStatus = !skipSpecificMove ? await this.specificStatesInMoveTo({ from, to }) : false;
    if (!specificStatus) {
      const pieceFrom = this.getPiece({ pos: from, type: "all" }) as Piece;
      const pieceTo = this.getPiece({ pos: to }) as PieceObj;
      const pieceToExist = pieceTo.type != PieceTypeEnum.empty;
      const type = pieceToExist ? GameStatusTypeEnum.take : GameStatusTypeEnum.default;

      this.updateHistoryMoves({ from: pieceFrom.piece.pos, to: pieceTo.pos });

      const [fromY, fromX] = pieceFrom.piece.pos;
      const [toY, toX] = pieceTo.pos;
      this.board[fromY][fromX] = { piece: { pos: [fromY, fromX], type: PieceTypeEnum.empty } };
      pieceFrom.piece.pos = [toY, toX];

      if (pieceToExist) {
        this.board[toY][toX] = { piece: { pos: [toY, toX], type: PieceTypeEnum.empty } };
      }
      this.board[toY][toX] = pieceFrom;

      methods({ type, pieceFrom: pieceFrom.piece, pieceTo });
      return {
        type,
        from,
        to,
        piece: pieceFrom.piece,
      };
    }

    const pieceFrom = this.getPiece({
      pos: specificStatus.type === GameStatusTypeEnum.crowning ? (specificStatus.from as Coord) : (specificStatus.from[1] as Coord),
    }) as PieceObj;
    const pieceTo = this.getPiece({
      pos: specificStatus.type === GameStatusTypeEnum.crowning ? (specificStatus.to as Coord) : (specificStatus.to[1] as Coord),
    }) as PieceObj;

    methods({ type: specificStatus.type, pieceFrom, pieceTo });
    return specificStatus;
  }

  /**
   * Used in MoveTo() and covers specific moves
   */
  protected async specificStatesInMoveTo({ from, to }: MoveToArgs): Promise<MoveToResponse | null> {
    const pieceFrom = this.getPiece({ pos: from, type: "all" }) as Piece;
    const pieceTo = this.getPiece({ pos: to, type: "all" }) as Piece;
    const board = this.getBoard("all") as Board;
    const [fromY, fromX] = pieceFrom.piece.pos;
    const [toY, toX] = pieceTo.piece.pos;

    const emptyObj = (pos: Coord) => {
      return { piece: { pos, type: PieceTypeEnum.empty } };
    };

    const castlingPiecesCond = pieceFrom.piece.type == PieceTypeEnum.king && pieceTo.piece.type == PieceTypeEnum.rook && (fromY === 0 || fromY === 7);
    const kingOrRookCond = pieceFrom.piece.type === PieceTypeEnum.king || (pieceFrom.piece.type === PieceTypeEnum.rook && (fromY === 0 || fromY === 7));
    const crowningCond = pieceFrom.piece.type == PieceTypeEnum.pawn && (pieceTo.piece.pos[0] === 0 || pieceTo.piece.pos[0] === 7);

    //castling
    if (castlingPiecesCond) {
      const castlingType = toX === 7 ? CastlingTypeEnum.short : CastlingTypeEnum.large;
      const fromX1 = castlingType == CastlingTypeEnum.short ? fromX + 2 : fromX - 2;
      const toX1 = castlingType == CastlingTypeEnum.short ? toX - 2 : toX + 3;
      const type = castlingType == CastlingTypeEnum.short ? GameStatusTypeEnum.castlingShort : GameStatusTypeEnum.castlingLarge;

      this.updateHistoryMoves({ from: pieceFrom.piece.pos, to: pieceTo.piece.pos });
      pieceTo.piece.pos = [toY, toX1];
      pieceFrom.piece.pos = [fromY, fromX1];
      pieceFrom.piece.castledAllowed = {
        large: false,
        short: false,
      };
      board[fromY][fromX] = emptyObj([fromY, fromX]);
      board[toY][toX] = emptyObj([toY, toX]);
      board[fromY][fromX1] = pieceFrom;
      board[toY][toX1] = pieceTo;

      return {
        type,
        from: [
          [fromY, fromX],
          [fromY, fromX1],
        ] as CoordGroup,
        to: [
          [toY, toX],
          [toY, toX1],
        ] as CoordGroup,
        piece: pieceFrom.piece,
      };
    }
    //king moved or rook
    if (kingOrRookCond) {
      if (pieceFrom.piece.type === PieceTypeEnum.king) {
        board.map((row) =>
          row.map((piece) => {
            if (piece.piece.type === PieceTypeEnum.empty) return;

            (piece as Piece).clearPinned();
          })
        );
        pieceFrom.piece.castledAllowed = {
          large: false,
          short: false,
        };
        return null;
      }
      if (fromX != 7 && fromX != 0) return null;

      const castlingType = fromX === 7 ? CastlingTypeEnum.short : CastlingTypeEnum.large;
      const kingMoved = !pieceFrom.piece.castledAllowed![castlingType];
      if (kingMoved) return null;

      const { kingPos } = this.getKingPosition(this.getColor());
      const getKing = this.getPiece({ pos: kingPos }) as PieceObj;
      getKing.castledAllowed![castlingType] = false;
    }
    //crowning
    if (crowningCond) {
      let newPiece: Piece | null = null;

      this.socket.publish("Server_Crowning", true);
      await this.socket.once("Client_Crowning", (pieceType) => {
        const piece = this.createPiece({ pos: [toY, toX], type: pieceType, color: this.getColor() });

        newPiece = piece;
      });
      this.updateHistoryMoves({ from: pieceFrom.piece.pos, to: pieceTo.piece.pos });
      board[fromY][fromX] = emptyObj([fromY, fromX]);
      board[toY][toX] = newPiece!;

      return {
        type: GameStatusTypeEnum.crowning,
        from,
        to,
        piece: newPiece!.piece,
      };
    }

    return null;
  }

  /**
   * Checks if the next player is in check
   */
  protected isInCheck(): boolean {
    const color = this.getColor();
    const opponentColor = this.getOppositeColor();
    const allPieces = getBoardByColor({ color, board: this.getBoard() as BoardPiece });
    const allOpponentPieces = getBoardByColor({ color: opponentColor, board: this.getBoard() as BoardPiece });
    const { kingPos } = this.getKingPosition(opponentColor);

    const turnMapping = this.boardMapping({
      arr: allPieces,
      type: BoardMappingTypeEnum.findMovesPointingToKing,
      opts: {
        arr: kingPos,
      },
    }) as Coord;
    if (!turnMapping) return false;

    const values = this.getPiece({
      pos: turnMapping,
    }) as PieceObj;
    this.simulateMoves({
      pieceArg: values,
      allPieces: allPieces,
      allOpponentPieces: allOpponentPieces,
    });
    return true;
  }

  /**
   * Checks if it is a drowned position and makes updates in the game
   */
  protected isDrowned(): boolean {
    const res = this.boardMapping({
      type: BoardMappingTypeEnum.all,
      arr: getBoardByColor({ board: this.getBoard() as BoardPiece }),
    }) as CoordWithGroupArray;
    const filtered = res.map((group) => group[1]).flat();
    if (filtered.length > 0) return false;

    this.updateHistory({ type: GameStatusTypeEnum.kingDrowned });
    this.endGame();
    return true;
  }

  /**
   * Simulates all moves of the pieces by color and makes updates in the game
   */
  protected simulateMoves({ pieceArg, allPieces, allOpponentPieces }: { pieceArg: PieceObj; allPieces: BoardPiece; allOpponentPieces: BoardPiece }) {
    const opponentColor = this.getOppositeColor();
    const piece = pieceArg as PieceObj;
    const { kingPos, kingSurroundings } = this.getKingPosition(opponentColor);
    const movesToKing = this.getMovesToKing({
      ...piece,
      color: opponentColor,
    });

    movesToKing.direct.push(piece.pos);
    const mapping = this.boardMapping({
      arr: allOpponentPieces,
      type: BoardMappingTypeEnum.getPieceMoves,
      opts: {
        arr: [...movesToKing.direct, piece.pos],
        checkPiece: {
          ...piece,
        },
        movesToKing,
      },
    });

    if (!mapping) {
      this.endGame();
      return;
    }

    let arr = mapping as CoordWithGroupArray;
    const arr2 = kingSurroundings as CoordGroup;

    const movesNotProtected = arr2
      .map((group: Coord) => {
        const exist = this.boardMapping({
          type: BoardMappingTypeEnum.filterPieces,
          arr: allPieces,
          opts: { arr: group },
        });
        return [group.flat(), !!exist];
      })
      .filter((group) => group[1] === false)
      .map((group) => group[0]) as CoordGroup;

    arr = arr.map(([[y, x], moves]) => {
      if (y == kingPos[0] && x == kingPos[1]) {
        return [[y, x], movesNotProtected];
      }

      return [[y, x], moves];
    }) as CoordWithGroupArray;

    if (arr.filter((group) => group[1].length != 0).length == 0) {
      this.endGame();
      return;
    }

    this.updateCheck({
      moves: movesToKing.direct,
      pos: pieceArg.pos,
    });
  }

  /**
   * Adds the move to the history moves
   */
  protected updateHistoryMoves({ from, to }: { from: Coord; to: Coord }) {
    if (this.game.type != BoardTypeEnum.review) {
      this.game.history.moves.push([from, to]);
    }
  }

  /**
   * Adds the move in notation
   */
  protected updateHistory(args: UpdateHistoryArgs) {
    if (args.type == GameStatusTypeEnum.kingDrowned) {
      this.game.history.notation[this.game.move] = "½–½";
      return;
    }
    let value = "";
    const { type, move, piece, pieceCapture } = args;
    const isCapture = pieceCapture !== -1;
    const check = this.status.check.status;
    const mate = this.status.mate.status;
    const crowning = type === GameStatusTypeEnum.crowning;
    const castling = type === GameStatusTypeEnum.castlingShort || type === GameStatusTypeEnum.castlingLarge;
    const pieceSymbol = getPieceNotation(piece!);

    if (piece === PieceTypeEnum.pawn && isCapture) {
      const originFile = move![0];
      value += `${originFile}x${move}`;
    } else {
      value += `${pieceSymbol}${isCapture ? "x" : ""}${move}`;
    }

    if (mate) value += "#";
    else if (check) value += "+";
    else if (castling) value = type === GameStatusTypeEnum.castlingLarge ? "O-O-O" : "O-O";
    else if (crowning) value = `${move}=${pieceSymbol}`;

    const current = this.game.history.notation[this.game.move];
    if (!current) {
      this.game.history.notation.push(value);
    } else {
      this.game.history.notation[this.game.move] += `|${value}`;
      this.game.move++;
    }
  }

  /**
   * Updates the opening according to the latest movement
   */
  protected updateOpening() {
    const list = CONSTANTS.OPENINGS;
    const curr = this.game.history.notation.join("|");

    for (const [key, value] of Object.entries(list)) {
      if (curr != key) continue;

      this.game.opening = value;
      break;
    }
  }

  /**
   * Updates to the next player
   */
  protected updateTurn() {
    const condition = this.game.turn == PieceColorTypeEnum.white ? PieceColorTypeEnum.black : PieceColorTypeEnum.white;
    this.game.turn = condition;
  }

  /**
   * Updates or resets check values
   */
  protected updateCheck(args?: BoardEachStatus) {
    if (args) {
      this.status.check = {
        status: !this.status.check.status,
        moves: args.moves,
        type: args.type,
        pos: args.pos,
      };
      return;
    }

    this.status.check = {
      status: !this.status.check.status,
      moves: [],
      type: null,
      pos: null,
    };
  }
}

class ClassicBoardRepository extends BoardRepository {
  constructor() {
    super();
  }
}

class TestBoardRepository extends BoardRepository {
  customBoard: BoardCustom;

  constructor(customBoard: BoardCustom) {
    super();
    this.customBoard = customBoard;
    this.game.type = BoardTypeEnum.test;
  }

  override initBoard(): Board {
    const board = this.getBoard("all") as Board;
    const { black, white } = this.customBoard;

    const setBoard = (customBoard: BoardCustomValues, color: PieceColorTypeEnum) => {
      customBoard.forEach(([pos, type]) => {
        const [y, x] = pos;
        const newItem = this.createPiece({ pos, type, color });
        board[y][x] = newItem;
      });
    };

    setBoard(black, PieceColorTypeEnum.black);
    setBoard(white, PieceColorTypeEnum.white);
    return board;
  }

  startGame(args: { playerStart?: PieceColorTypeEnum; move?: FromTo } | void): void {
    super.startGame(args);

    if (args?.playerStart) {
      const { move } = args;
      this.updateTurn();

      if (args?.move) {
        this.moveTo({ from: move!.from, to: move!.to, skipSpecificMove: true });
      }
    }
  }
}

class ReviewBoardRepository extends BoardRepository implements ReviewBoardRepositoryInterface {
  constructor(moves: CoordGroupArray) {
    super();
    this.game.history.moves = moves;
    this.game.type = BoardTypeEnum.review;
  }

  getCoord(type: GameMoveType): CoordGroup {
    const moves = this.game.history.moves;
    let moveIndex = this.game.move;

    if (moveIndex >= moves.length) {
      if (type == GameMoveType.next) return [];
      moveIndex--;
    } else if (moveIndex == -1) {
      if (type == GameMoveType.prev) return [];
      moveIndex++;
    }

    const curr = moves[moveIndex];
    const res = type === GameMoveType.prev ? [curr[1], curr[0]] : [curr[0], curr[1]];
    if (type === GameMoveType.prev) moveIndex--;
    if (type === GameMoveType.next) moveIndex++;
    this.game.move = moveIndex;

    return res;
  }

  override getPossibleMoves(): CoordGroupArray {
    return [];
  }
}
