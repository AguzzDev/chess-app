import { cache } from "./loadModels";
import { Object3D } from "three";

export const getPieceNode = (name: string): Object3D | null => {
  const piecesScene = cache["/models/pieces2.glb"];
  if (!piecesScene) return null;

  const node = piecesScene.getObjectByName(name);
  if (!node) return null;

  return node.clone();
};
