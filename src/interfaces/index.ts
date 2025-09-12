import { Group, Object3D } from "three";

//client
export interface Mock {
  castling: MockItemResponse[];
  basics: Record<PieceTextTypeEnum, MockItemResponse[]>;
  pinned: Record<PieceTextTypeEnum, MockItemResponse[]>;
  checksAndMates: {
    checks: MockItemResponse[];
    mates: MockItemResponse[];
  };
  crowning: MockItemResponse[];
}
export interface MockItem {
  name: string;
  testType?:
    | "default"
    | "getPossibleMoves"
    | "getAllPossibleMoves"
    | "move"
    | "all"
    | "possibleMovesAndHistory";
  piecePos?: Coord;
  board?: CustomBoard;
  moves?: CoordGroupArray;
  initOpts?: {
    playerStart?: PieceColorTypeEnum;
    move?: FromTo;
  };
  response?: {
    history?: string;
    lastPieceMoves?: string;
    possibleMoves?: CoordGroup;
  };
}
export interface MockItemResponse extends Omit<MockItem, "board"> {
  board: CustomBoard;
}
export type Cache = Record<
  "/models/board.glb" | "/models/pieces2.glb",
  Group | undefined
>;
export interface PieceProps {
  object: Object3D;
  opts: Omit<PieceOpts, "pinned">;
}
export type Children = React.ReactNode;
export type GetPossibleMovesClientArgs = PieceProps["opts"];
export interface UpdatePiecePosition extends FromTo {
  move?: { y?: number; x?: number };
}
export interface MoveToClientArgs {
  from?: Coord;
  to: Coord;
  type?: GameStatusTypeEnum;
}

//service
export type CustomBoardValues = [number[], PieceTypeEnum][];

export type Coord = [number, number];
export type CoordGroup = Coord[];
export type CoordGroupArray = Coord[][];
export type CoordWithGroup = [Coord, CoordGroup];
export type CoordWithGroupArray = [Coord, CoordGroup][];

export type Board = number[][];
export interface Boards {
  normal: Board;
  white: Board;
  black: Board;
}
export type BoardMappingArgs =
  | {
      type: BoardMappingTypeEnum.findKing;
      arr: Board;
      opts?: null;
    }
  | {
      type: BoardMappingTypeEnum.findMovesPointingToKing;
      arr: Board;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.filterPieces;
      arr: Board;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.removeMoves;
      arr: Board;
      opts: {
        arr: CoordGroup;
      };
    }
  | {
      type: BoardMappingTypeEnum.getPieceMoves;
      arr: Board;
      opts: {
        arr: CoordGroup;
        checkPiece: PieceOpts;
        movesToKing: GetMovesToKingResponse;
      };
    }
  | {
      type: BoardMappingTypeEnum.checkIfPieceProtected;
      arr: Board;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.all;
      arr: Board;
      opts?: null;
    };

export interface IsInCheckArgs {
  isOpponent?: boolean;
}
export interface CustomBoard {
  black: CustomBoardValues;
  white: CustomBoardValues;
}
export interface NormalBoardInterface {
  getBoard(): Board;
  getPossibleMoves(args: GetPossibleMovesArgs): CoordGroupArray;
  moveTo(args: MoveToArgs): MoveToResponse;
}
export interface ExerciseBoardInterface {
  initBoard(): Board;
}
export interface BoardGame {
  move: 0;
  type: BoardTypeEnum;
  opening?: string;
  history: {
    notation: string[];
    moves: CoordGroupArray;
  };
  turn: PieceColorTypeEnum;
  gameEnd: boolean;
}
export interface BoardStatus {
  check: BoardEachStatus;
  mate: BoardEachStatus;
}
export interface BoardEachStatus {
  pos: Coord | null;
  status?: boolean;
  moves?: CoordGroup;
  type?: "moveKing" | null;
}
export interface FromTo {
  from: Coord;
  to: Coord;
}
export interface Piece {
  piece: PieceArgs["opts"];
  boards: PieceArgs["boards"];
  checkPossibleMoves: () => CoordGroupArray;
}
export interface PieceOpts {
  pos: Coord;
  type: PieceTypeEnum;
  color?: PieceColorTypeEnum;
  pinned?: boolean;
  castledAllowed?: boolean;
}
export interface PieceStatus {
  includeKing?: boolean;
  simulateMode?: boolean;
  isServer?: boolean;
  skipPinned?: boolean;
  inCheck?: BoardEachStatus;
}
//args
export interface GetMovesToKingResponse {
  direct: CoordGroup;
  secondary: CoordGroup;
}
export interface GetBoardResponse {
  board: Board;
  boardColor: (-1 | PieceColorTypeEnum | undefined)[][];
}
export interface SetBoardArgs {
  board: Board;
  values: CustomBoardValues | Board;
}
export interface GetOnlyMovesToKing {
  from: Coord;
}
export interface UpdateHistoryArgs {
  piece?: PieceTypeEnum;
  pieceCapture?: PieceTypeEnum | number;
  move?: string;
  type: GameStatusTypeEnum;
}
export type CreatePieceArgs = Omit<PieceArgs, "boards">;
export interface GetPossibleMovesArgs extends PieceStatus {
  pos: Coord;
}
export type CheckPositionArgs = Omit<PieceOpts, "type">;
export interface PieceArgs extends PieceStatus {
  opts: PieceOpts;
  boards: Boards;
}
export interface GetMovesArgs {
  directions: number[][];
  pos: Coord;
  steps?: number;
}
export interface MoveToArgs extends FromTo {
  color?: PieceColorTypeEnum;
  type?: GameStatusTypeEnum;
}
export interface MoveToResponse {
  from: Coord | CoordGroup;
  to: Coord | CoordGroup;
  type: GameStatusTypeEnum;
  pieceType: PieceTypeEnum;
}
export interface SpecificStatesInPossibleMovesArgs {
  piece: PieceOpts;
  moves: CoordGroupArray;
  args?: PieceStatus;
}

//enums
export enum GameMoveType {
  "prev" = "prev",
  "curr" = "curr",
  "next" = "next",
}
export enum BoardColumnTypeEnum {
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
}
export enum PieceTypeEnum {
  "pawn",
  "horse",
  "bishop",
  "rook",
  "queen",
  "king",
}
export enum PieceTextTypeEnum {
  "pawn" = "pawn",
  "horse" = "horse",
  "bishop" = "bishop",
  "rook" = "rook",
  "queen" = "queen",
  "king" = "king",
}
export enum PieceColorTypeEnum {
  "black" = "black",
  "white" = "white",
}
export enum BoardMappingTypeEnum {
  "findKing" = "findKing",
  "findMovesPointingToKing" = "findMovesPointingToKing",
  "getPieceMoves" = "getPieceMoves",
  "getPieceMovesKingSurronding" = "getPieceMovesKingSurronding",
  "checkPos" = "checkPos",
  "filterPieces" = "filterPieces",
  "removeMoves" = "removeMoves",
  "checkIfPieceProtected" = "checkIfPieceProtected",
  "all" = "all",
}
export enum GameStatusTypeEnum {
  "default" = "default",
  "check" = "check",
  "take" = "take",
  "crowning" = "crowning",
  "castlingShort" = "castlingShort",
  "castlingLarge" = "castlingLarge",
  "kingDrowned" = "kingDrowned",
  "previewMove" = "previewMove",
}
export enum CastlingTypeEnum {
  "short" = "short",
  "large" = "large",
}
export enum BoardTypeEnum {
  "classic" = "classic",
  "test" = "test",
  "review" = "review",
}
