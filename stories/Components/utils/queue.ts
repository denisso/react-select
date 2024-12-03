class Queue<T> {
  private queue: (T | null)[];
  private head: number;
  private tail: number;
  private readonly compactThreshold: number;

  constructor() {
    this.queue = [];
    this.head = 0;
    this.tail = 0;
    this.compactThreshold = 1000;
  }

  enqueue(value: T): number {
    this.queue[this.tail] = value;
    const indx = this.tail;
    this.tail++;
    return indx;
  }

  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const value = this.queue[this.head];
    this.queue[this.head] = null; // Пометка для избежания утечек памяти
    this.head++;

    if (this.head >= this.compactThreshold) {
      this.compact();
    }
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
  swapByIndex(index: number): T | null {
    if (this.isEmpty() || index < this.head || index >= this.tail) return null;
    if (index === this.head) return this.dequeue();
    const value = this.queue[index];
    this.queue[index] = this.dequeue();
    return value;
  }

  private compact(): void {
    this.queue = this.queue.slice(this.head, this.tail);
    this.tail = this.tail - this.head;
    this.head = 0;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.queue[this.head];
  }

  isEmpty(): boolean {
    return this.head === this.tail;
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
export default Queue;
export type QueueType = typeof Queue;
// Usage example
// const queue = new Queue<number>();
// queue.enqueue(1);
// queue.enqueue(2);
// queue.enqueue(3);
// queue.extractByIndex(1);

// for (
//   let iterator = queue[Symbol.iterator](), result = iterator.next();
//   !result.done;
//   result = iterator.next()
// ) {
//   console.log(result.value);
//   result = iterator.next();
// }
