import classNames from "classnames";
import ReactDom from "react-dom";
import React from "react";
import styles from "./Portal.module.css";

export type PortalProps = {
  className?: string;
  // z-index
  type: "dropdown" | "modal" | "popup" | "menu";
  attrs?: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
};

const Portal = React.forwardRef(
  (
    { className, children, type, attrs }: PortalProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    return ReactDom.createPortal(
      <div
        {...attrs}
        ref={ref}
        className={classNames(styles.portal, styles[type], className)}
      >
        {children}
      </div>,
      document.body
    );
  }
);

Portal.displayName = "Portal";

export default Portal;
