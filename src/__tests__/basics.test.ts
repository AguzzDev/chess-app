import { PieceTextTypeEnum } from "@/interfaces";
import { MOCKS } from "@/mocks";
import { utils } from "@/utils/test/utils";
import "@testing-library/jest-dom";

const test = (type: PieceTextTypeEnum) => {
  describe(type, () => {
    for (const mock of MOCKS.basics[type]) {
      it(mock.name!, async () => {
        const { testType, board, moves, response, piecePos, initOpts } = mock;
        const { startGame, getPossibleMoves, movePieceMapping, getHistory } = utils();
        startGame(initOpts ? { ...initOpts, board } : { board });

        switch (testType) {
          case "moveAndGetHistory": {
            await movePieceMapping(moves!);

            expect(getHistory().toString()).toBe(response!.history!.toString());
            break;
          }

          case "move": {
            await movePieceMapping(moves!);

            expect(getPossibleMoves(piecePos!).toString()).toBe(response!.possibleMoves!.toString());
            break;
          }

          default: {
            expect(getPossibleMoves(piecePos!).toString()).toBe(response!.possibleMoves!.toString());
            break;
          }
        }
      });
    }
  });
};

describe("basics moves tests", () => {
  test(PieceTextTypeEnum.pawn);
  test(PieceTextTypeEnum.bishop);
  test(PieceTextTypeEnum.horse);
  test(PieceTextTypeEnum.rook);
  test(PieceTextTypeEnum.queen);
});
