import { PieceTextTypeEnum } from "@/interfaces";
import { MOCKS } from "@/mocks";
import { utils } from "@/utils/test/utils";
import "@testing-library/jest-dom";

const test = (type: PieceTextTypeEnum) => {
  describe(type, () => {
    for (const mock of MOCKS.pinned[type]) {
      it(mock.name!, () => {
        const { board, response, piecePos, initOpts } = mock;
        const { startGame, getPossibleMoves } = utils();
        startGame(initOpts ? { ...initOpts, board } : { board });

        expect(getPossibleMoves(piecePos!).toString()).toBe(
          response!.possibleMoves!.toString()
        );
      });
    }
  });
};

describe("pinned tests", () => {
  test(PieceTextTypeEnum.pawn);
  test(PieceTextTypeEnum.bishop);
  test(PieceTextTypeEnum.horse);
  test(PieceTextTypeEnum.rook);
  test(PieceTextTypeEnum.queen);
});
