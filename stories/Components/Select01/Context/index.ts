import React from "react";
import type { MethodsObserver } from "../ParamsManager";
import { StateObserver } from "./Provider";

export type OptionType = {
  label: string;
  key: string;
};

export type IDType = string;

interface IContext {
  // value: IDType;
  // setValue: React.Dispatch<React.SetStateAction<IDType>>;
  // label: string;
  // setLabel: React.Dispatch<React.SetStateAction<string>>;
  // open: boolean;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // focus: boolean;
  // setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  boxRef: React.RefObject<HTMLDivElement>;
  controlRef: React.MutableRefObject<HTMLElement | null>;
  placeholderRef: React.MutableRefObject<string>;
  emptyOptionRef: React.MutableRefObject<IDType>;
  methodsRef: React.MutableRefObject<MethodsObserver>;
}

export default React.createContext<IContext | undefined>(undefined);
