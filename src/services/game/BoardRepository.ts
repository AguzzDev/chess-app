import {
  Board,
  PieceTypeEnum,
  PieceColorTypeEnum,
  Boards,
  MoveToArgs,
  GetPossibleMovesArgs,
  BoardColumnTypeEnum,
  UpdateHistoryArgs,
  BoardGame,
  BoardStatus,
  PieceOpts,
  BoardMappingArgs,
  BoardMappingTypeEnum,
  CreatePieceArgs,
  BoardEachStatus,
  MoveToResponse,
  BoardTypeEnum,
  GetBoardResponse,
  GameStatusTypeEnum,
  CastlingTypeEnum,
  SetBoardArgs,
  CustomBoard,
  GetMovesToKingResponse,
  Coord,
  CoordWithGroupArray,
  CoordGroup,
  CoordGroupArray,
  FromTo,
  CustomBoardValues,
  GameMoveType,
} from "@/interfaces";
import { PieceFactory } from "./PiecesRepository";
import { CONSTANTS } from "@/constants";
import { getPieceNotation } from "./utils/getPieceNotation";
import { arrayFilter } from "./utils/arrayFilter";
import { SocketRepository } from "./SocketRepository";
import { getSurroundings } from "./utils/getSurroundings";
import { directionsMapping } from "./utils/directionsMapping";

interface BoardFactoryArgs {
  type: BoardTypeEnum;
  customBoard?: CustomBoard | Boards;
  historyMoves?: CoordGroupArray;
}

export class BoardFactory {
  static create({ type, customBoard, historyMoves }: BoardFactoryArgs) {
    switch (type) {
      case BoardTypeEnum.classic:
        return new ClassicBoardRepository();

      case BoardTypeEnum.test:
        return new TestBoardRepository(customBoard! as CustomBoard);

      case BoardTypeEnum.review:
        return new ReviewBoardRepository(historyMoves!);
    }
  }
}

