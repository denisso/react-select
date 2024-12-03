import React from "react";
import Context from ".";

function useContext() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
}

export default useContext;
