import React from "react";
import useContext from "./Context/useContext";
import Portal from "./Portal";
import throttle from "../utils/throttle";
import { addHandler, delHandler } from "../utils/posChange";
import classNames from "classnames";
import css from "./Menu.module.css";
import type { State } from ".";

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

const aria = { role: "listbox" };

type HandleClickOutsideProps = {
  menuRef: React.RefObject<HTMLDivElement>;
};

const HandleClickOutside = ({ menuRef }: HandleClickOutsideProps) => {
  const c = useContext();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        c.boxRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !c.boxRef.current.contains(event.target as Node)
      ) {
        c.sm.state.click = {
          message: "outside",
          event,
        };
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [c]);
  return null;
};

type Props = {
  className: string;
  children: React.ReactNode;
  emptyValue: string;
  styles?: Partial<{ open: string }>;
  portal?: boolean;
  animate?: {
    t: number;
    fn?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  } | null;
  onOpen?: (open: State["open"]) => void;
};

const Menu = ({
  className,
  children,
  styles,
  emptyValue,
  portal,
  animate,
  onOpen,
}: Props) => {
  const c = useContext();
  const [open, setOpen] = React.useState<State["open"]>(false);
  const [attrs, setAttrs] = React.useState<React.HTMLAttributes<HTMLElement>>({
    ...aria,
  });
  const menuRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const ca = React.useRef<Animation | null>();
  React.useEffect(() => {
    c.sm.attach("open", onOpen);
    return () => c.sm.detach("open", onOpen);
  }, [c, onOpen]);

  React.useEffect(() => {
    c.sm.attach("open", setOpen);
    setOpen(c.sm.state.open);
    if (!portal) return () => c.sm.detach("open", setOpen);
    if (!(c.boxRef.current instanceof HTMLElement)) {
      throw Error("Target element not valid");
    }
    const $target = c.boxRef.current;
    updateBox($target, setAttrs);
    const h = () => updateBox($target, setAttrs);

    addHandler("resize", h);
    addHandler("scroll", h);

    return () => {
      delHandler("resize", h);
      delHandler("scroll", h);
      c.sm.detach("open", setOpen);
    };
  }, [c]);

  React.useEffect(() => {
    // animation
    const onOpen = (open: State["open"]) => {
      if (!animate || boxRef.current === null || !boxRef.current.children[0])
        return;

      const w = boxRef.current.children[0] as HTMLDivElement;
      const p = boxRef.current.offsetHeight / w.offsetHeight;
      const duration = animate?.t ?? 500;

      const a = boxRef.current.animate(
        [
          { height: p * w.offsetHeight + "px" },
          { height: open ? w.offsetHeight + "px" : 0 },
        ],
        {
          duration: open
            ? duration - Math.min(duration, p * duration)
            : Math.min(duration, p * duration),
          iterations: 1,
          fill: "forwards",
          easing: animate.fn ?? "linear",
        }
      );
      c.sm.state.animate = { target: "menu", state: "start" };
      a.onfinish = () => {
        c.sm.state.animate = { target: "menu", state: "finish" };
        ca.current = null;
      };

      if (ca.current) ca.current.cancel();
      ca.current = a;
    };
    c.sm.attach("open", onOpen);
    return () => c.sm.detach("open", onOpen);
  }, [c, animate]);
  c.sm.config.emptyOption = emptyValue;

  if (!portal)
    return (
      <>
        {open ? (
          <div
            className={classNames(className, open ? styles?.open : "")}
            ref={menuRef}
          >
            {children}
          </div>
        ) : (
          <></>
        )}
      </>
    );

  return (
    <>
      <HandleClickOutside menuRef={menuRef} />
      <Portal>
        {animate || open ? (
          <div
            {...attrs}
            ref={boxRef}
            className={classNames(css.box, animate ? css.animate : "")}
          >
            <div
              ref={menuRef}
              className={classNames(
                css.portal,
                open ? styles?.open : "",
                className
              )}
            >
              {children}
            </div>
          </div>
        ) : (
          <></>
        )}
      </Portal>
    </>
  );
};

export default Menu;
