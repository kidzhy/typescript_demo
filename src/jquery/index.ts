//定义类型
type $dom = string | DomElement | HTMLElement | NodeList;
//出现了个错误，类不能继承接口，可以改成类
interface Jquery {
  length: number;
  selector: $dom;
  [index: number]: HTMLElement;
}
interface eachFun {
  (item: HTMLElement, index: number): void;
}
//监听事件
interface handleEvent {
  (evt: Event): void;
}
//事件代理类型
interface event {
  /**
   * type 事件名
   * fn 方法
   */
  type: string;
  fn: handleEvent;
}
const Events: WeakMap<HTMLElement, event> = new Map();
//备注：this[index]未做提示，增加接口描述即可
class DomElement implements Jquery {
  public selector: $dom;
  public length: number;
  [index: number]: HTMLElement;
  constructor(selector: $dom) {
    if (!selector) {
      return;
    }
    if (selector instanceof DomElement) {
      return selector;
    }
    this.selector = selector;
    let nodeType;
    if (selector instanceof HTMLElement) {
      nodeType = selector.nodeType;
    }
    let selectorArr: HTMLElement[] = [];
    if (nodeType === 9 || nodeType === 1) {
      //documnet类型
      selectorArr = [selector as HTMLElement];
    } else if (selector instanceof NodeList) {
      selectorArr = Array.prototype.slice.apply(selector);
    } else if (typeof selector === "string") {
      //字符串情况下
      //如果是创建情况下
      if (selector.indexOf("<") === 0) {
        //创建元素
        let div: HTMLDivElement = document.createElement("div");
        div.innerHTML = selector;
        selectorArr = Array.prototype.slice.apply(div.childNodes);
        div = null;
      } else {
        //查找元素
        selectorArr = Array.prototype.slice.apply(
          document.querySelectorAll(selector)
        );
      }
      this.length = selectorArr.length;
      if (!this.length) {
        return this;
      }
      for (let i = 0; i < this.length; i++) {
        this[i] = selectorArr[i];
      }
    }
  }
  each(fn: eachFun) {
    for (let i = 0; i < this.length; i++) {
      const elem: Element = this[i];
      fn.apply(elem, [elem, i]);
    }
  }
  /**
   * 设置或者传参
   */
  attr(key: string, val?: string): string | DomElement {
    if (!val) {
      return this[0].getAttribute(key);
    } else {
      this.each(item => {
        item.setAttribute(key, val);
      });
      return this;
    }
  }
  /**
   * 设置样式
   */
  addClass(className: string): DomElement {
    this.each(item => {
      item.classList.add(className);
    });
    return this;
  }
  removeClass(className: string): DomElement {
    this.each(item => {
      item.classList.remove(className);
    });
    return this;
  }
  /**
   * 设置style
   */
  css(key: string | object, value?: string) {
    if (typeof key === "string") {
      //如果是键值对
      this.each(item => {
        item.style[key] = value;
      });
    } else {
      //如果是对象,//简单处理
      this.each(it => {
        for (let item in key) {
          it.style[item] = key[item];
        }
      });
    }
    return this;
  }
  /**
   * 隐藏or消失
   */
  show() {
    this.css("display", "block");
  }
  hide() {
    this.css("display", "none");
  }
  /**
   * 实现html，text 方法
   */
  html(text?: string) {
    if (!text) {
      return this[0].innerHTML;
    }
    this[0].innerHTML = text;
    return this;
  }
  text(text?: string) {
    if (!text) {
      return this[0].innerText;
    }
    this[0].innerText = text;
    return this;
  }
  /**
   * 绑定事件,事件代理另说
   */
  on(handle: string, fn: handleEvent) {
    this.each(item => {
      Events.set(item, {
        type: handle,
        fn: fn
      });
      item.addEventListener(handle, fn, false);
    });
  }
  unbind(handle: string) {
    this.each(item => {
      if (Events.has(item)) {
        const obj = Events.get(item);
        if (obj.type === handle) {
          item.removeEventListener(obj.type, obj.fn, false);
        }
      }
    });
  }
}

function $(dom: $dom) {
  return new DomElement(dom);
}

window.$ = $;
