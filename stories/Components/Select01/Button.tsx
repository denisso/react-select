import React from "react";
import useContext from "./Context/useContext";
import classNames from "classnames";
import { State } from "./Context/Provider";

type ButtonLabel = {
  handleLabel?: (
    label: string,
    setLabel: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => void;
  placeholder: string;
};

export const ButtonLabel = ({ handleLabel, placeholder }: ButtonLabel) => {
  const [label, setLabel] = React.useState("");
  const c = useContext();
  const placeholderRef = React.useRef("");
  placeholderRef.current = !placeholder ? "empty" : placeholder;
  const valueRef = React.useRef("");
  React.useEffect(() => {
    const changeOptions = (args: State["options"]) => {
      valueRef.current = args.keys().next().value ?? "";
      if (c.sm.config.emptyOption === valueRef.current)
        return setLabel(placeholderRef.current);
      const label = args.values().next().value;
      if (label) setLabel(label);
      else setLabel(placeholderRef.current);
    };
    c.sm.attach("options", changeOptions);
    return () => {
      c.sm.detach("options", changeOptions);
    };
  }, [c]);
  React.useEffect(() => {
    if (!handleLabel) return;
  }, [c, handleLabel]);
  return <>{label}</>;
};

type Styles = Partial<{
  open: string;
  focus: string;
}>;

type Props = {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  box?: HTMLElement;
  styles?: Styles;
};

const Button = ({ placeholder, className, children, box, styles }: Props) => {
  const c = useContext();
  const placeholderRef = React.useRef("empty");
  const [label, setLabel] = React.useState("");
  const [open, setOpen] = React.useState("");
  placeholderRef.current = !placeholder ? "empty" : placeholder;

  React.useEffect(() => {
    const changeOptions = (args: State["options"]) => {
      const value = args.keys().next().value;
      if (c.sm.config.emptyOption === value)
        return setLabel(placeholderRef.current);
      const label = args.values().next().value;
      if (label) setLabel(label);
    };
    const changeOpen = (open: State["open"]) => {
      setOpen(open);
    };
    c.sm.attach("options", changeOptions);
    c.sm.attach("open", changeOpen);
    if (!label) setLabel(placeholderRef.current);
    return () => {
      c.sm.detach("options", changeOptions);
      c.sm.detach("open", changeOpen);
    };
  }, [c]);

  return (
    <button
      className={classNames(className, open === "open" ? styles?.open : "")}
      onMouseDown={() => {
        c.sm.state(true).click = "control";
      }}
      ref={(ref) => {
        if (box) c.controlRef.current = box;
        else if (ref) c.controlRef.current = ref;
      }}
      // onFocus={() => (c.sm.state.focus = true)}
      // onBlur={() => (c.sm.state.focus = false)}
    >
      {children ? children : label}
    </button>
  );
};

export default Button;
