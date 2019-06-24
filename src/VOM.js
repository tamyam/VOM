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
    }
  };
  for(var key in fn) {
    if(fn.hasOwnProperty(key)) {
      VOM[key] = fn[key];
    }
  }
})(this, document);
