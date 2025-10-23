import { BoardRepository } from "@/services/game/BoardRepository";
import { PieceBase } from "@/services/game/PiecesRepository";
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
  testType?: "default" | "getPossibleMoves" | "getAllPossibleMoves" | "move" | "moveAndGetHistory" | "all" | "possibleMovesAndHistory";
  piecePos?: Coord;
  board?: BoardCustom;
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
  board: BoardCustom;
}
export type Cache = Record<"/models/board.glb" | "/models/pieces2.glb", Group | undefined>;
export interface PieceProps {
  object: Object3D;
  opts: Omit<PieceObj, "pinned">;
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
export interface GameRepositoryInterface extends BoardRepository {
  getCoord?: (type: GameMoveType) => CoordGroup;
}
export interface ReviewBoardRepositoryInterface extends BoardRepository {
  getCoord: (type: GameMoveType) => CoordGroup;
}
export type Board = (Piece | { piece: PieceObj })[][];
export type BoardPiece = PieceObj[][];
export interface BoardCustom {
  black: BoardCustomValues;
  white: BoardCustomValues;
}
export type BoardCustomValues = [Coord, PieceTypeEnum][];
export type Coord = [number, number];
export type CoordGroup = Coord[];
export type CoordGroupArray = Coord[][];
export type CoordWithGroup = [Coord, CoordGroup];
export type CoordWithGroupArray = [Coord, CoordGroup][];
export interface BoardGame {
  move: number;
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
export type Piece = PieceBase;
export interface PieceObj {
  pos: Coord;
  type: PieceTypeEnum;
  color?: PieceColorTypeEnum;
  pinned?: boolean;
  castledAllowed?: {
    [CastlingTypeEnum.large]: boolean;
    [CastlingTypeEnum.short]: boolean;
  };
}
export interface PieceFlags {
  includeKing?: boolean;
  simulateMode?: boolean;
  isServer?: boolean;
  skipPinned?: boolean;
  inCheck?: BoardEachStatus;
  skipExtraPawnMove?: boolean;
}
//args
export type StartGameArgs = { playerStart?: PieceColorTypeEnum; move?: FromTo } | void;
export type GetBoardArgs = "all" | "obj" | void;
export interface GetPieceArgs {
  pos: Coord;
  type?: "all" | "obj";
}
export interface BoardFactoryArgs {
  type: BoardTypeEnum;
  customBoard?: BoardCustom;
  historyMoves?: CoordGroupArray;
}
export type BoardMappingArgs =
  | {
      type: BoardMappingTypeEnum.findKing;
      arr: BoardPiece;
      opts?: null;
    }
  | {
      type: BoardMappingTypeEnum.findMovesPointingToKing;
      arr: BoardPiece;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.filterPieces;
      arr: BoardPiece;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.removeMoves;
      arr: BoardPiece;
      opts: {
        arr: CoordGroup;
      };
    }
  | {
      type: BoardMappingTypeEnum.getPieceMoves;
      arr: BoardPiece;
      opts: {
        arr: CoordGroup;
        checkPiece: PieceObj;
        movesToKing: GetMovesToKingResponse;
      };
    }
  | {
      type: BoardMappingTypeEnum.checkIfPieceProtected;
      arr: BoardPiece;
      opts: {
        arr: Coord;
      };
    }
  | {
      type: BoardMappingTypeEnum.all;
      arr: BoardPiece;
      opts?: null;
    };
export interface CheckPossibleMovesPieceArgs {
  board: BoardPiece;
  flags: PieceFlags;
}
export interface UpdateHistoryArgs {
  piece?: PieceTypeEnum;
  pieceCapture?: PieceTypeEnum | number;
  move?: string;
  type: GameStatusTypeEnum;
}
export interface GetPossibleMovesArgs extends PieceFlags {
  pos: Coord;
}
export type PieceArgs = PieceObj;
export interface GetMovesArgs {
  directions: number[][];
  pos: Coord;
  steps?: number;
}
export interface MoveToArgs extends FromTo {
  color?: PieceColorTypeEnum;
  type?: GameStatusTypeEnum;
  skipSpecificMove?: boolean;
}
//responses
export interface GetMovesToKingResponse {
  direct: CoordGroup;
  secondary: CoordGroup;
}
export interface MoveToResponse {
  from: Coord | CoordGroup;
  to: Coord | CoordGroup;
  type: GameStatusTypeEnum;
  piece: PieceObj;
  updateBoard?: (board: Board) => void;
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
  "empty" = -1,
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
