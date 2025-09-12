import { Coord, CoordGroup, CoordGroupArray } from "@/interfaces";

type ArrayFilterInput =
  | {
      type: "equal";
      arrays: { arr: CoordGroup; arrToFilter: CoordGroup };
    }
  | {
      type: "oneArrayContain" | "oneArrayNotContain" | "oneArrayContainExact";
      arrays: { arr: CoordGroupArray; arrToFilter: Coord };
    }
  | {
      type: "twoArrayContain" | "twoArrayNotContain" | "twoArrayContainExact";
      arrays: { arr: CoordGroupArray; arrToFilter: CoordGroup };
    }
  | {
      type: "clear";
      arrays: { arr: CoordGroupArray; arrToFilter?: null };
    }
  | {
      type: "clearWithFilter";
      arrays: { arr: CoordGroupArray; arrToFilter: CoordGroup };
    };

export const arrayFilter = ({
  type,
  arrays,
}: ArrayFilterInput): CoordGroupArray => {
  switch (type) {
    case "equal":
      return [
        arrays.arr.filter(([y, x]) =>
          arrays.arrToFilter.some(([ky, kx]) => ky === y && kx === x)
        ),
      ] as CoordGroupArray;

    case "oneArrayContain":
      return arrays.arr.filter((group) =>
        group.some(
          ([y, x]) => y === arrays.arrToFilter[0] && x === arrays.arrToFilter[1]
        )
      ) as CoordGroupArray;
    case "oneArrayContainExact":
      return arrays.arr
        .map((group) =>
          group.filter(
            ([y, x]) =>
              y === arrays.arrToFilter[0] && x === arrays.arrToFilter[1]
          )
        )
        .filter((arr) => arr.length > 0);
    case "oneArrayNotContain":
      return arrays.arr.filter(
        (group) =>
          !group.some(
            ([y, x]) =>
              y === arrays.arrToFilter[0] && x === arrays.arrToFilter[1]
          )
      ) as CoordGroupArray;
    case "twoArrayContain":
      return arrays.arr.filter((group) =>
        group.some(([y, x]) =>
          arrays.arrToFilter.some(([fy, fx]) => fy === y && fx === x)
        )
      ) as CoordGroupArray;
    case "twoArrayContainExact":
      return arrays.arr
        .map((group) =>
          group.filter(([y, x]) =>
            arrays.arrToFilter.some(([fy, fx]) => fy === y && fx === x)
          )
        )
        .filter((arr) => arr.length > 0) as CoordGroupArray;
    case "twoArrayNotContain":
      return arrays.arr.filter((group) =>
        group.some(
          ([y, x]) =>
            !arrays.arrToFilter.some(([fy, fx]) => fy === y && fx === x)
        )
      ) as CoordGroupArray;

    case "clear":
      return arrays.arr.filter((group) => group.length > 0) as CoordGroupArray;

    case "clearWithFilter":
      return arrays.arr
        .filter((group) =>
          group.some(([y, x]) =>
            arrays.arrToFilter.some(([fy, fx]) => fy === y && fx === x)
          )
        )
        .filter((group) => group.length > 0) as CoordGroupArray;
    default:
      return [] as CoordGroupArray;
  }
};
