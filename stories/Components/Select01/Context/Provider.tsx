import React from "react";
import Context from ".";
import StateManager from "./StateManager";

export type ContextProviderProps = {
  children: React.ReactNode;
};
export function useConstructSM() {
  const ref = React.useRef<StateManager | null>(null);

  if (ref.current === null) {
    ref.current = new StateManager();
  }

  return ref.current;
}

function ContextProvider({ children }: ContextProviderProps) {
  const sm = useConstructSM();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const controlRef = React.useRef<HTMLElement | null>(null);

  return (
    <Context.Provider
      value={{
        boxRef,
        controlRef,
        sm,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default React.memo(ContextProvider);
