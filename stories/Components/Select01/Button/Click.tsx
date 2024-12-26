import React from "react";
import useContext from "../Context/useContext";
import classNames from "classnames";
import { State } from "../";

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
  React.useEffect(() => {
    const changeOptions = (args: State["options"]) => {
      if (!args.size) return setLabel(placeholderRef.current);
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

export type Styles = Partial<{
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
  placeholderRef.current = !placeholder ? "empty" : placeholder;
  const [label, setLabel] = React.useState(placeholderRef.current);
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    c.sm.config.multiSelect = false;

    if (box) c.controlRef.current = box;
    else c.controlRef.current = buttonRef.current;

    const onClick = (click: State["click"]) => {
      if (!click || click.event.button) return;

      if (click.message == "outside") {
        c.sm.state.open = false;
      } else if (click.message == "option") {
        if (click.value && click.label) {
          c.sm.state.options.clear();
          c.sm.state.options.set(click.value, click.label);
          setLabel(
            c.sm.config.emptyOption === click.value
              ? placeholderRef.current
              : click.label
          );
        }
        c.sm.state.open = false;
      } else if (click.message == "button") {
        c.sm.state.open = !c.sm.state.open;
      }

      setOpen(c.sm.state.open);
    };

    c.sm.attach("click", onClick);
    return () => {
      c.sm.detach("click", onClick);
    };
  }, [c]);

  return (
    <button
      className={classNames(className, open ? styles?.open : "")}
      onMouseDown={(event: React.MouseEvent) =>
        (c.sm.state.click = {
          message: "button",
          event: event.nativeEvent,
        })
      }
      ref={buttonRef}
      onFocus={() => (c.sm.state.focus = true)}
      onBlur={() => (c.sm.state.focus = false)}
    >
      {children ? children : label}
    </button>
  );
};

export default Button;
