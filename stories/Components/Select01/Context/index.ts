import React from "react";
import type StateManagerPublic from "./StateManager";

interface IContext {
  boxRef: React.RefObject<HTMLDivElement>;
  controlRef: React.MutableRefObject<HTMLElement | null>;
  sm: StateManagerPublic;
}

export default React.createContext<IContext | undefined>(undefined);
