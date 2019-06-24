/*!
 * VOM JavaScript Library
 * https://github.com/tamyam/VOM/
 *
 * Copyright (c) 2019 tamyam
 * Released under the MIT license
 * https://github.com/tamyam/VOM/LICENSE
 */

;(function(root, undef) {
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
  var VOMO = root.VOMO = function() {
    var temp = [];
    var args = temp.filter.call(arguments, function(x) {
      var returnBool = !~temp.indexOf(x);
      if(returnBool) temp.push(x);
      return returnBool;
    });
    this.length = args.length;
    switch(args.length) {
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
        })();
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
})(this);
