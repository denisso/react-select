import React from "react";
import Context, { IDType } from ".";
import { MethodsObserver } from "../ParamsManager";
import Queue from "../../utils/queue";

export type ContextProviderProps = {
  children: React.ReactNode;
};

type State = {
  values: Map<string, { label: string }>;
  open: "open" | "inopen" | "close" | "inclose ";
  focus: boolean;
};

type Value = {
  label: string;
};

type Observer = ((state: State) => void) | null;

export class StateObserver {
  private state: State = {
    values: new Map<string, Value>(),
    open: "close",
    focus: false,
  };
  private observs = new Queue<Observer>();
  attach(cb: (state: State) => void) {
    return this.observs.enqueue(cb)
  }
  detach(index: number) {
    
  }
  notify() {}
}

function ContextProvider({ children }: ContextProviderProps) {
  // const [value, setValue] = React.useState<IDType>("");
  // const [label, setLabel] = React.useState("");
  // const [open, setOpen] = React.useState(false);
  // const [focus, setFocus] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const placeholderRef = React.useRef("");
  const emptyOptionRef = React.useRef("");
  const methodsRef = React.useRef(new MethodsObserver());
  const controlRef = React.useRef<HTMLElement | null>(null);
  return (
    <Context.Provider
      value={{
        placeholderRef,
        boxRef,
        emptyOptionRef,
        methodsRef,
        controlRef,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
