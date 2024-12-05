import ReactDom from "react-dom";
import React from "react";

export type PortalProps = {
  children: React.ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return ReactDom.createPortal(<>{children}</>, document.body);
};

Portal.displayName = "Portal";

export default Portal;
