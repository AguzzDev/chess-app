import { useEffect, useState } from "react";

type StateType = "desktop" | "laptop" | "mobile";
export const useMediaQuery = () => {
  const [state, setState] = useState<StateType | null>(null);

  useEffect(() => {
    if (typeof window == undefined) return;

    const width = window.innerWidth;

    if (width >= 767) {
      setState("desktop");
    } else if (width >= 450) {
      setState("laptop");
    } else {
      setState("mobile");
    }
  }, []);

  return state;
};
