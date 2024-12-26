import React from "react";
import useContext from "./Context/useContext";
import { State } from ".";

export type Methods = Partial<{
  onOptions: (value: State["options"]) => void;
  onFocus: (focus: State["focus"]) => void;
  onOpen: (open: State["open"]) => void;
  onAnimate: (open: State["animate"]) => void;
}>;

const ParamsManager = ({ onOptions, onFocus, onOpen, onAnimate }: Methods) => {
  const c = useContext();

  React.useEffect(() => {
    if (onFocus) c.sm.attach("focus", onFocus);
    if (onOpen) c.sm.attach("open", onOpen);
    if (onOptions) c.sm.attach("options", onOptions);
    if (onAnimate) c.sm.attach("animate", onAnimate);
    return () => {
      if (onFocus) c.sm.detach("focus", onFocus);
      if (onOpen) c.sm.detach("open", onOpen);
      if (onOptions) c.sm.detach("options", onOptions);
      if (onAnimate) c.sm.detach("animate", onAnimate);
    };
  }, [c, onOptions, onFocus, onOpen, onAnimate]);

  return null;
};

export default ParamsManager;
