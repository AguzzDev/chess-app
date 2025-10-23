import { CONSTANTS } from "@/constants";
import {
  BoardPiece,
  BoardTypeEnum,
  Cache,
  Children,
  Coord,
  GameMoveType,
  GameStatusTypeEnum,
  GetPossibleMovesClientArgs,
  MoveToClientArgs,
  PieceObj,
  PieceTypeEnum,
  UpdatePiecePosition,
} from "@/interfaces";
import { MOCKS } from "@/mocks";
import { BoardRepository, BoardFactory } from "@/services/game/BoardRepository";
import { loadModels } from "@/utils/loadModels";
import { sleep } from "@/utils/sleep";
import { createContext, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";

interface Context {
  game: BoardRepository["game"];
  board: BoardPiece | null;
  loading: boolean;
  cache: Cache;
  camera: {
    position: [x: number, z: number, y: number];
    freeCam: boolean;
    resetCam: boolean;
  };
  modal: boolean;
  previewMoves: number[][];
  updatePiecePosition: UpdatePiecePosition | null;
  deletePiecePosition: { item: Coord; skip: boolean } | undefined;
  getPossibleMoves: (args: GetPossibleMovesClientArgs) => void;
  moveTo: (args: MoveToClientArgs) => void;
  clearAll: () => void;
  toogleFreeCamera: () => void;
  toogleResetCamera: () => void;
  updatePiece: (pieceType: PieceTypeEnum) => void;
  restartGame: () => void;
  reviewGame: () => void;
  reviewMove: (type: GameMoveType) => void;
  clearDeletePosition: () => void;
}

const GameContext = createContext<Context>({} as Context);

const GameProvider = ({ children }: { children: Children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState(() =>
    BoardFactory.create({
      type: BoardTypeEnum.classic,
    })
  );
  const [board, setBoard] = useState<Context["board"]>(null);
  const [previewMoves, setPreviewMoves] = useState<Context["previewMoves"]>([]);
  const [updatePiecePosition, setUpdatePiecePosition] = useState<Context["updatePiecePosition"]>(null);
  const [deletePiecePosition, setDeletePiecePosition] = useState<Context["deletePiecePosition"]>();
  const [camera, setCamera] = useState<Context["camera"]>({
    position: CONSTANTS.CAMERA_POSITION,
    freeCam: false,
    resetCam: false,
  });
  const [modal, setModal] = useState<boolean>(false);

  const cache: RefObject<Context["cache"] | null> = useRef(null);
  const pieceActiveRef = useRef<PieceObj | null>(null);

  const toogleFreeCamera = () => {
    setCamera((prev) => ({ ...prev, freeCam: !prev.freeCam }));
  };

  const toogleResetCamera = () => {
    setCamera((prev) => ({
      ...prev,
      freeCam: !prev.freeCam,
      resetCam: !prev.resetCam,
    }));
  };

  const getPossibleMoves = (args: GetPossibleMovesClientArgs) => {
    if (game!.game!.turn != args.color) return;

    const moves = game!.getPossibleMoves({ pos: args.pos }).flat();
    pieceActiveRef.current = args;
    setPreviewMoves(moves);
  };

  const moveTo = async ({ from: fromArg, to: toArg, type: typeArg }: MoveToClientArgs) => {
    const res = {} as { z?: number; x?: number };
    const resReversed = {} as { z?: number; x?: number };

    const piece = pieceActiveRef.current!;
    if (!piece) return;

    const [fromY, fromX] = piece.pos;
    const [toY, toX] = toArg;
    const moveY = toY - fromY;
    const moveX = toX - fromX;
    const {
      from,
      to,
      type,
      piece: pieceType,
    } = await game!.moveTo({
      from: fromArg || piece.pos,
      to: toArg,
      type: typeArg,
    });

    res.z = moveY * CONSTANTS.BOX_MOVE;
    res.x = moveX * CONSTANTS.BOX_MOVE;
    resReversed.z = -res.z;
    resReversed.x = -res.x;

    if (type == GameStatusTypeEnum.castlingLarge || type === GameStatusTypeEnum.castlingShort) {
      setUpdatePiecePosition({
        from: from[0] as Coord,
        to: from[1] as Coord,
        move: res,
      });
      await sleep(200);
      setUpdatePiecePosition({
        from: to[0] as Coord,
        to: to[1] as Coord,
        move: resReversed,
      });
    } else {
      if (type === GameStatusTypeEnum.take) {
        setDeletePiecePosition({ item: to as Coord, skip: true });
        await sleep(200);
      }

      setDeletePiecePosition({ item: from as Coord, skip: false });
      await sleep(200);
      setUpdatePiecePosition({
        from: from as Coord,
        to: to as Coord,
        move: res,
      });
    }

    clearAll();
  };

  const updatePiece = (pieceType: PieceTypeEnum) => {
    setModal(false);
    game!.socket.publish("Client_Crowning", pieceType);
  };

  const clearDeletePosition = () => {
    setDeletePiecePosition(undefined);
  };

  const clearPreviewMoves = () => {
    setPreviewMoves([]);
  };

  const clearPieceActiveRef = () => {
    pieceActiveRef.current = null;
  };

  const clearAll = () => {
    clearPreviewMoves();
    clearPieceActiveRef();
  };

  const restartGame = () => {
    setGame(BoardFactory.create({ type: BoardTypeEnum.classic }));
  };

  const reviewGame = () => {
    setGame(
      BoardFactory.create({
        type: BoardTypeEnum.review,
        historyMoves: game!.game!.history.moves,
      })
    );
  };

  const reviewMove = (type: GameMoveType) => {
    const res = game!.getCoord!(type);
    if (!res) return;

    moveTo({
      from: res[0],
      to: res[1],
      type: GameStatusTypeEnum.previewMove,
    });
  };

  const memoValues = useMemo(
    () => ({
      board,
      setBoard,
    }),
    [board]
  );

  useEffect(() => {
    if (!game) return;

    const fn = async () => {
      setLoading(true);
      cache.current = await loadModels();
      game.startGame({
        // playerStart: PieceColorTypeEnum.black,
        // move: { from: [0, 6], to: [6, 6] },
      });
      const b = game.getBoard() as BoardPiece;
      setBoard(b);
      setLoading(false);
    };
    fn();
  }, [game]);

  useEffect(() => {
    if (loading) return;
    const socket = game!.socket;

    socket.once("Server_Crowning", async () => {
      setModal(true);
    });
  }, [game, loading]);

  return (
    <GameContext.Provider
      value={{
        game: game!.game,
        board: memoValues.board,
        loading,
        modal,
        cache: cache.current!,
        previewMoves,
        camera,
        updatePiecePosition,
        deletePiecePosition,
        clearDeletePosition,
        updatePiece,
        reviewGame,
        getPossibleMoves,
        moveTo,
        clearAll,
        toogleFreeCamera,
        toogleResetCamera,
        restartGame,
        reviewMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export default GameProvider;
