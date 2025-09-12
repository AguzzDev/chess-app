import { Coord, CoordGroupArray, CoordGroup } from "@/interfaces";

export const getSurroundings = ({
  pos: [startY, startX],
  nRings = 2,
}: {
  pos: Coord;
  nRings?: number;
}) => {
  const rings: CoordGroupArray = [];

  for (let r = 1; r <= nRings; r++) {
    const ring: CoordGroup = [];

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dy), Math.abs(dx)) !== r) continue;
        const y = startY + dy;
        const x = startX + dx;
        if (y < 0 || y > 7 || x < 0 || x > 7) continue;
        ring.push([y, x]);
      }
    }

    rings.push(ring);
  }

  return nRings == 1
    ? (rings.flat() as CoordGroup)
    : (rings as CoordGroupArray);
};
