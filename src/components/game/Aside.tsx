import { useGame } from "@/context/GameContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BoardTypeEnum, GameMoveType } from "@/interfaces";
import { useEffect, useState } from "react";

export function Aside() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { game, restartGame, reviewGame, reviewMove } = useGame();
  const mediaQuery = useMediaQuery();

  const showPlayAgainButton =
    game.move >= 1 || game.gameEnd || game.type === BoardTypeEnum.review;
  const showReviewButton =
    game.type == BoardTypeEnum.classic && showPlayAgainButton;
  const showReviewButtons = game.type == BoardTypeEnum.review;

  const handleClick = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (!mediaQuery) return;
    if (mediaQuery === "desktop" || collapsed) return;

    setCollapsed(true);
  }, [mediaQuery]);
  
  return (
    <section className="absolute bottom-0 md:top-0 md:right-0 flex flex-col w-full md:w-1/4 bg-[#262522]">
      {mediaQuery != "desktop" && (
        <button className="py-2" onClick={handleClick}>Mostrar info</button>
      )}

      {!collapsed && (
        <>
          <h1 className="p-2">Chess</h1>

          <div className="border-y border-gray-300 p-3">
            <h3>{game.opening || "-"}</h3>
          </div>

          <div className="flex flex-col overflow-y-scroll h-52 md:h-full bg-[#262522]">
            {game.history.notation.map((value, i) => {
              const [v1, v2] = value.split("|");
              const color = i % 2 == 1 && "bg-gray-600";

              return (
                <div key={value} className={`${color} flex space-x-3 p-3`}>
                  <div className="flex min-w-20 pr-3">
                    <p className="pr-1">{i + 1}.</p>
                    <p>{v1}</p>
                  </div>

                  <p>{v2}</p>
                </div>
              );
            })}
          </div>

          {showPlayAgainButton && (
            <button onClick={restartGame}>Play again</button>
          )}
          {showReviewButton && <button onClick={reviewGame}>Review</button>}

          {showReviewButtons && (
            <>
              <button onClick={() => reviewMove(GameMoveType.prev)}>
                prev move
              </button>
              <button onClick={() => reviewMove(GameMoveType.next)}>
                next move
              </button>
            </>
          )}

          <footer className="flex items-center flex-1 p-2 bg-[#262522]">
            <h4>Developed by AguzzDev</h4>
          </footer>
        </>
      )}
    </section>
  );
}
