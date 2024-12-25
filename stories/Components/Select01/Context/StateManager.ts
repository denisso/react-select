type Click = {
  message: "button" | "option" | "outside";
  event: MouseEvent;
  value?: string;
  label?: string;
} | null;

export type State = {
  options: Map<string, string>;
  open: boolean;
  animate: { target: "menu"; state: "start" | "finish" } | null;
  focus: boolean;
  click: Click;
};

type ObserverCallback<K extends keyof State> = (arg: State[K]) => void;

export type SM = StateManager;

export default class StateManager {
  private _state: State = {
    options: new Map<string, string>(),
    open: false,
    animate: null,
    focus: false,
    click: null,
  };
  private _observs = {
    options: new Set<ObserverCallback<"options">>(),
    open: new Set<ObserverCallback<"open">>(),
    animate: new Set<ObserverCallback<"animate">>(),
    focus: new Set<ObserverCallback<"focus">>(),
    click: new Set<ObserverCallback<"click">>(),
  };

  public config = {
    emptyOption: "",
    // multiply selection
    multiSelect: false,
  };
  private _proxy: State | null = null;
  private _notify: boolean[] = [];

  constructor() {
    const self = this;
    const ConstructorProxy = function <T extends { [key: string]: unknown }>(
      target: Partial<T>,
      opt?: Partial<T>
    ) {
      return new Proxy(target, {
        get(target, prop, receiver) {
          if (opt && opt[prop as string]) {
            return opt[prop as string];
          } else {
            if (self._notify.pop()) {
              self._notifyFn(prop as keyof State);
            }
          }
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
          const result = Reflect.set(target, prop, value, receiver);
          if (self._notify.pop()) {
            self._notifyFn(prop as keyof State);
          }

          return result;
        },
      });
    };
    const options = new Proxy(this._state.options, {
      get(target, prop, receiver) {
        if (typeof target[prop as keyof Map<string, string>] === "function") {
          if (["delete", "set", "clear"].includes(prop as string)) {
            return function (...args: string[]) {
              const result = Reflect.get(target, prop, receiver).apply(
                target,
                args
              );
              if (self._notify.pop()) {
                self._notifyFn("options");
              }
              return result;
            };
          }
          return Reflect.get(target, prop, receiver).bind(target);
        }
        if (self._notify.pop()) {
          self._notifyFn("options");
        }
        return Reflect.get(target, prop, receiver);
      },
    });
    this._proxy = ConstructorProxy(this._state, {
      options,
    }) as State;
  }

  state(notify = true) {
    this._notify.push(notify);
    return this._proxy;
  }

  attach<K extends keyof State>(state: K, cb?: ObserverCallback<K>) {
    if (!cb) return;
    this._observs[state].add(cb as ObserverCallback<keyof State>);
  }

  detach<K extends keyof State>(state: K, cb?: ObserverCallback<K>) {
    if (!cb) return;
    this._observs[state].delete(cb as ObserverCallback<keyof State>);
  }

  private _notifyFn<K extends keyof State>(state: K) {
    for (const cb of this._observs[state]) {
      (cb as ObserverCallback<K>)(this._state[state]);
    }
  }
}
