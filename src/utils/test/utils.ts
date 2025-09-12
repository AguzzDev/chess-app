import {
  BoardTypeEnum,
  Coord,
  CoordGroup,
  CoordGroupArray,
  CustomBoard,
  FromTo,
  PieceColorTypeEnum,
} from "@/interfaces";
import { BoardFactory, BoardRepository } from "@/services/game/BoardRepository";

export const utils = () => {
  let game: BoardRepository;
  const possibleMoves: CoordGroupArray = [];

  const startGame = ({
    board,
    playerStart,
    move,
  }: {
    board: CustomBoard;
    playerStart?: PieceColorTypeEnum;
    move?: FromTo;
  }) => {
    game = BoardFactory.create({
      type: BoardTypeEnum.test,
      customBoard: board,
    });
    game.startGame({ playerStart, move });
  };

  const movePiece = async ({ from, to }: FromTo) => {
    await game.moveTo({ from, to });
  };

  const getPossibleMoves = (pos: Coord) => {
    return game.getPossibleMoves({ pos, isServer: false });
  };

  const movePieceMapping = async (moves: CoordGroupArray) => {
    for (const [from, to] of moves) {
      const possible = game
        .getPossibleMoves({ pos: [from[0], from[1]] })
        .flat() as CoordGroup;

      possibleMoves.push(possible);

      await game.moveTo({
        to,
        from,
      });
    }
  };

  const getAllPossiblesMoves = () => {
    return possibleMoves;
  };

  const getHistory = () => {
    return game.getHistory();
  };

  const getBoard = () => {
    return game.getBoard();
  };

  return {
    startGame,
    getPossibleMoves,
    getBoard,
    movePiece,
    movePieceMapping,
    getAllPossiblesMoves,
    getHistory,
  };
};
