import React from "react";
import useContext from "./Context/useContext";
import { State } from "./Context/StateManager";

export type Methods = Partial<{
  onOptions: (value: State["options"]) => void;
  onFocus: (focus: State["focus"]) => void;
  onOpen: (open: State["open"]) => void;
}>;

const ParamsManager = ({ onOptions, onFocus, onOpen }: Methods) => {
  const c = useContext();

  React.useEffect(() => {
    if (onFocus) c.sm.attach("focus", onFocus);
    if (onOpen) c.sm.attach("open", onOpen);
    if (onOptions) c.sm.attach("options", onOptions);
    return () => {
      if (onFocus) c.sm.detach("focus", onFocus);
      if (onOpen) c.sm.detach("open", onOpen);
      if (onOptions) c.sm.detach("options", onOptions);
    };
  }, [c, onOptions, onFocus, onOpen]);

  return null;
};

export default ParamsManager;
