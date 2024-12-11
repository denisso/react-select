import React from "react";
import Context from ".";

export type State = {
  options: Map<string, string>;
  open: "open" | "inopen" | "close" | "inclose ";
  focus: boolean;
  click: "control" | "outside" | "null";
};

type ObserverCallback<K extends keyof State> = (arg: State[K]) => void;

export type SM = StateManager;

export class StateManager {
  private _state: State = {
    options: new Map<string, string>(),
    open: "close",
    focus: false,
    click: "null",
  };
  private _proxy: State | null = null;
  private _proxyFn: () => State;
  private _notify: boolean = false;

  constructor() {
    const self = this;
    this._proxyFn = () => {
      if (this._proxy) return this._proxy;
      self._proxy = new Proxy(self._state, {
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
          const result = Reflect.set(target, prop, value, receiver);
          if (self._notify && prop !== "options") {
            self._notifyFn(prop as keyof State);
          }
          return result;
        },
      });

      self._proxy.options = new Proxy(this._state.options, {
        get(target, prop, receiver) {
          if (typeof target[prop as keyof Map<string, string>] === "function") {
            if (["delete", "set", "clear"].includes(prop as string)) {
              return function (...args: string[]) {
                const result = Reflect.get(target, prop, receiver).apply(
                  target,
                  args
                );
                if (self._notify) {
                  self._notifyFn("options");
                }
                return result;
              };
            }
            return Reflect.get(target, prop, receiver).bind(target);
          }

          return Reflect.get(target, prop, receiver);
        },
      });
      return self._proxy;
    };
  }

  state(notify = true) {
    this._notify = notify;
    return this._proxyFn();
  }

  private observs = {
    options: new Set<ObserverCallback<"options">>(),
    open: new Set<ObserverCallback<"open">>(),
    focus: new Set<ObserverCallback<"focus">>(),
    click: new Set<ObserverCallback<"click">>(),
  };

  public config = {
    emptyOption: "",
    multiSelect: false,
  };

  attach<K extends keyof State>(state: K, cb: ObserverCallback<K>) {
    this.observs[state].add(cb as ObserverCallback<keyof State>);
  }

  detach<K extends keyof State>(state: K, cb: ObserverCallback<K>) {
    this.observs[state].delete(cb as ObserverCallback<keyof State>);
  }

  private _notifyFn<K extends keyof State>(state: K) {
    for (const cb of this.observs[state]) {
      (cb as ObserverCallback<K>)(this._state[state]);
    }
  }
}

function useConstructSM() {
  const ref = React.useRef<SM | null>(null);

  if (ref.current === null) {
    ref.current = new StateManager();
  }

  return ref.current;
}
export type ContextProviderProps = {
  children: React.ReactNode;
};

function ContextProvider({ children }: ContextProviderProps) {
  const sm = useConstructSM();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const controlRef = React.useRef<HTMLElement | null>(null);

  return (
    <Context.Provider
      value={{
        boxRef,
        controlRef,
        sm,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default React.memo(ContextProvider);
