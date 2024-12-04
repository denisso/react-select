/**
 * Компонент альтернатива React Select
 * Особенность: бльше возможностей для настройки
 * Компонент состояит из нескольких отдельных компонентов, которые связаны контекстом
 */

import React from "react";
import ContextProvider from "./Context/Provider";
import useContext from "./Context/useContext";

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
