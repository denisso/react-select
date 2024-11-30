/**
 * Компонент альтернатива React Select
 * Особенность: бльше возможностей для настройки
 * Компонент состояит из нескольких отдельных компонентов, которые связаны контекстом
 */

import React from "react";
import ContextProvider from "./Context/Provider";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Select = ({ children, className }: Props) => {
  return (
    <div className={className}>
      <ContextProvider>{children}</ContextProvider>
    </div>
  );
};

export default Select;
