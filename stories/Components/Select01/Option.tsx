import React from "react";
import useContext from "./Context/useContext";
import { IDType } from "./Context";
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
  const c = useContext();
  const [state, setState] = React.useState<State>({
    isSelected: false,
    isHovered: false,
  });

  React.useEffect(() => {
    if (!label || !value) return;
    let isSelected = false;
    if (value == c.value) isSelected = true;
    setState((old) => ({ ...old, isSelected }));
  }, [c, value]);

  React.useEffect(() => {
    if (!label || !value) return;
    if (onChange) onChange(state);
  }, [state, onChange]);

  if (!label || !value) return null;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // handle onle left mouse
    if (e.button) return;
    c.setValue(value);
    c.methodsRef.current.notify("onChange", value);
    c.setOpen(false);
    c.methodsRef.current.notify("onOpen", false);
    c.setLabel(label);
  };

  const onOver = () => setState((old) => ({ ...old, isHovered: true }));
  const onOut = () => setState((old) => ({ ...old, isHovered: false }));

  return (
    <div
      {...attrs}
      role="option"
      aria-selected={value == c.value}
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
