import { MOCKS } from "@/mocks";
import { utils } from "@/utils/test/utils";
import "@testing-library/jest-dom";

describe("castling tests", () => {
  for (const mock of MOCKS.castling) {
    it(mock.name!, async () => {
      const { testType, board, moves, response, piecePos, initOpts } = mock;
      const { startGame, getPossibleMoves, movePieceMapping, getHistory } =
        utils();
      startGame(initOpts ? { ...initOpts, board } : { board });

      switch (testType) {
        case "possibleMovesAndHistory": {
          expect(getHistory()).toBe(response!.history);
          expect(getPossibleMoves(piecePos!).toString()).toBe(
            response!.possibleMoves!.toString()
          );
          break;
        }

        case "all": {
          await movePieceMapping(moves!);
          expect(getHistory()).toBe(response!.history);
          expect(getPossibleMoves(piecePos!).toString()).toBe(
            response!.possibleMoves!.toString()
          );
          break;
        }

        case "getPossibleMoves": {
          expect(getPossibleMoves(piecePos!).toString()).toBe(
            response!.possibleMoves!.toString()
          );
          break;
        }

        default: {
          await movePieceMapping(moves!);
          expect(getHistory()).toBe(response!.history);
        }
      }
    });
  }
});
