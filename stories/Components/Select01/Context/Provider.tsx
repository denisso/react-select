import React from "react";
import Context, { IDType } from "./Context";

export type ContextProviderProps = {
  children: React.ReactNode;
  onChange?: (id: IDType) => void;
  onFocus?: (focus: boolean) => void;
  onOpen?: (focus: boolean) => void;
};

function ContextProvider({
  children,
  onChange,
  onFocus,
  onOpen,
}: ContextProviderProps) {
  const [value, setValue] = React.useState<IDType>("");
  const [label, setLabel] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const refValue = React.useRef<string | null>(null);
  const refOpen = React.useRef(open);
  const refFocus = React.useRef(focus);
  const refBox = React.useRef<HTMLElement | null>(null);
  const refPlaceholder = React.useRef("");
  const refEmptyOption = React.useRef("");
  
  React.useEffect(() => {
    // prevent call onChange with same curId on changing onChange
    if (refValue.current === value && onChange) onChange(value);
  }, [onChange, value]);

  React.useEffect(() => {
    if (refFocus.current === focus && onFocus) onFocus(focus);
  }, [onFocus, focus]);

  React.useEffect(() => {
    if (refOpen.current === open && onOpen) onOpen(open);
  }, [onOpen, open]);

  const onMouseDownOption = (value: IDType, label: string) => {
    refValue.current = value;
    setValue(value);
    setOpen(false);
    setLabel(label);
  };

  const onClickButton = () => {
    refOpen.current = !open;
    setOpen(refOpen.current);
  };

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
        refPlaceholder,
        refFocus,
        refBox,
        refEmptyOption,
        onMouseDownOption,
        onClickButton,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
