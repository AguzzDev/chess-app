"use client";
import { Game } from "@/components/game";
import GameProvider from "@/context/GameContext";

export default function Home() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
