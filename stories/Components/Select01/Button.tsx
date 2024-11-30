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
        context.refPlaceholder.current
      );
    }

    setLabel(
      !context.value || context.refEmptyOption.current == context.value
        ? context.refPlaceholder.current
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

  if (placeholder) context.refPlaceholder.current = placeholder;
  return (
    <button
      className={classNames(className, context.open ? styles?.open : "")}
      onClick={context.onClickButton}
      ref={(ref) => {
        if (box) context.refBox.current = box;
        else if (ref) context.refBox.current = ref;
      }}
      onFocus={() => {
        context.refFocus.current = true;
        context.setFocus(true);
      }}
      onBlur={() => {
        context.refFocus.current = false;
        context.setFocus(false);
      }}
    >
      {children
        ? children
        : !context.value || context.refEmptyOption.current == context.value
        ? context.refPlaceholder.current
        : context.label}
    </button>
  );
};

export default Button;
