type Click = {
  message: "button" | "option" | "outside";
  event: MouseEvent;
  value?: string;
  label?: string;
} | null;

export type StatePublic = {
  options: Map<string, string>;
  open: boolean;
  animate: { target: "menu"; state: "start" | "finish" } | null;
  focus: boolean;
  click: Click;
};

type ObserverCallback<T, K extends keyof T> = (arg: T[K]) => void;

abstract class StateManager<T extends {}> {
  protected _state: T;
  protected abstract state: T;
  protected _observs: { [K in keyof T]: Set<ObserverCallback<T, K>> };

  constructor(state: T) {
    this._state = state;
    this._observs = this._initObservers();
  }

  attach<K extends keyof T>(key: K, cb?: ObserverCallback<T, K>) {
    if (!cb) return;
    this._observs[key].add(cb);
  }

  detach<K extends keyof T>(key: K, cb?: ObserverCallback<T, K>) {
    if (!cb) return;
    this._observs[key].delete(cb);
  }

  private _initObservers(): { [K in keyof T]: Set<ObserverCallback<T, K>> } {
    const observs: Partial<{ [K in keyof T]: Set<ObserverCallback<T, K>> }> =
      {};
    for (const key of Object.keys(this._state) as (keyof T)[]) {
      observs[key] = new Set<ObserverCallback<T, typeof key>>();
    }
    return observs as { [K in keyof T]: Set<ObserverCallback<T, K>> };
  }

  protected _notifyFn<K extends keyof T>(key: K) {
    for (const cb of this._observs[key]) {
      cb(this._state[key]);
    }
  }

  protected _initProxy(opt?: Partial<T>) {
    const self = this;
    return new Proxy(this._state, {
      get(target, prop, receiver) {
        if (opt && opt[prop as keyof T]) {
          return opt[prop as keyof T];
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        self._notifyFn(prop as keyof T);
        return result;
      },
    });
  }
}

export default class StateManagerPublic extends StateManager<StatePublic> {
  public state: StatePublic;
  public config = {
    emptyOption: "",
    // multiply selection
    multiSelect: false,
  };
  constructor(state: StatePublic) {
    super(state);
    const self = this;

    const options = new Proxy(this._state.options, {
      get(target, prop, receiver) {
        if (typeof target[prop as keyof Map<string, string>] === "function") {
          if (["delete", "set", "clear"].includes(prop as string)) {
            return function (...args: string[]) {
              const result = Reflect.get(target, prop, receiver).apply(
                target,
                args
              );

              self._notifyFn("options");

              return result;
            };
          }
          return Reflect.get(target, prop, receiver).bind(target);
        }

        self._notifyFn("options");

        return Reflect.get(target, prop, receiver);
      },
    });
    this.state = this._initProxy({ options });
  }
}
