import React from "react";
import useContext from "./Context/useContext";
import classNames from "classnames";

type ButtonLabel = {
  handleLabel?: (
    label: string,
    setLabel: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    placeholder: string
  ) => void;
};

export const ButtonLabel = ({ handleLabel }: ButtonLabel) => {
  const [label, setLabel] = React.useState("");
  const c = useContext();
  React.useEffect(()=>{}, [])
  React.useEffect(() => {
    const state = c.state.current
    if (handleLabel) {
      return handleLabel(
        state.label,
        setLabel,
        c.value,
        c.placeholderRef.current
      );
    }

    setLabel(
      !c.value || c.emptyOptionRef.current == c.value
        ? c.placeholderRef.current
        : c.label
    );
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

  if (placeholder) c.placeholderRef.current = placeholder;
  return (
    <button
      className={classNames(className, c.open ? styles?.open : "")}
      onClick={() => c.setOpen((prev) => !prev)}
      ref={(ref) => {
        if (box) c.controlRef.current = box;
        else if (ref) c.controlRef.current = ref;
      }}
      onFocus={() => c.setFocus(true)}
      onBlur={() => c.setFocus(false)}
    >
      {children
        ? children
        : !c.value || c.emptyOptionRef.current == c.value
        ? c.placeholderRef.current
        : c.label}
    </button>
  );
};

export default Button;
