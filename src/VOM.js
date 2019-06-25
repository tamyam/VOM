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
  const VOM = root.VOM = function(selector) {
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
    const args = temp.filter.call(array, function(x) {
      const returnBool = !~temp.indexOf(x);
      if(returnBool) temp.push(x);
      return returnBool;
    });
    this.length = args.length;
    switch(this.length) {
      case 0:
        break;
      case 1:
        this[0] = args[0];
        break;
      default:
        (function() {
          for(let i = 0; i < this.length; i++) {
            this[i] = args[i];
          }
        }).bind(this)();
        break;
    }
    this.tag = this[0] ? this[0].tagName : undef;
  };

  // VOM.fn
  function allCall(func, self) {
    for(let i = 0; i < self.length; i++) {
      func(self[i]);
    }
  }

  VOM.fn = VOMO.prototype = {
    constructor: VOM,

    find: function(selector) {
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
    findClass: function(selector) {
      let array = [];
      allCall(function(el) {
        array.push.apply(array, el.getElementsByClassName(selector));
      }, this);
      return new VOMO(array);
    },
    findTag: function(selector, namespace) {
      let array = [];
      allCall(function(el) {
        array.push.apply(array, namespace == null ? el.getElementsByTagName(selector) : el.getElementsByTagNameNS(namespace, selector));
      }, this);
      return new VOMO(array);
    },
    findQuery: function(selector) {
      let array = [];
      allCall(function(el) {
        array.push.apply(array, el.querySelectorAll(selector));
      }, this);
      return new VOMO(array);
    },
    attr: function(name, value) {
      if(value == null) {
        if(name.constructor === String) {
          if(this[0] ? this[0].hasAttribute(name) : undef) {
            return this[0] ? this[0].getAttribute(name) : undef;
          }
        } else {
          for(let key in name) {
            if(name.hasOwnProperty(key)) {
              const val = name[key];
              allCall(function(el) {
                el.setAttribute(key, val);
              }, this);
            }
          }
        }
      } else {
        allCall(function(el) {
          el.setAttribute(name, value);
        }, this);
      }
      return this;
    },
    html: function(val) {
      if(val == null) {
        return this.innerHTML;
      } else {
        this.innerHTML = val;
        return this;
      }
    },
    val: function(val) {
      if(val == null) {
        return this.value;
      } else {
        this.value = val;
        return this;
      }
    },
    // EventListener
    on: function(type, listener, options) {
      allCall(function(el) {
        const array = type.split(" ");
        array.forEach(function(typ) {
          el.addEventListener(typ, listener, options);
        });
      }, this);
      return this;
    },
    off: function(type, listener, options) {
      allCall(function(el) {
        const array = type.split(" ");
        array.forEach(function(typ) {
          el.removeEventListener(typ, listener, options);
        });
      }, this);
      return this;
    },
    // class
    addClass: function() {
      const args = arguments;
      allCall(function(el) {
        el.classList.add.apply(el.classList, args);
      }, this);
      return this;
    },
    removeClass: function() {
      const args = arguments;
      allCall(function(el) {
        el.classList.remove.apply(el.classList, args);
      }, this);
      return this;
    },
    hasClass: function(classname) {
      let hasClass = false;
      allCall(function(el) {
        hasClass = el.classList.contains(classname) || hasClass;
      }, this);
      return hasClass;
    },
    toggleClass: function() {
      const args = arguments;
      allCall(function(el) {
        el.classList.toggle.apply(el.classList, args);
      }, this);
      return this;
    },
    // CSS
    css: function(name, value) {
      if(value == null) {
        if(typeof name === "object" && name != null) {
          for(let key in name) {
            if(name.hasOwnProperty(key)) {
              const val = name[key];
              allCall(function(el) {
                el.style.setProperty(key, val);
              }, this);
            }
          }
          return this;
        } else {
          return (this[0] || {}).style.getPropertyValue(name);
        }
      } else {
        allCall(function(el) {
          el.style.setProperty(name, value);
        }, this);
      }
      return this;
    },
    index: function(i) {
      return new VOMO([this[i]]);
    },
    append: function() {
      const args = arguments;
      allCall(function(el) {
        for(let i = 0; i < args.length; i++) {
          for(let j = 0; j < args[i].length; j++) {
            el.appendChild(args[i][j].cloneNode(true));
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    prepend: function() {
      const args = arguments;
      allCall(function(el) {
        for(let i = 0; i < args.length; i++) {
          for(let j = 0; j < args[i].length; j++) {
            el.insertBefore(args[i][j].cloneNode(true), el.firstElementChild);
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    parent: function() {
      let array = [];
      allCall(function(el) {
        array.push(el.parentNode);
      }, this);
      return new VOMO(array);
    },
    remove: function() {
      allCall(function(el) {
        const parent = el.parentNode;
        if(parent != null) parent.removeChild(el);
      }, this);
    }
  };
  const attrs = ["innerHTML", "value", "className"];
  attrs.forEach(function(attr) {
    Object.defineProperty(VOM.fn, attr, {
      get: function() {
        return this[0] ? this[0][attr] : undef;
      },
      set: function(val) {
        allCall(function(el) {
          el[attr] = val;
        }, this);
      }
    });
  });

  // ArrayMethod
  const arrayMethods = ["forEach", "pop", "push", "reverse", "shift", "unshift"];
  arrayMethods.forEach(function(method) {
    VOM.fn[method] = Array.prototype[method];
  });

  // fn
  const fn = {
    // elem
    id: function(selector) {
      const el = document.getElementById(selector);
      return el == null ? new VOMO([]) : new VOMO([el]);
    },
    class: function(selector) {
      const els = document.getElementsByClassName(selector);
      return new VOMO(els);
    },
    name: function(selector) {
      const els = document.getElementsByName(selector);
      return new VOMO(els);
    },
    tag: function(selector, namespace) {
      const els = namespace == null ? document.getElementsByTagName(selector) : document.getElementsByTagNameNS(namespace, selector);
      return new VOMO(els);
    },
    query: function(selector) {
      const els = document.querySelectorAll(selector);
      return new VOMO(els);
    },
    createElem: function(tag, namespace) {
      return new VOMO([namespace == null ? document.createElement(tag) : document.createElementNS(namespace, tag)]);
    },
    createText: function(text) {
      return new VOMO([document.createTextNode(text)]);
    },
    // object
    type: function(obj) {
      if(typeof obj === "number" && obj !== obj) {
        return "NaN";
      } else if(Array.isArray(obj)) {
        return "Array";
      } else {
        return Object.prototype.toString.call(obj).slice(8, -1);
      }
    },
    clone: function(obj) {
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
