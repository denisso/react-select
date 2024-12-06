import React from "react";
import { IDType } from "./Context";
import useContext from "./Context/useContext";
import Queue from "../utils/queue";

type QueueType = Methods & { indx: React.MutableRefObject<number> };

class MethodsObserver {
  private observers = new Queue<QueueType>();
  attach(value: QueueType) {
    const indx = value.indx.current;
    return this.observers.update(indx, value);
  }
  detach(indx: number) {
    const firstObs = this.observers.peek();
    if (!firstObs) return;
    firstObs.indx.current = indx;
    this.observers.removeAndswapByIndex(indx);
  }
  notify<M extends keyof Methods>(
    method: M,
    ...params: Parameters<NonNullable<Methods[M]>>
  ) {
    for (
      let iterator = this.observers[Symbol.iterator](), res = iterator.next();
      !res.done;
      res = iterator.next()
    ) {
      const callback = res.value[method];
      if (callback)
        (callback as (...params: Parameters<NonNullable<Methods[M]>>) => void)(
          ...params
        );
    }
  }
}
export { MethodsObserver };

export type Methods = Partial<{
  onChange: (id: IDType) => void;
  onFocus: (focus: boolean) => void;
  onOpen: (focus: boolean) => void;
}>;

const ParamsManager = ({ onChange, onFocus, onOpen }: Methods) => {
  const indx = React.useRef(-1);
  const c = useContext();
  React.useEffect(() => {
    indx.current = c.methodsRef.current.attach({
      onChange,
      onFocus,
      onOpen,
      indx,
    });
    return () => {
      c.methodsRef.current.detach(indx.current);
    };
  }, [onChange, onFocus, onOpen]);

  return null;
};

export default ParamsManager;
