import { MOCKS } from "@/mocks";
import { utils } from "@/utils/test/utils";
import "@testing-library/jest-dom";

const test = (type: "checks" | "mates") => {
  describe(type, () => {
    for (const mock of MOCKS.checksAndMates[type]) {
      it(mock.name!, async () => {
        const { board, response, piecePos, initOpts, testType, moves } = mock;
        const { startGame, getPossibleMoves, getHistory, movePieceMapping } =
          utils();
        await startGame(initOpts ? { ...initOpts, board } : { board });

        switch (testType) {
          case "all": {
            expect(getPossibleMoves(piecePos!).toString()).toBe(
              response!.possibleMoves!.toString()
            );
            await movePieceMapping(moves!);
            expect(getHistory()).toBe(response!.history);
            break;
          }

          default: {
            if (response?.possibleMoves) {
              expect(getPossibleMoves(piecePos!).toString()).toBe(
                response!.possibleMoves!.toString()
              );
            }
            expect(getHistory()).toBe(response!.history);
          }
        }
      });
    }
  });
};

describe("checksAndMates tests", () => {
  test("checks");
  test("mates");
});
