/*!
 * VOM JavaScript Library
 * https://github.com/tamyam/VOM/
 *
 * Copyright (c) 2019 tamyam
 * Released under the MIT license
 * https://github.com/tamyam/VOM/LICENSE
 */

;(function(root, document, undef) {
  // VOM selector
  var VOM = root.VOM = function(selector) {
    var match = selector.match(/^([#.]?)([A-Za-z](?:\w|\\[^ ])+)$/);
    var selectorNames = {
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
  var VOMO = root.VOMO = function(array) {
    var temp = [];
    var args = temp.filter.call(array, function(x) {
      var returnBool = !~temp.indexOf(x);
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
          for(var i = 0; i < this.length; i++) {
            this[i] = args[i];
          }
        }).bind(this)();
        break;
    }
    this.tag = this[0] ? this[0].tagName : undef;
  };

  // VOM.fn
  function allCall(func, self) {
    for(var i = 0; i < self.length; i++) {
      func(self[i]);
    }
  }

  VOM.fn = VOMO.prototype = {
    constructor: VOM,

    attr: function(name, value) {
      if(value == null) {
        if(name.constructor === String) {
          if(this[0] ? this[0].hasAttribute(name) : undef) {
            return this[0] ? this[0].getAttribute(name) : undef;
          }
        } else {
          for(var key in name) {
            if(name.hasOwnProperty(key)) {
              var val = name[key];
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
        var array = type.split(" ");
        array.forEach(function(typ) {
          el.addEventListener(typ, listener, options);
        });
      }, this);
      return this;
    },
    off: function(type, listener, options) {
      allCall(function(el) {
        var array = type.split(" ");
        array.forEach(function(typ) {
          el.removeEventListener(typ, listener, options);
        });
      }, this);
      return this;
    },
    // class
    addClass: function() {
      var args = arguments;
      allCall(function(el) {
        el.classList.add.apply(el.classList, args);
      }, this);
      return this;
    },
    removeClass: function() {
      var args = arguments;
      allCall(function(el) {
        el.classList.remove.apply(el.classList, args);
      }, this);
      return this;
    },
    hasClass: function(classname) {
      var hasClass = false;
      allCall(function(el) {
        hasClass = el.classList.contains(classname) || hasClass;
      }, this);
      return hasClass;
    },
    toggleClass: function() {
      var args = arguments;
      allCall(function(el) {
        el.classList.toggle.apply(el.classList, args);
      }, this);
      return this;
    },
    // CSS
    css: function(name, value) {
      if(value == null) {
        if(typeof name === "object" && name != null) {
          for(var key in name) {
            if(name.hasOwnProperty(key)) {
              var val = name[key];
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
      var args = arguments;
      allCall(function(el) {
        for(var i = 0; i < args.length; i++) {
          for(var j = 0; j < args[i].length; j++) {
            el.appendChild(args[i][j].cloneNode(true));
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    prepend: function() {
      var args = arguments;
      allCall(function(el) {
        for(var i = 0; i < args.length; i++) {
          for(var j = 0; j < args[i].length; j++) {
            el.insertBefore(args[i][j].cloneNode(true), el.firstElementChild);
          }
          if(i === 0) args[i].remove();
        }
      }, this);
      return this;
    },
    parent: function() {
      var array = [];
      allCall(function(el) {
        array.push(el.parentNode);
      }, this);
      return new VOMO(array);
    },
    remove: function() {
      allCall(function(el) {
        var parent = el.parentNode;
        if(parent != null) parent.removeChild(el);
      }, this);
    }
  };
  var attrs = ["innerHTML", "value", "className"];
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

  // fn
  var fn = {
    // elem
    id: function(selector) {
      var el = document.getElementById(selector);
      return el == null ? new VOMO([]) : new VOMO([el]);
    },
    class: function(selector) {
      var els = document.getElementsByClassName(selector);
      return new VOMO(els);
    },
    name: function(selector) {
      var els = document.getElementsByName(selector);
      return new VOMO(els);
    },
    tag: function(selector) {
      var els = document.getElementsByTagName(selector);
      return new VOMO(els);
    },
    query: function(selector) {
      var els = document.querySelectorAll(selector);
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
    }
  };
  for(var key in fn) {
    if(fn.hasOwnProperty(key)) {
      VOM[key] = fn[key];
    }
  }
})(this, document);
