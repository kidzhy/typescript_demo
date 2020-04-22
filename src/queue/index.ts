interface queue {
  count: number;
  lowestCount: number;
}

class Queue implements queue {
  public count: number;
  public lowestCount: number;
  private items: Object;
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  // 添加元素
  enqueue(element: any) {
    this.items[this.count] = element;
    this.count++;
  }
  //移除元素
  dequeue() {
    if (this.ieEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }
  peek() {
    if (this.ieEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }
  ieEmpty(): boolean {
    return this.count - this.lowestCount === 0;
  }
  size(): number {
    return this.count - this.lowestCount;
  }
  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
  toString(): string {
    if (this.ieEmpty()) {
      return "";
    }
    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
}

//创建队列
let queue: Queue;
document.getElementById("abtn").onclick = function () {
  queue = new Queue();
  console.log(queue);
};

document.getElementById("bbtn").onclick = function () {
  const b = document.querySelector("#b");
  if (queue) {
    queue.enqueue("hello");
    queue.enqueue("world");
    console.log(queue);
    b.innerHTML = queue.toString();
  }
};

document.getElementById("cbtn").onclick = function () {
  const b = document.querySelector("#c");
  if (queue) {
    console.log(queue.size());
    b.innerHTML = (queue.size() as any) as string;
  }
};
document.getElementById("dbtn1").onclick = function () {
  if (queue) {
    alert(queue.ieEmpty());
  }
};
document.getElementById("dbtn2").onclick = function () {
  if (queue) {
    alert(queue.dequeue());
  }
};
document.getElementById("ebtn").onclick = function () {
  if (queue) {
    document.querySelector("#e").innerHTML = queue.toString();
  }
};