export class BoardRepository {
  socket: SocketRepository;
  private status: BoardStatus;
  private boards: Boards;
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
    this.boards = {
      black: this.createEmptyBoard(),
      white: this.createEmptyBoard(),
      normal: this.createEmptyBoard(),
    };
    this.status = {
      check: { pos: null, status: false },
      mate: { pos: null, status: false },
    };
  }

  protected createEmptyBoard(): Board {
    return Array.from({ length: 8 }, () => Array(8).fill(-1)) as Board;
  }

  startGame(args: { playerStart?: PieceColorTypeEnum; move?: FromTo }): void {
    this.boards.normal = this.initBoard();
  }

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

  protected initBoard() {
    const boardWhite = this.boards.white;
    const boardBlack = this.boards.black;
    const boardNormal = this.boards.normal;
    const pieces = CONSTANTS.BOARD.INIT;
    const pawns = CONSTANTS.BOARD.PAWNS;

    boardNormal[0] = [...pieces];
    boardNormal[1] = [...pawns];
    boardNormal[6] = [...pawns];
    boardNormal[7] = [...pieces];
    boardWhite[6] = [...pawns];
    boardWhite[7] = [...pieces];
    boardBlack[0] = [...pieces];
    boardBlack[1] = [...pawns];

    return boardNormal;
  }

  getCoord(type: GameMoveType): CoordGroup {
    const moves = this.game.history.moves;
    const curr =
      moves[type === GameMoveType.prev ? this.game.move - 1 : this.game.move];

    if (!curr) {
      return [];
    }
    const color = this.getColor();
    this.game.history.notation = this.game.history.notation.slice(
      0,
      GameMoveType.prev ? moves.length - 1 : moves.length + 1
    );

    if (type === GameMoveType.prev) {
      if (this.game.move == moves.length) {
        this.updateTurn();
      }

      this.game.move--;
      return [curr[1], curr[0]];
    } else {
      if (this.game.move == 0 && color != PieceColorTypeEnum.white) {
        this.updateTurn();
      }

      this.game.move++;
      return [curr[0], curr[1]];
    }
  }

  getHistory() {
    return this.game.history.notation.join("|");
  }

  getBoards() {
    return this.boards;
  }

  getBoard(): GetBoardResponse {
    const board = this.boards.normal;
    const boardColor = board.map((arr, y) =>
      arr.map((value, x) => {
        if (value == -1) return -1;

        const piece = this.getPiece({ pos: [y, x] }) as PieceOpts;
        return piece.color;
      })
    );

    return {
      board,
      boardColor,
    };
  }

  protected getOppositeColor() {
    return this.getColor() === PieceColorTypeEnum.white
      ? PieceColorTypeEnum.black
      : PieceColorTypeEnum.white;
  }

  protected getColor() {
    return this.game.turn;
  }

  protected getPiece({
    pos,
    boardGlobal = false,
  }: {
    pos: Coord;
    boardGlobal?: boolean;
  }): PieceOpts | boolean {
    if (!boardGlobal) {
      const findInWhite = this.boards.white[pos[0]][pos[1]];
      const findInBlack = this.boards.black[pos[0]][pos[1]];

      return {
        pos,
        type: findInWhite != -1 ? findInWhite : findInBlack,
        color:
          findInWhite != -1
            ? PieceColorTypeEnum.white
            : PieceColorTypeEnum.black,
      };
    }

    const board = this.boards.normal[pos[0]][pos[1]];
    return board != -1;
  }

  protected boardMapping({ arr, opts, type }: BoardMappingArgs) {
    const res: CoordWithGroupArray = [];

    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        const pos = [y, x] as Coord;
        const value = arr[y][x];

        if (type == BoardMappingTypeEnum.findKing) {
          if (arr[y][x] === 5) {
            return pos;
          }
        }

        if (type == BoardMappingTypeEnum.findMovesPointingToKing) {
          if (value == -1) continue;

          const moves = this.getPossibleMoves({
            pos,
            includeKing: true,
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
          if (value == -1) continue;

          const moves = this.getPossibleMoves({
            pos,
            includeKing: value === PieceTypeEnum.king,
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

            const result =
              checkPiece.length > 0 ? [...filtered, ...checkPiece] : filtered;

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
          if (value == -1) continue;
          if (pos[0] === opts.arr[0] && pos[1] === opts.arr[1]) continue;

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
          if (value == -1) continue;

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
          if (value == -1) continue;
          const moves = this.getPossibleMoves({ pos, isServer: true });
          res.push([pos, moves.flat()]);
        }
      }
    }

    return res.length !== 0 ? res : false;
  }

  protected getAllPieces(color: PieceColorTypeEnum) {
    return this.boards[color];
  }

  protected getKingPosition(color: PieceColorTypeEnum) {
    const findKing = this.boardMapping({
      arr: this.getAllPieces(color),
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

  protected getMovesToKing(args: PieceOpts): GetMovesToKingResponse {
    const { pos, type, color } = args;
    const { kingPos } = this.getKingPosition(color!)!;
    const [startY, startX] = pos;
    const directions = CONSTANTS.PIECES.DIRECTIONS[type];

    const res = directionsMapping(
      [startY, startX],
      directions,
      8,
      ([y, x], internal) => {
        internal.push([y, x]);
        if (y === kingPos[0] && x === kingPos[1]) return "break";
        return "continue";
      }
    );

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

  protected createPiece({
    opts,
    includeKing = false,
    simulateMode = false,
    inCheck = undefined,
    skipPinned = false,
  }: CreatePieceArgs) {
    return PieceFactory.create({
      opts,
      boards: this.boards,
      includeKing,
      simulateMode,
      inCheck,
      skipPinned,
    });
  }

  getPossibleMoves(args: GetPossibleMovesArgs): CoordGroupArray {
    const isServer = !!args.isServer;
    const mate = this.status.mate;
    if (mate.status) {
      return [];
    }

    const getPiece = this.getPiece({ pos: args.pos }) as PieceOpts;
    if (getPiece.color != this.getColor() && !isServer) return [];

    const piece = this.createPiece({
      opts: getPiece,
      includeKing: args.includeKing,
      simulateMode: args.simulateMode,
      inCheck: this.status.check.status ? this.status.check : undefined,
    });
    return arrayFilter({
      type: "clear",
      arrays: {
        arr: piece.checkPossibleMoves(),
      },
    });
  }

  async moveTo({ from, to, type }: MoveToArgs): Promise<MoveToResponse> {
    if (this.status.check.status) {
      this.updateCheck();
    }

    const methods = (
      typeArg: GameStatusTypeEnum,
      fromArg: number,
      toArg: number
    ) => {
      if (type == GameStatusTypeEnum.previewMove) {
        this.updateTurn();
        return;
      }

      const inCheck = this.isInCheck();
      if (!inCheck) {
        const isDrowned = this.isDrowned();
        if (isDrowned) return;
      }

      this.updateHistory({
        piece: fromArg,
        pieceCapture: toArg,
        move: `${BoardColumnTypeEnum[toX]}${8 - toY}`,
        type: typeArg,
      });
      this.game.history.moves.push([from, to]);
      this.updateOpening();
      this.updateTurn();
      this.socket.publish("UpdateGame", this.game);
    };

    const color = this.getColor();
    const [fromY, fromX] = from;
    const [toY, toX] = to;

    const specificStatus = await this.specificStatesInMoveTo({ from, to });
    if (!specificStatus) {
      const pieceFrom = this.getPiece({ pos: from }) as PieceOpts;
      const pieceTo = this.getPiece({ pos: to }) as PieceOpts;

      this.boards.normal[fromY][fromX] = -1;
      this.boards.normal[toY][toX] = pieceFrom.type;
      this.boards[color][fromY][fromX] = -1;
      this.boards[color][toY][toX] = pieceFrom.type;

      const existPiece = pieceTo.type !== (-1 as number);
      if (existPiece) {
        this.boards[this.getOppositeColor()][to[0]][to[1]] = -1;
      }

      const type = existPiece
        ? GameStatusTypeEnum.take
        : GameStatusTypeEnum.default;

      methods(type, pieceFrom.type, pieceTo.type);
      return {
        type,
        from: pieceFrom.pos,
        to: pieceTo.pos,
        pieceType: pieceFrom.type,
      };
    }

    const pieceTo = this.getPiece({
      pos:
        specificStatus.type === GameStatusTypeEnum.crowning
          ? (specificStatus.to as Coord)
          : (specificStatus.to[1] as Coord),
    }) as PieceOpts;
    methods(specificStatus.type, pieceTo.type, pieceTo.type);
    return specificStatus;
  }

  protected async specificStatesInMoveTo({
    from,
    to,
  }: MoveToArgs): Promise<MoveToResponse | null> {
    const pieceFrom = this.getPiece({ pos: from }) as PieceOpts;
    const pieceTo = this.getPiece({ pos: to }) as PieceOpts;
    const color = this.getColor();

    //king moved
    if (pieceFrom.type === PieceTypeEnum.king) {
      pieceFrom.castledAllowed = false;
    }
    //castling
    if (
      pieceFrom.type == PieceTypeEnum.king &&
      pieceTo.type == PieceTypeEnum.rook
    ) {
      const [fromY, fromX] = pieceFrom.pos;
      const [toY, toX] = pieceTo.pos;
      const castlingType =
        toX === 7 ? CastlingTypeEnum.short : CastlingTypeEnum.large;

      const fromX1 =
        castlingType == CastlingTypeEnum.short ? fromX + 2 : fromX - 2;
      const toX1 = castlingType == CastlingTypeEnum.short ? toX - 2 : toX + 3;

      const updateBoard = (board: Board) => {
        board[fromY][fromX] = -1;
        board[toY][toX] = -1;
        board[fromY][fromX1] = pieceFrom.type;
        board[toY][toX1] = pieceTo.type;
      };

      updateBoard(this.boards[color]);
      updateBoard(this.boards.normal);

      const type =
        castlingType == CastlingTypeEnum.short
          ? GameStatusTypeEnum.castlingShort
          : GameStatusTypeEnum.castlingLarge;

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
        pieceType: pieceFrom.type,
      };
    }
    //crowning
    if (
      pieceFrom.type == PieceTypeEnum.pawn &&
      (pieceTo.pos[0] === 0 || pieceTo.pos[0] === 7)
    ) {
      let pieceType = null;

      this.socket.publish("Server_Crowning", true);
      await this.socket.once("Client_Crowning", (newPos) => {
        const updateBoard = (board: Board) => {
          board[from[0]][from[1]] = -1;
          board[to[0]][to[1]] = newPos;
        };

        updateBoard(this.boards[color]);
        updateBoard(this.boards.normal);

        const existPiece = pieceTo.type !== (-1 as number);
        if (existPiece) {
          this.boards[this.getOppositeColor()][to[0]][to[1]] = -1;
        }

        pieceType = newPos;
      });

      return {
        type: GameStatusTypeEnum.crowning,
        from,
        to,
        pieceType: pieceType!,
      };
    }

    return null;
  }

  protected isDrowned(): boolean {
    const opponentColor = this.getOppositeColor();
    const allPieces = this.boards[opponentColor];

    const res = this.boardMapping({
      type: BoardMappingTypeEnum.all,
      arr: allPieces,
    }) as CoordWithGroupArray;
    const filtered = res.map((group) => group[1]).flat();
    if (filtered.length > 0) return false;

    this.updateHistory({ type: GameStatusTypeEnum.kingDrowned });
    this.endGame();
    return true;
  }

  protected isInCheck(): boolean {
    const color = this.getColor();
    const opponentColor = this.getOppositeColor();
    const allPieces = this.getAllPieces(color);
    const allOpponentPieces = this.getAllPieces(opponentColor);
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
    }) as PieceOpts;
    this.simulateMoves({
      pieceArg: values,
      allPieces: allPieces,
      allOpponentPieces: allOpponentPieces,
    });
    return true;
  }

  protected simulateMoves({
    pieceArg,
    allPieces,
    allOpponentPieces,
  }: {
    pieceArg: PieceOpts;
    allPieces: Board;
    allOpponentPieces: Board;
  }) {
    const opponentColor = this.getOppositeColor();
    const piece = pieceArg as PieceOpts;
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

  protected updateHistory(args: UpdateHistoryArgs) {
    if (args.type == GameStatusTypeEnum.kingDrowned) {
      this.game.history.notation[this.game.move] = "½–½";
      return;
    }

    const { move, piece, pieceCapture } = args;
    const isCapture = pieceCapture !== -1;
    const pieceSymbol = getPieceNotation(piece!);
    const check = this.status.check.status;
    const mate = this.status.mate.status;
    const type = args.type;
    const castling =
      type === GameStatusTypeEnum.castlingShort ||
      type === GameStatusTypeEnum.castlingLarge;

    let value = "";

    if (piece === PieceTypeEnum.pawn && isCapture) {
      const originFile = move![0];
      value += `${originFile}x${move}`;
    } else {
      value += `${pieceSymbol}${isCapture ? "x" : ""}${move}`;
    }

    if (mate) value += "#";
    else if (check) value += "+";
    else if (castling) {
      value = type === GameStatusTypeEnum.castlingLarge ? "O-O-O" : "O-O";
    }

    const current = this.game.history.notation[this.game.move];
    if (!current) {
      this.game.history.notation.push(value);
    } else {
      this.game.history.notation[this.game.move] += `|${value}`;
      this.game.move++;
    }
  }

  protected updateOpening() {
    const list = CONSTANTS.OPENINGS;
    const curr = this.game.history.notation.join("|");
  
    for (const [key, value] of Object.entries(list)) {
      if (curr != key) continue;

      this.game.opening = value;
      break;
    }
  }

  protected updateTurn() {
    const condition =
      this.game.turn == PieceColorTypeEnum.white
        ? PieceColorTypeEnum.black
        : PieceColorTypeEnum.white;
    this.game.turn = condition;
  }

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
  customBoard: CustomBoard;

  constructor(customBoard: CustomBoard) {
    super();
    this.customBoard = customBoard;
    this.game.type = BoardTypeEnum.test;
  }

  override initBoard() {
    const boards = this.getBoards();
    const boardWhite = boards.white;
    const boardBlack = boards.black;
    const boardNormal = boards.normal;

    const whiteValues = this.customBoard.white;
    const blackValues = this.customBoard.black;

    const setBoard = ({ board, values }: SetBoardArgs) => {
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          const arr = values as CustomBoardValues;
          const match = arr.find(([[vy, vx]]) => vy === y && vx === x);

          if (match) {
            const [, piece] = match;
            board[y][x] = piece as PieceTypeEnum;
          }
        }
      }
    };

    setBoard({
      board: boardNormal,
      values: [...whiteValues, ...blackValues],
    });
    setBoard({ board: boardWhite, values: whiteValues });
    setBoard({ board: boardBlack, values: blackValues });

    return boardNormal;
  }

  startGame(args: { playerStart?: PieceColorTypeEnum; move?: FromTo }): void {
    super.startGame(args);

    if (args?.playerStart) {
      const { move } = args;
      this.updateTurn();

      if (args?.move) {
        this.moveTo({ from: move!.from, to: move!.to });
      }
    }
  }
}

class ReviewBoardRepository extends BoardRepository {
  constructor(moves: CoordGroupArray) {
    super();
    this.game.history.moves = moves;
    this.game.type = BoardTypeEnum.review;
  }

  override getPossibleMoves(): CoordGroupArray {
    return [];
  }
}
