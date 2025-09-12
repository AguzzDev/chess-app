import { CONSTANTS } from "@/constants";
import {
  BoardTypeEnum,
  Cache,
  Children,
  Coord,
  GameMoveType,
  GameStatusTypeEnum,
  GetBoardResponse,
  GetPossibleMovesClientArgs,
  MoveToClientArgs,
  PieceOpts,
  PieceTypeEnum,
  UpdatePiecePosition,
} from "@/interfaces";
import { BoardRepository, BoardFactory } from "@/services/game/BoardRepository";
import { loadModels } from "@/utils/loadModels";
import { sleep } from "@/utils/sleep";
import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface Context {
  game: BoardRepository["game"];
  restart: boolean;
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
  deletePiecePosition: number[] | null;
  getBoard: () => GetBoardResponse;
  getPossibleMoves: (args: GetPossibleMovesClientArgs) => void;
  moveTo: (args: MoveToClientArgs) => void;
  clearAll: () => void;
  toogleFreeCamera: () => void;
  toogleResetCamera: () => void;
  updatePiece: (pieceType: PieceTypeEnum) => void;
  restartGame: () => void;
  reviewGame: () => void;
  reviewMove: (type: GameMoveType) => void;
}

const GameContext = createContext<Context>({} as Context);

const GameProvider = ({ children }: { children: Children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [game, setGame] = useState(() =>
    BoardFactory.create({
      type: BoardTypeEnum.classic,
    })
  );
  const [previewMoves, setPreviewMoves] = useState<Context["previewMoves"]>([]);
  const [updatePiecePosition, setUpdatePiecePosition] =
    useState<Context["updatePiecePosition"]>(null);
  const [deletePiecePosition, setDeletePiecePosition] =
    useState<Context["deletePiecePosition"]>(null);
  const [camera, setCamera] = useState<Context["camera"]>({
    position: CONSTANTS.CAMERA_POSITION,
    freeCam: false,
    resetCam: false,
  });
  const [modal, setModal] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);

  const cache: RefObject<Context["cache"] | null> = useRef(null);
  const pieceActiveRef = useRef<PieceOpts | null>(null);

  const getBoard = () => {
    return game.getBoard();
  };

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
    if (game.game.turn != args.color) return;

    const moves = game.getPossibleMoves({ pos: args.pos }).flat();
    pieceActiveRef.current = args;
    setPreviewMoves(moves);
  };

  const moveTo = async ({
    from: fromArg,
    to: toArg,
    type: typeArg,
  }: MoveToClientArgs) => {
    const res = {} as { y?: number; x?: number };
    const resReversed = {} as { y?: number; x?: number };

    const piece = pieceActiveRef.current! || fromArg;
    if (!piece) return;

    const [fromY, fromX] = piece.pos || fromArg;
    const [toY, toX] = toArg;
    const moveY = toY - fromY;
    const moveX = toX - fromX;

    const { from, to, type, pieceType } = await game.moveTo({
      from: fromArg || piece.pos,
      to: toArg,
      type: typeArg,
    });
    switch (pieceType) {
      case PieceTypeEnum.pawn:
        res.y = moveY * CONSTANTS.BOX_SPACE;

      case PieceTypeEnum.bishop:
      case PieceTypeEnum.horse:
      case PieceTypeEnum.rook:
      case PieceTypeEnum.queen:
      case PieceTypeEnum.king:
        res.y = moveY * CONSTANTS.BOX_SPACE;
        res.x = moveX * CONSTANTS.BOX_SPACE;
        resReversed.y = -res.y;
        resReversed.x = -res.x;
    }

    if (
      type == GameStatusTypeEnum.castlingLarge ||
      type === GameStatusTypeEnum.castlingShort
    ) {
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
      setDeletePiecePosition(to as Coord);
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
    game.socket.publish("Client_Crowning", pieceType);
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
    setRestart(true);
    setGame(BoardFactory.create({ type: BoardTypeEnum.classic }));
  };

  const reviewGame = () => {
    setGame(
      BoardFactory.create({
        type: BoardTypeEnum.review,
        historyMoves: game.game.history.moves,
      })
    );
    setRestart(true);
  };

  const reviewMove = (type: GameMoveType) => {
    const res = game.getCoord(type);
    if (!res) return;

    moveTo({
      from: res[0],
      to: res[1],
      type: GameStatusTypeEnum.previewMove,
    });
  };

  useEffect(() => {
    if (!game) return;

    const fn = async () => {
      cache.current = await loadModels();
      game.startGame({});
      setLoading(false);
      setRestart(false);
    };
    fn();
  }, [game, restart]);

  useEffect(() => {
    if (loading) return;
    const socket = game.socket;

    socket.once("Server_Crowning", async () => {
      setModal(true);
    });
  }, [game, loading]);

  return (
    <GameContext.Provider
      value={{
        game: game.game,
        restart,
        loading,
        modal,
        cache: cache.current!,
        previewMoves,
        camera,
        updatePiecePosition,
        deletePiecePosition,
        updatePiece,
        reviewGame,
        getBoard,
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
