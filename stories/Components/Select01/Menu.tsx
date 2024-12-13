import React from "react";
import useContext from "./Context/useContext";
import Portal from "./Portal";
import throttle from "../utils/throttle";
import { addHandler, delHandler } from "../utils/posChange";
import classNames from "classnames";
import css from "./Menu.module.css";
import type { State } from "./Context/StateManager";

const updateBox = throttle<
  (
    target: HTMLElement,
    setAttrs: React.Dispatch<
      React.SetStateAction<React.HTMLAttributes<HTMLElement>>
    >
  ) => void
>((target, setAttrs) => {
  if (!open || !(target instanceof HTMLElement)) return;
  const rect = target.getBoundingClientRect();

  setAttrs({
    style: {
      top: rect.top + rect.height + "px",
      left: rect.left + "px",
      width: rect.width + "px",
    },
    ...aria,
  });
}, 100);

type Props = {
  className: string;
  children: React.ReactNode;
  emptyValue: string;
  styles?: Partial<{ open: string }>;
  onOpen?: (focus: boolean) => void;
  manualOpenClose?: boolean;
  portal?: boolean;
};

const aria = { role: "listbox" };

const Menu = ({
  className,
  children,
  styles,
  emptyValue,
  portal = false,
}: Props) => {
  const c = useContext();
  const [open, setOpen] = React.useState<State["open"]>("close");
  const [attrs, setAttrs] = React.useState<React.HTMLAttributes<HTMLElement>>({
    ...aria,
  });
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        c.boxRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !c.boxRef.current.contains(event.target as Node)
      ) {
        c.sm.state().click = {
          message: "outside",
          element: menuRef.current as HTMLElement,
        };
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (!portal) return;
    if (!(c.boxRef.current instanceof HTMLElement)) {
      throw Error("Target element not valid");
    }
    setOpen(c.sm.state(false).open);
    const $target = c.boxRef.current;
    const onOpen = (open: State["open"]) => setOpen(open);

    updateBox($target, setAttrs);
    const h = () => updateBox($target, setAttrs);
    c.sm.attach("open", onOpen);
    addHandler("resize", h);
    addHandler("scroll", h);
    return () => {
      c.sm.detach("open", onOpen);
      delHandler("resize", h);
      delHandler("scroll", h);
    };
  }, [c]);
  c.sm.config.emptyOption = emptyValue;
  if (!c.sm.state(false).open) return null;
  if (!portal)
    return (
      <div className={className} ref={menuRef}>
        {children}
      </div>
    );
  return (
    <Portal>
      {open === "open" ? (
        <div
          {...attrs}
          ref={menuRef}
          className={classNames(
            css.portal,
            open ? styles?.open : "",
            className
          )}
        >
          {children}
        </div>
      ) : (
        <></>
      )}
    </Portal>
  );
};

export default Menu;
