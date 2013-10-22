/*


  Mink.js


            A Minimalistic DOM Library for Mobile Webkit


by Eddie Flores
http://github.com/eddflrs/mink.js


 */

/*global window */
/*jslint browser: true */


(function (window, Hammer) {
  'use strict';
  var fn, mink, minkify,
    ajaxDefaults = {
      type: 'GET',
      beforeSend: noop,
      success: noop,
      error: noop,
      complete: noop,
      context: null,
      global: true
    };

  function hasClass (elem, klass) {
    var regex = new RegExp('(\\s|^)' + klass + '(\\s|$)');
    return elem.className.match(regex);
  }

  function noop () { }

  /* Functions attached to the query result's prototype. */
  fn = {
    forEach: Array.prototype.forEach,
    splice: Array.prototype.splice,
    concat: Array.prototype.concat,

    on: function (eventName, cb) {
      var i = 0, len = this.length, elem;
      for (i; i < len; i++) {
        elem = this[i];
        if (!Hammer) {
          elem.addEventListener.call(elem, eventName, cb);
        } else {
          Hammer(elem).on(eventName, cb);
        }
      }
    },

    off: function (eventName, cb) {
      var i = 0, len = this.length, elem;
      for (i, i < len; i++) {
        elem = this[i];
        if (!Hammer) {
          elem.removeEventListener.call(elem, eventName, cb);
        } else {
          Hammer(elem).off(eventName, cb);
        }
      }
    },

    serializeArray: function () {
      // TODO return a json representation of a form.
    },

    hide: function () {
      this.forEach(function (elem) {
        elem.style.display = 'none';
      });
    },

    show: function (displayAs) {
      var display = displayAs || 'block';
      this.forEach(function (elem) {
        elem.style.display = display;
      });
    },

    append: function (elems) {
      var self = this;
      this.forEach(function (elem) {
        elems.forEach(function (child) {
          elem.appendChild(child);
        });
      });
    },

    remove: function () {
      var removedElems = [];
      this.forEach(function (elem) {
        removedElems.push(elem.parentNode.removeChild(elem));
      });
      removedElems.__proto__ = fn;
      return removedElems;
    },

    addClass: function (klass) {
      this.forEach(function (elem) {
        elem.className += " " + klass;
      });
    },

    removeClass: function (klass) {
      var self = this;
      this.forEach(function (elem) {
        if (klass === '*') {
          elem.className = '';
          return;
        }

        if (!self.hasClass(elem, klass)) {
          return;
        }

        var regex = new RegExp('(\\s|^)' + klass + '(\\s|$)');
        elem.className = elem.className.replace(regex, ' ');
      });
    },

    ajax: function (opts) {
      var xhr = new window.XMLHttpRequest();
      var readyStates = {
        UNSENT: 0,
        OPENED: 1,
        SENT: 2,
        LOADING: 3,
        COMPLETE: 4
      };

      if (xhr.readyState === readyStates.COMPLETE) {
        xhr.onreadystatechange = function () {
          if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

          }
        };
      }
    }
  };

  minkify = function (obj) {
    var newObj = [];
    newObj.push(obj);
    newObj.__proto__ = fn;
    return newObj;
  };

  /* @public
   * Traverses the DOM and returns a NodeList that matches the selector.
   * @param Selector <String>
   * @return <NodeList> with mink functions attached to prototype.
   */
  mink = function (selector) {
    var query;

    if (typeof selector === 'object') {
      return minkify(selector);
    }

    if (typeof document.querySelectorAll !== 'undefined') {
      query = document.querySelectorAll;
    } else {
      query = mink.selectorFallback;
    }

    var result = query.call(document, selector);
    result.__proto__ = fn;
    return result;
  };

  mink.getById = function (id) {
    return document.getElementById.call(document, id);
  };

  mink.getByClass = function (className) {
    return document.getElementByClassName.call(document, className);
  };

  mink.selectorFallback = function (selector) {
    if (typeof selector !== 'string') {
      throw new Error('The selector must be a string');
    }

    var firstChar = selector.charAt(0), identifier = selector.substr(1), result;

    if (firstChar === '#') {
      result = mink.getById(identifier);
    } else if (firstChar === '.') {
      result = mink.getByClass(identifier);
    } else {
      throw new Error('Only id and class selectors are supported.');
    }
    return result;
  };


  window.mink = mink;


}(window, Hammer));