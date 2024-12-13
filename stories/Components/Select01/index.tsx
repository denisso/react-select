/**
 * Компонент альтернатива React Select
 * Особенность: много возможностей для настройки
 * Компонент состояит из нескольких отдельных компонентов, которые связаны контекстом
 */

import React from "react";
import ContextProvider from "./Context/Provider";
import useContext from "./Context/useContext";
export type { State } from "./Context/StateManager";
export { default as Button } from "./Button";
export {
  default as ButtonMulti,
  Tag,
  TagClose,
  ButtonCloseMulti,
} from "./ButtonMulti";
export { default as Menu } from "./Menu";
export { default as Option } from "./Option";
export { default as ParamsManager } from "./ParamsManager";
export { default as Portal } from "./Portal";

type BoxProps = {
  className?: string;
  children: React.ReactNode;
};
const Box = ({ className, children }: BoxProps) => {
  const c = useContext();
  return (
    <div className={className} ref={c.boxRef}>
      {children}
    </div>
  );
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Select = ({ children, className }: Props) => {
  return (
    <ContextProvider>
      <Box className={className}>{children} </Box>
    </ContextProvider>
  );
};

export default Select;
