import React from "react";

export type OptionType = {
  label: string;
  key: string;
};

export type IDType = string;

interface IContext {
  value: IDType;
  setValue: React.Dispatch<React.SetStateAction<IDType>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  focus: boolean;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  refBox: React.MutableRefObject<HTMLElement | null>;
  refFocus: React.MutableRefObject<boolean>;
  refPlaceholder: React.MutableRefObject<string>;
  refEmptyOption: React.MutableRefObject<IDType>;
  onClickButton: () => void;
  onMouseDownOption: (value: IDType, label: string) => void;
}

export default React.createContext<IContext | undefined>(undefined);
