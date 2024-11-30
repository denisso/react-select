"use client";
import throttle from "./throttle";

let height = 0,
  width = 0;

type HandlerScroll = { (scroll: number): void };
type HandlerResize = { (width: number, height: number): void };

interface EventHandlers {
  scroll: Set<HandlerScroll>;
  resize: Set<HandlerResize>;
}

const events: EventHandlers = {
  scroll: new Set<HandlerScroll>(),
  resize: new Set<HandlerResize>(),
};

if (typeof window !== "undefined") {
  height = window.innerHeight;
  width = window.innerWidth;
  const handlerResize = throttle(() => {
    height = window.innerHeight;
    width = window.innerWidth;
    events["resize"].forEach((cb) => cb(width, height));
  }, 50);
  window.addEventListener("scroll", () => {
    const scroll = document.documentElement.scrollTop;
    events["scroll"].forEach((cb) => cb(scroll));
  });

  new ResizeObserver(handlerResize).observe(document.documentElement);
}

export function addHandler(type: "resize", f: HandlerResize): void;
export function addHandler(type: "scroll", f: HandlerScroll): void;

export function addHandler(
  type: "resize" | "scroll",
  f: HandlerResize | HandlerScroll
) {
  (events[type] as Set<typeof f>).add(f);
}

export function delHandler(type: "resize", f: HandlerResize): void;
export function delHandler(type: "scroll", f: HandlerScroll): void;

export function delHandler(
  type: "resize" | "scroll",
  f: HandlerResize | HandlerScroll
) {
  (events[type] as Set<typeof f>).delete(f);
}
