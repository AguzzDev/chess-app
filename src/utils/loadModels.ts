import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Cache } from "@/interfaces";
import { sleep } from "./sleep";

export const cache: Cache = {
  "/models/board.glb": undefined,
  "/models/pieces2.glb": undefined,
};

export const loadModels = async () => {
  const loader = new GLTFLoader();

  const loadModel = (path: string): Promise<Group> =>
    new Promise((resolve, reject) => {
      loader.load(
        path,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      );
    });

  const modelsToLoad: (keyof Cache)[] = ["/models/board.glb", "/models/pieces2.glb"];

  try {
    await Promise.all(
      modelsToLoad.map((path) =>
        loadModel(path).then((scene) => {
          cache[path] = scene;
          return scene;
        })
      )
    );
    await sleep(2000);

    return cache;
  } catch (err) {
    throw err;
  }
};
