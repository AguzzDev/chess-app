import { Coord, CoordGroup, CoordGroupArray } from "@/interfaces";

export function directionsMapping(
  from: Coord,
  directions: number[][],
  steps: number,
  cb: (
    pos: Coord,
    internalRes: CoordGroup
  ) => "continue" | "break" | "stopAll"
): CoordGroupArray {
  const res: CoordGroupArray = [];

  for (const [dy, dx] of directions) {
    const internalRes: CoordGroup = [];

    for (let step = 1; step < steps; step++) {
      const y = from[0] + dy * step;
      const x = from[1] + dx * step;

      if (y < 0 || y > 7 || x < 0 || x > 7) break;

      const action = cb([y, x], internalRes);

      if (action === "break") break;
      if (action === "stopAll") {
        res.push(internalRes);
        return res;
      }
    }

    res.push(internalRes);
  }

  return res;
}
