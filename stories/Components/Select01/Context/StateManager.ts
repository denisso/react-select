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

abstract class StateManager<T extends object> {
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
    // value variable - important for recursive update states
    const value = this._state[key];
    for (const cb of this._observs[key]) cb(value);
  }

  protected _buildProxy<K extends keyof T>(
    key?: K | null,
    methods?: (keyof T[K])[] | null,
    children?: Partial<T> | null
  ) {
    const state = !key ? this._state : this._state[key];
    return new Proxy(state as object, {
      get: (target, prop, receiver) => {
        if (children && children[prop as keyof T]) {
          return children[prop as keyof T];
        }
        if (
          key &&
          methods &&
          typeof (target as T)[prop as keyof T] === "function"
        ) {
          if (methods.includes(prop as keyof T[K])) {
            return (...args: string[]) => {
              const result = Reflect.get(target, prop, receiver).apply(
                target,
                args
              );
              this._notifyFn(key);
              return result;
            };
          }
          return Reflect.get(target, prop, receiver).bind(target);
        }
        return Reflect.get(target, prop, receiver);
      },
      set: (target, prop, value, receiver) => {
        const result = Reflect.set(target, prop, value, receiver);
        this._notifyFn(prop as keyof T);
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

    const options = this._buildProxy("options", [
      "delete",
      "set",
      "clear",
    ]) as StatePublic["options"];
    this.state = this._buildProxy(null, null, { options }) as StatePublic;
  }
}

export type StatePrivate = {
  targetMenu: HTMLElement;
};

export class StateManagerPrivate extends StateManager<StatePrivate> {
  public state: StatePrivate;
  constructor(state: StatePrivate) {
    super(state);
    this.state = this._buildProxy() as StatePrivate;
  }
}
