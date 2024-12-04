import React from "react";
import Context, { IDType } from ".";
import { MethodsObserver } from "../ParamsManager";

export type ContextProviderProps = {
  children: React.ReactNode;
};

function ContextProvider({ children }: ContextProviderProps) {
  const [value, setValue] = React.useState<IDType>("");
  const [label, setLabel] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const placeholderRef = React.useRef("");
  const emptyOptionRef = React.useRef("");
  const methodsRef = React.useRef(new MethodsObserver());
  const controlRef= React.useRef<HTMLElement | null>(null);
  return (
    <Context.Provider
      value={{
        focus,
        setFocus,
        value,
        setValue,
        label,
        setLabel,
        open,
        setOpen,
        placeholderRef,
        boxRef,
        emptyOptionRef,
        methodsRef,
        controlRef
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
