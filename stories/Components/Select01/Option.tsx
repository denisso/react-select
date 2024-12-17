import React from "react";
import useContext from "./Context/useContext";
import classNames from "classnames";
import { State } from ".";

type Styles = Partial<{
  hover: string;
  selected: string;
}>;

type Props = {
  value: string;
  label?: string;
  className?: string;
  onSelect?: (state: boolean, value: string) => void;
  onHover?: (state: boolean, value: string) => void;
  attrs?: React.HTMLAttributes<HTMLElement>;
  styles?: Styles;
  children?: React.ReactNode;
};

const Option = ({
  label,
  value,
  className,
  onSelect,
  onHover,
  attrs,
  styles,
  children,
}: Props) => {
  const c = useContext();
  const [select, setSelect] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;
  const onHoverRef = React.useRef(onHover);
  onHoverRef.current = onHover;

  React.useEffect(() => {
    const onOption = function (options: State["options"]) {
      console.log("onOption");
      setSelect(options.has(value));
    };
    c.sm.attach("options", onOption);
    setSelect(c.sm.state(false).options.has(value));
    return () => {
      c.sm.detach("options", onOption);
    };
  }, [c]);

  if ((!label && !children) || !value) return null;
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // handle onle left mouse
    if (e.button) return;
    c.sm.state().click = {
      message: "option",
      value,
      label,
      event: e.nativeEvent,
    };
  };

  return (
    <div
      {...attrs}
      role="option"
      aria-selected={select}
      className={classNames(
        className,
        select ? styles?.selected : "",
        hover ? styles?.hover : ""
      )}
      onMouseDown={onMouseDown}
      onPointerOver={() => {
        setHover(true);
        if (onHoverRef.current) onHoverRef.current(true, value);
      }}
      onPointerOut={() => {
        setHover(false);
        if (onHoverRef.current) onHoverRef.current(false, value);
      }}
    >
      {children ? children : label}
    </div>
  );
};

export default Option;
