class SWAPTwoWayQueue<T> {
  private queue: (T | null)[];
  private head: number;
  private tail: number;

  constructor() {
    this.queue = [];
    this.head = 0;
    this.tail = 0;
  }
  /**
   * push element to end queue
   * @param value
   * @returns T
   */
  enqueue(value: T): number {
    this.queue[this.tail] = value;
    const indx = this.tail;
    this.tail++;
    return indx;
  }
  /**
   * get element from front queue
   * @returns
   */
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const value = this.queue[this.head];
    this.queue[this.head] = null;
    this.head++;
    return value;
  }
  /**
   *
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    this.tail--;
    const value = this.queue[this.tail];
    this.queue[this.tail] = null;
    return value;
  }
  /**
   *
   * @param index
   * @returns
   */
  update(index: number, value: T) {
    if (index < this.head || index >= this.tail) {
      return this.enqueue(value);
    }
    this.queue[index] = value;
    return index;
  }
  /**
   *
   * @param index
   * @returns
   */
  removeAndswapByIndex(index: number): T | null {
    if (this.isEmpty() || index < this.head || index >= this.tail) return null;
    if (index === this.tail) return this.pop();
    const value = this.queue[index];
    this.queue[index] = this.pop();
    return value;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.queue[this.head];
  }

  isEmpty(): boolean {
    if (this.head !== this.tail) return false;
    this.head = 0;
    this.tail = 0;
    return true;
  }

  size(): number {
    return this.tail - this.head;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.head;
    const tail = this.tail;
    const queue = this.queue;
    return {
      next(): IteratorResult<T> {
        if (current < tail) {
          return { value: queue[current++] as T, done: false };
        } else {
          return { done: true } as IteratorResult<T>;
        }
      },
    };
  }
}
export default SWAPTwoWayQueue;
export type QueueType = typeof SWAPTwoWayQueue;
