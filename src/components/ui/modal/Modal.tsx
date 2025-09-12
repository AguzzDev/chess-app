"use client"
import { useGame } from "@/context/GameContext";
import { PieceTypeEnum } from "@/interfaces";
import { sleep } from "@/utils/sleep";
import { useState } from "react";

export const Modal = () => {
  const [form, setForm] = useState<{
    value: PieceTypeEnum | null;
    error: string | boolean;
  }>({
    value: null,
    error: false,
  });
  const { modal, updatePiece } = useGame();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.value) {
      setForm((prev) => ({ ...prev, error: "Selecciona algo" }));
      await sleep(2000);
      setForm((prev) => ({ ...prev, error: false }));
      return;
    }

    updatePiece(form.value!);
  };

  const Button = ({ value }: { value: PieceTypeEnum }) => (
    <button
      onClick={() => setForm((prev) => ({ ...prev, value }))}
      value={value}
    >
      {PieceTypeEnum[value]}
    </button>
  );

  return (
    <>
      {modal ? (
        <div className="absolute mt-18 top-0 right-0 bg-gray-500 z-50 py-10 px-5">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="grid grid-cols-2 gap-5">
                <Button value={PieceTypeEnum.horse} />
                <Button value={PieceTypeEnum.bishop} />
                <Button value={PieceTypeEnum.rook} />
                <Button value={PieceTypeEnum.queen} />
              </div>
              {form.error ? form.error : false}
            </div>

            <div className="text-center mt-5">
              <button type="submit">Seleccionar</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};