import React from "react";
import type { SM } from "./Provider";

interface IContext {
  boxRef: React.RefObject<HTMLDivElement>;
  controlRef: React.MutableRefObject<HTMLElement | null>;
  sm: SM;
}

export default React.createContext<IContext | undefined>(undefined);
