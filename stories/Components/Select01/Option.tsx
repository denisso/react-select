import React from "react";
import useContext from "./Context/useContext";
import { IDType } from "./Context/Context";
import classNames from "classnames";

type Styles = Partial<{
  hover: string;
  selected: string;
}>;

type Props = {
  value: IDType;
  label: string;
  className?: string;
  onChange?: (state: State) => void;
  attrs?: React.HTMLAttributes<HTMLElement>;
  styles?: Styles;
  children?: React.ReactNode;
};

type State = {
  isSelected: boolean;
  isHovered: boolean;
};

const Option = ({
  label,
  value,
  className,
  onChange,
  attrs,
  styles,
  children,
}: Props) => {
  const context = useContext();
  const [state, setState] = React.useState<State>({
    isSelected: false,
    isHovered: false,
  });

  React.useEffect(() => {
    if (!label || !value) return;
    let isSelected = false;
    if (value == context.value) isSelected = true;
    setState((old) => ({ ...old, isSelected }));
  }, [context, value]);

  React.useEffect(() => {
    if (!label || !value) return;
    if (onChange) onChange(state);
  }, [state, onChange]);

  if (!label || !value) return null;
  
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.button) return;
    context.onMouseDownOption(value, label);
  };

  const onOver = () => setState((old) => ({ ...old, isHovered: true }));
  const onOut = () => setState((old) => ({ ...old, isHovered: false }));

  return (
    <div
      {...attrs}
      role="option"
      aria-selected={value == context.value}
      className={classNames(
        className,
        state.isSelected ? styles?.selected : "",
        state.isHovered ? styles?.hover : ""
      )}
      onMouseDown={onMouseDown}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      {children ? children : label}
    </div>
  );
};

export default Option;
