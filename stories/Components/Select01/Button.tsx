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
  const context = useContext();

  React.useEffect(() => {
    if (handleLabel) {
      return handleLabel(
        context.label,
        setLabel,
        context.value,
        context.placeholderRef.current
      );
    }

    setLabel(
      !context.value || context.emptyOptionRef.current == context.value
        ? context.placeholderRef.current
        : context.label
    );
  }, [context, handleLabel]);
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
  const context = useContext();

  if (placeholder) context.placeholderRef.current = placeholder;
  return (
    <button
      className={classNames(className, context.open ? styles?.open : "")}
      onClick={() => context.setOpen((prev) => !prev)}
      ref={(ref) => {
        if (box) context.boxRef.current = box;
        else if (ref) context.boxRef.current = ref;
      }}
      onFocus={() => context.setFocus(true)}
      onBlur={() => context.setFocus(false)}
    >
      {children
        ? children
        : !context.value || context.emptyOptionRef.current == context.value
        ? context.placeholderRef.current
        : context.label}
    </button>
  );
};

export default Button;
