import React from "react";
import useContext from "./Context/useContext";
import { State } from "./Context/StateManager";
import type { Styles } from "./Button";
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
  const onClick = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.button) return;
    c.sm.state().open = "close"
  }
  return (
    <div
      className={className}
      onPointerDown={onClick}
    >
      {label ? label : children}
    </div>
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
  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (value !== undefined) c.sm.state().options.delete(value);
  };

  return (
    <div className={className}  onPointerDown={handleClick}>
      {label ? label : children}
    </div>
  );
};

type TagProps = {
  className?: string;
  button: React.ReactElement<ButtonProps>;
  label?: string;
  value?: string;
};
export const Tag = ({ label, className, button, value }: TagProps) => {
  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className={className} onPointerDown={handleClick}>
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
  const [open, setOpen] = React.useState("");
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  placeholderRef.current = !placeholder ? "empty" : placeholder;

  React.useEffect(() => {
    c.sm.config.multiSelect = true;

    if (box) c.controlRef.current = box;
    else c.controlRef.current = buttonRef.current;

    const onClick = (click: State["click"]) => {
      if (!click) return;
      if (click.message == "outside") {
        c.sm.state(false).open = "close";
      } else if (click.message == "option") {
        if (click.value && click.value !== c.sm.config.emptyOption) {
          if (c.sm.state().options.has(click.value)) {
            c.sm.state().options.delete(click.value);
          } else {
            c.sm.state().options.set(click.value, click.label ?? "");
          }
        }
      } else if (click.message == "button") {
        c.sm.state().open =
          c.sm.state(false).open === "open" ? "close" : "open";
      }

      setOpen(c.sm.state().open);
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
      className={classNames(className, open === "open" ? styles?.open : "")}
      onPointerDown={() =>
        (c.sm.state(true).click = {
          message: "button",
          element: buttonRef.current as HTMLElement,
        })
      }
      ref={buttonRef}
      onFocus={() => (c.sm.state().focus = true)}
      onBlur={() => (c.sm.state().focus = false)}
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
