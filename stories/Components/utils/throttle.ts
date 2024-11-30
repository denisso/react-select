function throttle<T extends (...args: unknown[]) => void>(
  cb: T,
  delay: number = 1000
): (...args: Parameters<T>) => void {
  let shouldWait = false;
  let waitingArgs: Parameters<T> | null;

  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args: Parameters<T>) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }
    cb(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}

export default throttle;
