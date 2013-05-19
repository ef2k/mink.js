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
  var fn, mink;

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
          elem.addEventListener(eventName, cb);
        } else {
          Hammer(elem).on(eventName, cb);
        }
      }
    },

    serializeArray: function (elem) {
      // TODO return a json representation of a form.
    },

    hasClass: function (elem, klass) {
      var regex = new RegExp('(\\s|^)' + klass + '(\\s|$)');
      return elem.className.match(regex);
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
    }
  };

  /* @public
   * Traverses the DOM and returns a NodeList that matches the selector.
   * @param Selector <String>
   * @return <NodeList> with an <Array> prototype.
   */
  mink = function (selector) {
    var query;
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