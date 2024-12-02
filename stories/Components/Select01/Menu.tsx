import React from "react";
import useContext from "./Context/useContext";
import Portal from "./Portal";
import throttle from "../utils/throttle";
import { addHandler, delHandler } from "../utils/posChange";
import classNames from "classnames";

type Props = {
  className: string;
  children: React.ReactNode;
  emptyValue: string;
  styles?: { open: string };
  onOpen?: (focus: boolean) => void;
  manualOpenClose?: boolean;
  portal?: boolean;
};

const aria = { role: "listbox" };

const Menu = ({
  className,
  children,
  styles,
  // onOpen,
  emptyValue,
  portal = false,
}: // manualOpenClose = false,
Props) => {
  const context = useContext();
  const [attrs, setAttrs] = React.useState<React.HTMLAttributes<HTMLElement>>({
    ...aria,
  });
  const refMenu = React.useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (refMenu.current && !refMenu.current.contains(event.target as Node)) {
      context.setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (!context.open) return;
    if (!(context.refBox.current instanceof HTMLElement)) {
      throw Error("Target element not valid");
    }

    const $target = context.refBox.current;

    const updateBox = throttle(() => {
      if (!open || !($target instanceof HTMLElement)) return;
      const rect = $target.getBoundingClientRect();

      setAttrs({
        style: {
          top: rect.top + rect.height + "px",
          left: rect.left + "px",
          width: rect.width + "px",
        },
        ...aria,
      });
    }, 100);

    updateBox();
    addHandler("resize", updateBox);
    addHandler("scroll", updateBox);
    return () => {
      delHandler("resize", updateBox);
      delHandler("scroll", updateBox);
    };
  }, [context]);
  context.refEmptyOption.current = emptyValue;
  if (!context.open) return null;
  if (!portal)
    return (
      <div className={className} ref={refMenu}>
        {children}
      </div>
    );
  return (
    <Portal
      ref={refMenu}
      className={classNames(className, context.open ? styles?.open : "")}
      type="dropdown"
      attrs={attrs}
    >
      {children}
    </Portal>
  );
};

export default Menu;
