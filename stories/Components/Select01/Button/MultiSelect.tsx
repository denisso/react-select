import React from "react";
import useContext from "../Context/useContext";
import { State } from "..";
import type { Styles } from "./Click";
import classNames from "classnames";

type ButtonCloseMultiProps = {
  label?: string;
  children?: React.ReactNode;
  className?: string;
};
export const ButtonCloseMulti = ({
  className,
  label,
  children,
}: ButtonCloseMultiProps) => {
  const c = useContext();

  return (
    <button
      className={className}
      tabIndex={-1}
      onMouseDown={() => (c.sm.state.open = false)}
    >
      {label ? label : children}
    </button>
  );
};

type ButtonProps = {
  className?: string;
  value?: string;
  label?: string;
  children?: React.ReactNode;
};

export const TagClose = ({
  className,
  value,
  label,
  children,
}: ButtonProps) => {
  const c = useContext();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (value !== undefined) c.sm.state.options.delete(value);
  };

  return (
    <button className={className} tabIndex={-1} onMouseDown={handleClick}>
      {label ? label : children}
    </button>
  );
};

type TagProps = {
  className?: string;
  button: React.ReactElement<ButtonProps>;
  label?: string;
  value?: string;
};
export const Tag = ({ label, className, button, value }: TagProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className={className} onMouseDown={handleClick}>
      {label} {React.cloneElement(button, { value })}
    </div>
  );
};

type ButtonMultiProps = {
  className: string;
  placeholder: string;
  tag: React.ReactElement<TagProps>;
  styles?: Styles;
  box?: HTMLElement;
};
const ButtonMulti = ({
  className,
  tag,
  placeholder,
  styles,
  box,
}: ButtonMultiProps) => {
  const c = useContext();
  const placeholderRef = React.useRef("empty");
  const [tags, setTags] = React.useState<[string, string][]>([]);
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  placeholderRef.current = !placeholder ? "empty" : placeholder;

  React.useEffect(() => {
    c.sm.config.multiSelect = true;

    if (box) c.controlRef.current = box;
    else c.controlRef.current = buttonRef.current;

    const onClick = (click: State["click"]) => {
      if (!click || click.event.button) return;
      if (click.message == "outside") {
        c.sm.state.open = false;
      } else if (click.message == "option") {
        if (click.value && click.value !== c.sm.config.emptyOption) {
          if (c.sm.state.options.has(click.value)) {
            c.sm.state.options.delete(click.value);
          } else {
            c.sm.state.options.set(click.value, click.label ?? "");
          }
        }
      } else if (click.message == "button") {
        c.sm.state.open = !c.sm.state.open;
      }

      setOpen(c.sm.state.open);
    };
    const onOptions = (options: State["options"]) => {
      setTags(Array.from(options));
    };
    c.sm.attach("options", onOptions);
    c.sm.attach("click", onClick);
    return () => {
      c.sm.detach("options", onOptions);
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
      {tags.length
        ? tags.map(([key, label]) =>
            React.cloneElement(tag, { key, label, value: key })
          )
        : placeholder}
    </button>
  );
};

export default ButtonMulti;
