type Click = {
  message: "button" | "option" | "outside";
  element: HTMLElement;
  value?: string;
  label?: string;
} | null;

export type State = {
  options: Map<string, string>;
  open: "open" | "inopen" | "close" | "inclose ";
  focus: boolean;
  click: Click;
};

type ObserverCallback<K extends keyof State> = (arg: State[K]) => void;

export type SM = StateManager;

export default class StateManager {
  private _state: State = {
    options: new Map<string, string>(),
    open: "close",
    focus: false,
    click: null,
  };
  private _observs = {
    options: new Set<ObserverCallback<"options">>(),
    open: new Set<ObserverCallback<"open">>(),
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
  state(notify = true) {
    this._notify.push(notify);
    const self = this;
    if (this._proxy) return this._proxy;

    const optionsProxy = new Proxy(this._state.options, {
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

    this._proxy = new Proxy(self._state, {
      get(target, prop, receiver) {
        if (prop === "options") {
          return optionsProxy;
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

    return this._proxy;
  }

  attach<K extends keyof State>(state: K, cb?: ObserverCallback<K>) {
    if(!cb) return
    this._observs[state].add(cb as ObserverCallback<keyof State>);
  }

  detach<K extends keyof State>(state: K, cb?: ObserverCallback<K>) {
    if(!cb) return
    this._observs[state].delete(cb as ObserverCallback<keyof State>);
  }

  private _notifyFn<K extends keyof State>(state: K) {
    for (const cb of this._observs[state]) {
      (cb as ObserverCallback<K>)(this._state[state]);
    }
  }
}
