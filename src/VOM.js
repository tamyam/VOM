/*!
 * VOM JavaScript Library
 * https://github.com/tamyam/VOM/
 *
 * Copyright (c) 2019 tamyam
 * Released under the MIT license
 * https://github.com/tamyam/VOM/blob/master/LICENSE
 */

;((root, document, undef) => {
  // VOM selector
  const VOM = root.VOM = selector => {
    const match = selector.match(/^([#.]?)([A-Za-z](?:\w|\\[^ ])+)$/);
    const selectorNames = {
      "#": "id",
      ".": "class",
      "": "tag"
    };
    if(match != null) {
      return VOM[
        selectorNames[
          match[1]
        ]
      ](match[2]);
    } else {
      return VOM.query(selector);
    }
  };

  // VOMObject
  const VOMO = root.VOMO = function(array) {
    let temp = [];
    const args = temp.filter.call(array, x => {
      const returnBool = !~temp.indexOf(x) && x != null;
      if(returnBool) temp.push(x);
      return returnBool;
    });
    this.length = args.length;
    if(this.length !== 0) {
      if(this.length === 1) {
        this[0] = args[0];
      } else {
        for(let i = 0; i < this.length; i++) {
          this[i] = args[i];
        }
      }
      this.tag = this[0] ? this[0].tagName : undef;
    }
  };

  // VOM.fn
  const allCall = (func, self) => {
    for(let i = 0; i < self.length; i++) {
      func(self[i]);
    }
  };

  VOM.fn = VOMO.prototype = {
    constructor: VOM,

    find(selector) {
      const match = selector.match(/^(\.?)([A-Za-z](?:\w|\\[^ ])+)$/);
      const selectorNames = {
        ".": "findClass",
        "": "findTag"
      };
      if(match != null) {
        return this[
          selectorNames[
            match[1]
          ]
        ](match[2]);
      } else {
        return this.findQuery(selector);
      }
    },
    findClass(selector) {
      let array = [];
      allCall(el => {
        array.push.apply(array, el.getElementsByClassName(selector));
      }, this);
      return new VOMO(array);
    },
    findTag(selector, namespace) {
      let array = [];
      allCall(el => {
        array.push.apply(array, namespace == null ? el.getElementsByTagName(selector) : el.getElementsByTagNameNS(namespace, selector));
      }, this);
      return new VOMO(array);
    },
    findQuery(selector) {
      let array = [];
      allCall(el => {
        array.push.apply(array, el.querySelectorAll(selector));
      }, this);
      return new VOMO(array);
    },
    attr(name, value) {
      if(value == null) {
        if(name.constructor === String) {
          if(this[0] ? this[0].hasAttribute(name) : undef) {
            return this[0] ? this[0].getAttribute(name) : undef;
          }
        } else {
          for(let key in name) {
            if(name.hasOwnProperty(key)) {
              const val = name[key];
              allCall(el => {
                el.setAttribute(key, val);
              }, this);
            }
          }
        }
      } else {
        allCall(el => {
          el.setAttribute(name, value);
        }, this);
      }
      return this;
    },
    html(val) {
      if(val == null) {
        return this.innerHTML;
      } else {
        this.innerHTML = val;
        return this;
      }
    },
    val(val) {
      if(val == null) {
        return this.value;
      } else {
        this.value = val;
        return this;
      }
    },
    // EventListener
    on(types, listener, options) {
      allCall(el => {
        const array = types.split(" ");
        array.forEach(type => {
          el.addEventListener(type, listener, options);
        });
      }, this);
      return this;
    },
    off(types, listener, options) {
      allCall(el => {
        const array = types.split(" ");
        array.forEach(type => {
          el.removeEventListener(type, listener, options);
        });
      }, this);
      return this;
    },
    // class
    addClass() {
      const args = arguments;
      allCall(el => {
        el.classList.add.apply(el.classList, args);
      }, this);
      return this;
    },
    removeClass() {
      const args = arguments;
      allCall(el => {
        el.classList.remove.apply(el.classList, args);
      }, this);
      return this;
    },
    hasClass(classname) {
      let hasClass = false;
      allCall(el => {
        hasClass = el.classList.contains(classname) || hasClass;
      }, this);
      return hasClass;
    },
    toggleClass() {
      const args = arguments;
      allCall(el => {
        el.classList.toggle.apply(el.classList, args);
      }, this);
      return this;
    },
    // CSS
    css(name, value) {
      if(value == null) {
        if(typeof name === "object" && name != null) {
          for(let key in name) {
            if(name.hasOwnProperty(key)) {
              const val = name[key];
              allCall(el => {
                el.style.setProperty(key, val);
              }, this);
            }
          }
          return this;
        } else {
          return (this[0] || {}).style.getPropertyValue(name);
        }
      } else {
        allCall(el => {
          el.style.setProperty(name, value);
        }, this);
      }
      return this;
    },
    index(i) {
      return new VOMO([this[i]]);
    },
    append() {
      const args = arguments;
      allCall(el => {
        for(let i = 0; i < args.length; i++) {
          for(let j = 0; j < args[i].length; j++) {
            el.appendChild(args[i][j].cloneNode(true));
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    prepend() {
      const args = arguments;
      allCall(el => {
        for(let i = 0; i < args.length; i++) {
          for(let j = 0; j < args[i].length; j++) {
            el.insertBefore(args[i][j].cloneNode(true), el.firstElementChild);
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    parent() {
      let array = [];
      allCall(el => {
        array.push(el.parentNode);
      }, this);
      return new VOMO(array);
    },
    remove() {
      allCall(el => {
        const parent = el.parentNode;
        if(parent != null) parent.removeChild(el);
      }, this);
    }
  };
  const attrs = ["innerHTML", "value", "className"];
  attrs.forEach(attr => {
    Object.defineProperty(VOM.fn, attr, {
      get() {
        return this[0] ? this[0][attr] : undef;
      },
      set(val) {
        allCall(el => {
          el[attr] = val;
        }, this);
      }
    });
  });

  // ArrayMethod
  const arrayMethods = ["forEach", "pop", "push", "reverse", "shift", "unshift"];
  arrayMethods.forEach(method => {
    VOM.fn[method] = Array.prototype[method];
  });

  // fn
  const fn = {
    // elem
    id(selector) {
      const el = document.getElementById(selector);
      return el == null ? new VOMO([]) : new VOMO([el]);
    },
    class(selector) {
      const els = document.getElementsByClassName(selector);
      return new VOMO(els);
    },
    name(selector) {
      const els = document.getElementsByName(selector);
      return new VOMO(els);
    },
    tag(selector, namespace) {
      const els = namespace == null ? document.getElementsByTagName(selector) : document.getElementsByTagNameNS(namespace, selector);
      return new VOMO(els);
    },
    query(selector) {
      const els = document.querySelectorAll(selector);
      return new VOMO(els);
    },
    createElem(tag, namespace) {
      return new VOMO([namespace == null ? document.createElement(tag) : document.createElementNS(namespace, tag)]);
    },
    createText(text) {
      return new VOMO([document.createTextNode(text)]);
    },
    // object
    type(obj) {
      if(typeof obj === "number" && obj !== obj) {
        return "NaN";
      } else if(Array.isArray(obj)) {
        return "Array";
      } else {
        return Object.prototype.toString.call(obj).slice(8, -1);
      }
    },
    clone(obj) {
      let r = {};
      for(let name in obj) {
        if(typeof obj[name] === "object" && obj[name] != null) {
          r[name] = fn.clone(obj[name]);
        } else {
          r[name] = obj[name];
        }
      }
      return r;
    }
  };
  for(let key in fn) {
    if(fn.hasOwnProperty(key)) {
      VOM[key] = fn[key];
    }
  }
})(this, document);
