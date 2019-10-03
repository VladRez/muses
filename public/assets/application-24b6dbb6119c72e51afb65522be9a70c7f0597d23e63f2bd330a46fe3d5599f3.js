/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var nonce;

      nonce = null;

      Rails.loadCSPNonce = function() {
        var ref;
        return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
      };

      Rails.cspNonce = function() {
        return nonce != null ? nonce : Rails.loadCSPNonce();
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.preventInsignificantClick = function(e) {
        var data, insignificantMetaClick, link, metaClick, method, primaryMouseKey;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        insignificantMetaClick = metaClick && method === 'GET' && !data;
        primaryMouseKey = e.button === 0;
        if (!primaryMouseKey || insignificantMetaClick) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        document.addEventListener('DOMContentLoaded', loadCSPNonce);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActiveStorage = {});
})(this, function(exports) {
  "use strict";
  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var sparkMd5 = createCommonjsModule(function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined) {
      var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex) {
        var bytes = [], length = hex.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD5() {
        this.reset();
      }
      SparkMD5.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD5.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD5.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash
        };
      };
      SparkMD5.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD5.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD5.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD5.hash = function(str, raw) {
        return SparkMD5.hashBinary(toUtf8(str), raw);
      };
      SparkMD5.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD5.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD5.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD5.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD5.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD5.prototype.setState.call(this, state);
      };
      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
      SparkMD5.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD5;
    });
  });
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = function() {
    createClass(FileChecksum, null, [ {
      key: "create",
      value: function create(file, callback) {
        var instance = new FileChecksum(file);
        instance.create(callback);
      }
    } ]);
    function FileChecksum(file) {
      classCallCheck(this, FileChecksum);
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    createClass(FileChecksum, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        this.callback = callback;
        this.md5Buffer = new sparkMd5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.fileReader.addEventListener("load", function(event) {
          return _this.fileReaderDidLoad(event);
        });
        this.fileReader.addEventListener("error", function(event) {
          return _this.fileReaderDidError(event);
        });
        this.readNextChunk();
      }
    }, {
      key: "fileReaderDidLoad",
      value: function fileReaderDidLoad(event) {
        this.md5Buffer.append(event.target.result);
        if (!this.readNextChunk()) {
          var binaryDigest = this.md5Buffer.end(true);
          var base64digest = btoa(binaryDigest);
          this.callback(null, base64digest);
        }
      }
    }, {
      key: "fileReaderDidError",
      value: function fileReaderDidError(event) {
        this.callback("Error reading " + this.file.name);
      }
    }, {
      key: "readNextChunk",
      value: function readNextChunk() {
        if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
          var start = this.chunkIndex * this.chunkSize;
          var end = Math.min(start + this.chunkSize, this.file.size);
          var bytes = fileSlice.call(this.file, start, end);
          this.fileReader.readAsArrayBuffer(bytes);
          this.chunkIndex++;
          return true;
        } else {
          return false;
        }
      }
    } ]);
    return FileChecksum;
  }();
  function getMetaValue(name) {
    var element = findElement(document.head, 'meta[name="' + name + '"]');
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    var elements = root.querySelectorAll(selector);
    return toArray$1(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent(element, type) {
    var eventInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var disabled = element.disabled;
    var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
    var event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray$1(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = function() {
    function BlobRecord(file, checksum, url) {
      var _this = this;
      classCallCheck(this, BlobRecord);
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type,
        byte_size: file.size,
        checksum: checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.xhr.setRequestHeader("X-CSRF-Token", getMetaValue("csrf-token"));
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobRecord, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(JSON.stringify({
          blob: this.attributes
        }));
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        if (this.status >= 200 && this.status < 300) {
          var response = this.response;
          var direct_upload = response.direct_upload;
          delete response.direct_upload;
          this.attributes = response;
          this.directUploadData = direct_upload;
          this.callback(null, this.toJSON());
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var result = {};
        for (var key in this.attributes) {
          result[key] = this.attributes[key];
        }
        return result;
      }
    }, {
      key: "status",
      get: function get$$1() {
        return this.xhr.status;
      }
    }, {
      key: "response",
      get: function get$$1() {
        var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
        if (responseType == "json") {
          return response;
        } else {
          return JSON.parse(response);
        }
      }
    } ]);
    return BlobRecord;
  }();
  var BlobUpload = function() {
    function BlobUpload(blob) {
      var _this = this;
      classCallCheck(this, BlobUpload);
      this.blob = blob;
      this.file = blob.file;
      var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (var key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobUpload, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(this.file.slice());
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
        if (status >= 200 && status < 300) {
          this.callback(null, response);
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
      }
    } ]);
    return BlobUpload;
  }();
  var id = 0;
  var DirectUpload = function() {
    function DirectUpload(file, url, delegate) {
      classCallCheck(this, DirectUpload);
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
    }
    createClass(DirectUpload, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        FileChecksum.create(this.file, function(error, checksum) {
          if (error) {
            callback(error);
            return;
          }
          var blob = new BlobRecord(_this.file, checksum, _this.url);
          notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
          blob.create(function(error) {
            if (error) {
              callback(error);
            } else {
              var upload = new BlobUpload(blob);
              notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
              upload.create(function(error) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, blob.toJSON());
                }
              });
            }
          });
        });
      }
    } ]);
    return DirectUpload;
  }();
  function notify(object, methodName) {
    if (object && typeof object[methodName] == "function") {
      for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        messages[_key - 2] = arguments[_key];
      }
      return object[methodName].apply(object, messages);
    }
  }
  var DirectUploadController = function() {
    function DirectUploadController(input, file) {
      classCallCheck(this, DirectUploadController);
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    createClass(DirectUploadController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = this.input.name;
        this.input.insertAdjacentElement("beforebegin", hiddenInput);
        this.dispatch("start");
        this.directUpload.create(function(error, attributes) {
          if (error) {
            hiddenInput.parentNode.removeChild(hiddenInput);
            _this.dispatchError(error);
          } else {
            hiddenInput.value = attributes.signed_id;
          }
          _this.dispatch("end");
          callback(error);
        });
      }
    }, {
      key: "uploadRequestDidProgress",
      value: function uploadRequestDidProgress(event) {
        var progress = event.loaded / event.total * 100;
        if (progress) {
          this.dispatch("progress", {
            progress: progress
          });
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        detail.file = this.file;
        detail.id = this.directUpload.id;
        return dispatchEvent(this.input, "direct-upload:" + name, {
          detail: detail
        });
      }
    }, {
      key: "dispatchError",
      value: function dispatchError(error) {
        var event = this.dispatch("error", {
          error: error
        });
        if (!event.defaultPrevented) {
          alert(error);
        }
      }
    }, {
      key: "directUploadWillCreateBlobWithXHR",
      value: function directUploadWillCreateBlobWithXHR(xhr) {
        this.dispatch("before-blob-request", {
          xhr: xhr
        });
      }
    }, {
      key: "directUploadWillStoreFileWithXHR",
      value: function directUploadWillStoreFileWithXHR(xhr) {
        var _this2 = this;
        this.dispatch("before-storage-request", {
          xhr: xhr
        });
        xhr.upload.addEventListener("progress", function(event) {
          return _this2.uploadRequestDidProgress(event);
        });
      }
    }, {
      key: "url",
      get: function get$$1() {
        return this.input.getAttribute("data-direct-upload-url");
      }
    } ]);
    return DirectUploadController;
  }();
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = function() {
    function DirectUploadsController(form) {
      classCallCheck(this, DirectUploadsController);
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(function(input) {
        return input.files.length;
      });
    }
    createClass(DirectUploadsController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var controllers = this.createDirectUploadControllers();
        var startNextController = function startNextController() {
          var controller = controllers.shift();
          if (controller) {
            controller.start(function(error) {
              if (error) {
                callback(error);
                _this.dispatch("end");
              } else {
                startNextController();
              }
            });
          } else {
            callback();
            _this.dispatch("end");
          }
        };
        this.dispatch("start");
        startNextController();
      }
    }, {
      key: "createDirectUploadControllers",
      value: function createDirectUploadControllers() {
        var controllers = [];
        this.inputs.forEach(function(input) {
          toArray$1(input.files).forEach(function(file) {
            var controller = new DirectUploadController(input, file);
            controllers.push(controller);
          });
        });
        return controllers;
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return dispatchEvent(this.form, "direct-uploads:" + name, {
          detail: detail
        });
      }
    } ]);
    return DirectUploadsController;
  }();
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    var target = event.target;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    var form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    var controller = new DirectUploadsController(form);
    var inputs = controller.inputs;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(function(error) {
        form.removeAttribute(processingAttribute);
        if (error) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      var _button = button, disabled = _button.disabled;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);
  exports.start = start;
  exports.DirectUpload = DirectUpload;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=23)}([function(e,t,n){"use strict";e.exports=n(14)},function(e,t,n){e.exports=n(18)()},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,i,a,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,i,a,u],s=0;(l=new Error(t.replace(/%s/g,(function(){return c[s++]})))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){"use strict";var r=n(5),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},u={};function l(e){return r.isMemo(e)?a:u[e.$$typeof]||o}u[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0};var c=Object.defineProperty,s=Object.getOwnPropertyNames,f=Object.getOwnPropertySymbols,p=Object.getOwnPropertyDescriptor,d=Object.getPrototypeOf,m=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(m){var o=d(n);o&&o!==m&&e(t,o,r)}var a=s(n);f&&(a=a.concat(f(n)));for(var u=l(t),h=l(n),y=0;y<a.length;++y){var v=a[y];if(!(i[v]||r&&r[v]||h&&h[v]||u&&u[v])){var b=p(n,v);try{c(t,v,b)}catch(e){}}}return t}return t}},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE){0;try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}}(),e.exports=n(15)},function(e,t,n){"use strict";e.exports=n(20)},,function(e,t,n){"use strict";(function(e,r){var o,i=n(12);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var a=Object(i.a)(o);t.a=a}).call(this,n(11),n(21)(e))},function(e,t){e.exports=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}},function(e,t,n){var r=n(22);e.exports=d,e.exports.parse=i,e.exports.compile=function(e,t){return u(i(e,t))},e.exports.tokensToFunction=u,e.exports.tokensToRegExp=p;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function i(e,t){for(var n,r=[],i=0,a=0,u="",s=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(u+=e.slice(a,d),a=d+f.length,p)u+=p[1];else{var m=e[a],h=n[2],y=n[3],v=n[4],b=n[5],g=n[6],w=n[7];u&&(r.push(u),u="");var E=null!=h&&null!=m&&m!==h,k="+"===g||"*"===g,x="?"===g||"*"===g,S=n[2]||s,_=v||b;r.push({name:y||i++,prefix:h||"",delimiter:S,optional:x,repeat:k,partial:E,asterisk:!!w,pattern:_?c(_):w?".*":"[^"+l(S)+"]+?"})}}return a<e.length&&(u+=e.substr(a)),u&&r.push(u),r}function a(e){return encodeURI(e).replace(/[\/?#]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}))}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var i="",u=n||{},l=(o||{}).pretty?a:encodeURIComponent,c=0;c<e.length;c++){var s=e[c];if("string"!=typeof s){var f,p=u[s.name];if(null==p){if(s.optional){s.partial&&(i+=s.prefix);continue}throw new TypeError('Expected "'+s.name+'" to be defined')}if(r(p)){if(!s.repeat)throw new TypeError('Expected "'+s.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(s.optional)continue;throw new TypeError('Expected "'+s.name+'" to not be empty')}for(var d=0;d<p.length;d++){if(f=l(p[d]),!t[c].test(f))throw new TypeError('Expected all "'+s.name+'" to match "'+s.pattern+'", but received `'+JSON.stringify(f)+"`");i+=(0===d?s.prefix:s.delimiter)+f}}else{if(f=s.asterisk?encodeURI(p).replace(/[?#]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})):l(p),!t[c].test(f))throw new TypeError('Expected "'+s.name+'" to match "'+s.pattern+'", but received "'+f+'"');i+=s.prefix+f}}else i+=s}return i}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function c(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function s(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,i=!1!==n.end,a="",u=0;u<e.length;u++){var c=e[u];if("string"==typeof c)a+=l(c);else{var p=l(c.prefix),d="(?:"+c.pattern+")";t.push(c),c.repeat&&(d+="(?:"+p+d+")*"),a+=d=c.optional?c.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var m=l(n.delimiter||"/"),h=a.slice(-m.length)===m;return o||(a=(h?a.slice(0,-m.length):a)+"(?:"+m+"(?=$))?"),a+=i?"$":o&&h?"":"(?="+m+"|$)",s(new RegExp("^"+a,f(n)),t)}function d(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return s(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);return s(new RegExp("(?:"+r.join("|")+")",f(n)),t)}(e,t,n):function(e,t,n){return p(i(e,n),t,n)}(e,t,n)}},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function a(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,l=a(e),c=1;c<arguments.length;c++){for(var s in n=Object(arguments[c]))o.call(n,s)&&(l[s]=n[s]);if(r){u=r(n);for(var f=0;f<u.length;f++)i.call(n,u[f])&&(l[u[f]]=n[u[f]])}}return l}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",(function(){return r}))},function(e,t,n){"use strict";(function(t){var n="__global_unique_id__";e.exports=function(){return t[n]=(t[n]||0)+1}}).call(this,n(11))},function(e,t,n){"use strict";
/** @license React v16.10.1
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(10),o="function"==typeof Symbol&&Symbol.for,i=o?Symbol.for("react.element"):60103,a=o?Symbol.for("react.portal"):60106,u=o?Symbol.for("react.fragment"):60107,l=o?Symbol.for("react.strict_mode"):60108,c=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,p=o?Symbol.for("react.forward_ref"):60112,d=o?Symbol.for("react.suspense"):60113,m=o?Symbol.for("react.suspense_list"):60120,h=o?Symbol.for("react.memo"):60115,y=o?Symbol.for("react.lazy"):60116;o&&Symbol.for("react.fundamental"),o&&Symbol.for("react.responder"),o&&Symbol.for("react.scope");var v="function"==typeof Symbol&&Symbol.iterator;function b(e){for(var t=e.message,n="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r]);return e.message="Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w={};function E(e,t,n){this.props=e,this.context=t,this.refs=w,this.updater=n||g}function k(){}function x(e,t,n){this.props=e,this.context=t,this.refs=w,this.updater=n||g}E.prototype.isReactComponent={},E.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw b(Error(85));this.updater.enqueueSetState(this,e,t,"setState")},E.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},k.prototype=E.prototype;var S=x.prototype=new k;S.constructor=x,r(S,E.prototype),S.isPureReactComponent=!0;var _={current:null},T={suspense:null},C={current:null},O=Object.prototype.hasOwnProperty,P={key:!0,ref:!0,__self:!0,__source:!0};function N(e,t,n){var r,o={},a=null,u=null;if(null!=t)for(r in void 0!==t.ref&&(u=t.ref),void 0!==t.key&&(a=""+t.key),t)O.call(t,r)&&!P.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(1===l)o.children=n;else if(1<l){for(var c=Array(l),s=0;s<l;s++)c[s]=arguments[s+2];o.children=c}if(e&&e.defaultProps)for(r in l=e.defaultProps)void 0===o[r]&&(o[r]=l[r]);return{$$typeof:i,type:e,key:a,ref:u,props:o,_owner:C.current}}function j(e){return"object"==typeof e&&null!==e&&e.$$typeof===i}var R=/\/+/g,I=[];function M(e,t,n,r){if(I.length){var o=I.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function U(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>I.length&&I.push(e)}function L(e,t,n){return null==e?0:function e(t,n,r,o){var u=typeof t;"undefined"!==u&&"boolean"!==u||(t=null);var l=!1;if(null===t)l=!0;else switch(u){case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case i:case a:l=!0}}if(l)return r(o,t,""===n?"."+z(t,0):n),1;if(l=0,n=""===n?".":n+":",Array.isArray(t))for(var c=0;c<t.length;c++){var s=n+z(u=t[c],c);l+=e(u,s,r,o)}else if(null===t||"object"!=typeof t?s=null:s="function"==typeof(s=v&&t[v]||t["@@iterator"])?s:null,"function"==typeof s)for(t=s.call(t),c=0;!(u=t.next()).done;)l+=e(u=u.value,s=n+z(u,c++),r,o);else if("object"===u)throw r=""+t,b(Error(31),"[object Object]"===r?"object with keys {"+Object.keys(t).join(", ")+"}":r,"");return l}(e,"",t,n)}function z(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,(function(e){return t[e]}))}(e.key):t.toString(36)}function A(e,t){e.func.call(e.context,t,e.count++)}function D(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?F(e,r,n,(function(e){return e})):null!=e&&(j(e)&&(e=function(e,t){return{$$typeof:i,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(R,"$&/")+"/")+n)),r.push(e))}function F(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(R,"$&/")+"/"),L(e,D,t=M(t,i,r,o)),U(t)}function q(){var e=_.current;if(null===e)throw b(Error(321));return e}var B={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return F(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;L(e,A,t=M(null,null,t,n)),U(t)},count:function(e){return L(e,(function(){return null}),null)},toArray:function(e){var t=[];return F(e,t,null,(function(e){return e})),t},only:function(e){if(!j(e))throw b(Error(143));return e}},createRef:function(){return{current:null}},Component:E,PureComponent:x,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:p,render:e}},lazy:function(e){return{$$typeof:y,_ctor:e,_status:-1,_result:null}},memo:function(e,t){return{$$typeof:h,type:e,compare:void 0===t?null:t}},useCallback:function(e,t){return q().useCallback(e,t)},useContext:function(e,t){return q().useContext(e,t)},useEffect:function(e,t){return q().useEffect(e,t)},useImperativeHandle:function(e,t,n){return q().useImperativeHandle(e,t,n)},useDebugValue:function(){},useLayoutEffect:function(e,t){return q().useLayoutEffect(e,t)},useMemo:function(e,t){return q().useMemo(e,t)},useReducer:function(e,t,n){return q().useReducer(e,t,n)},useRef:function(e){return q().useRef(e)},useState:function(e){return q().useState(e)},Fragment:u,Profiler:c,StrictMode:l,Suspense:d,unstable_SuspenseList:m,createElement:N,cloneElement:function(e,t,n){if(null==e)throw b(Error(267),e);var o=r({},e.props),a=e.key,u=e.ref,l=e._owner;if(null!=t){if(void 0!==t.ref&&(u=t.ref,l=C.current),void 0!==t.key&&(a=""+t.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(s in t)O.call(t,s)&&!P.hasOwnProperty(s)&&(o[s]=void 0===t[s]&&void 0!==c?c[s]:t[s])}var s=arguments.length-2;if(1===s)o.children=n;else if(1<s){c=Array(s);for(var f=0;f<s;f++)c[f]=arguments[f+2];o.children=c}return{$$typeof:i,type:e.type,key:a,ref:u,props:o,_owner:l}},createFactory:function(e){var t=N.bind(null,e);return t.type=e,t},isValidElement:j,version:"16.10.1",unstable_withSuspenseConfig:function(e,t){var n=T.suspense;T.suspense=void 0===t?null:t;try{e()}finally{T.suspense=n}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentDispatcher:_,ReactCurrentBatchConfig:T,ReactCurrentOwner:C,IsSomeRendererActing:{current:!1},assign:r}},$={default:B},W=$&&B||$;e.exports=W.default||W},function(e,t,n){"use strict";
/** @license React v16.10.1
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(0),o=n(10),i=n(16);function a(e){for(var t=e.message,n="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r]);return e.message="Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e}if(!r)throw a(Error(227));var u=null,l={};function c(){if(u)for(var e in l){var t=l[e],n=u.indexOf(e);if(!(-1<n))throw a(Error(96),e);if(!f[n]){if(!t.extractEvents)throw a(Error(97),e);for(var r in f[n]=t,n=t.eventTypes){var o=void 0,i=n[r],c=t,d=r;if(p.hasOwnProperty(d))throw a(Error(99),d);p[d]=i;var m=i.phasedRegistrationNames;if(m){for(o in m)m.hasOwnProperty(o)&&s(m[o],c,d);o=!0}else i.registrationName?(s(i.registrationName,c,d),o=!0):o=!1;if(!o)throw a(Error(98),r,e)}}}}function s(e,t,n){if(d[e])throw a(Error(100),e);d[e]=t,m[e]=t.eventTypes[n].dependencies}var f=[],p={},d={},m={};function h(e,t,n,r,o,i,a,u,l){var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(e){this.onError(e)}}var y=!1,v=null,b=!1,g=null,w={onError:function(e){y=!0,v=e}};function E(e,t,n,r,o,i,a,u,l){y=!1,v=null,h.apply(w,arguments)}var k=null,x=null,S=null;function _(e,t,n){var r=e.type||"unknown-event";e.currentTarget=S(n),function(e,t,n,r,o,i,u,l,c){if(E.apply(this,arguments),y){if(!y)throw a(Error(198));var s=v;y=!1,v=null,b||(b=!0,g=s)}}(r,t,void 0,e),e.currentTarget=null}function T(e,t){if(null==t)throw a(Error(30));return null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function C(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var O=null;function P(e){if(e){var t=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(t))for(var r=0;r<t.length&&!e.isPropagationStopped();r++)_(e,t[r],n[r]);else t&&_(e,t,n);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function N(e){if(null!==e&&(O=T(O,e)),e=O,O=null,e){if(C(e,P),O)throw a(Error(95));if(b)throw e=g,b=!1,g=null,e}}var j={injectEventPluginOrder:function(e){if(u)throw a(Error(101));u=Array.prototype.slice.call(e),c()},injectEventPluginsByName:function(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];if(!l.hasOwnProperty(t)||l[t]!==r){if(l[t])throw a(Error(102),t);l[t]=r,n=!0}}n&&c()}};function R(e,t){var n=e.stateNode;if(!n)return null;var r=k(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}if(e)return null;if(n&&"function"!=typeof n)throw a(Error(231),t,typeof n);return n}var I=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;I.hasOwnProperty("ReactCurrentDispatcher")||(I.ReactCurrentDispatcher={current:null}),I.hasOwnProperty("ReactCurrentBatchConfig")||(I.ReactCurrentBatchConfig={suspense:null});var M=/^(.*)[\\\/]/,U="function"==typeof Symbol&&Symbol.for,L=U?Symbol.for("react.element"):60103,z=U?Symbol.for("react.portal"):60106,A=U?Symbol.for("react.fragment"):60107,D=U?Symbol.for("react.strict_mode"):60108,F=U?Symbol.for("react.profiler"):60114,q=U?Symbol.for("react.provider"):60109,B=U?Symbol.for("react.context"):60110,$=U?Symbol.for("react.concurrent_mode"):60111,W=U?Symbol.for("react.forward_ref"):60112,V=U?Symbol.for("react.suspense"):60113,Q=U?Symbol.for("react.suspense_list"):60120,H=U?Symbol.for("react.memo"):60115,K=U?Symbol.for("react.lazy"):60116;U&&Symbol.for("react.fundamental"),U&&Symbol.for("react.responder"),U&&Symbol.for("react.scope");var Y="function"==typeof Symbol&&Symbol.iterator;function G(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=Y&&e[Y]||e["@@iterator"])?e:null}function X(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case A:return"Fragment";case z:return"Portal";case F:return"Profiler";case D:return"StrictMode";case V:return"Suspense";case Q:return"SuspenseList"}if("object"==typeof e)switch(e.$$typeof){case B:return"Context.Consumer";case q:return"Context.Provider";case W:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case H:return X(e.type);case K:if(e=1===e._status?e._result:null)return X(e)}return null}function J(e){var t="";do{e:switch(e.tag){case 3:case 4:case 6:case 7:case 10:case 9:var n="";break e;default:var r=e._debugOwner,o=e._debugSource,i=X(e.type);n=null,r&&(n=X(r.type)),r=i,i="",o?i=" (at "+o.fileName.replace(M,"")+":"+o.lineNumber+")":n&&(i=" (created by "+n+")"),n="\n    in "+(r||"Unknown")+i}t+=n,e=e.return}while(e);return t}var Z=!("undefined"==typeof window||void 0===window.document||void 0===window.document.createElement),ee=null,te=null,ne=null;function re(e){if(e=x(e)){if("function"!=typeof ee)throw a(Error(280));var t=k(e.stateNode);ee(e.stateNode,e.type,t)}}function oe(e){te?ne?ne.push(e):ne=[e]:te=e}function ie(){if(te){var e=te,t=ne;if(ne=te=null,re(e),t)for(e=0;e<t.length;e++)re(t[e])}}function ae(e,t){return e(t)}function ue(e,t,n,r){return e(t,n,r)}function le(){}var ce=ae,se=!1,fe=!1;function pe(){null===te&&null===ne||(le(),ie())}new Map,new Map,new Map;var de=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,me=Object.prototype.hasOwnProperty,he={},ye={};function ve(e,t,n,r,o,i){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i}var be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach((function(e){be[e]=new ve(e,0,!1,e,null,!1)})),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach((function(e){var t=e[0];be[t]=new ve(t,1,!1,e[1],null,!1)})),["contentEditable","draggable","spellCheck","value"].forEach((function(e){be[e]=new ve(e,2,!1,e.toLowerCase(),null,!1)})),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach((function(e){be[e]=new ve(e,2,!1,e,null,!1)})),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach((function(e){be[e]=new ve(e,3,!1,e.toLowerCase(),null,!1)})),["checked","multiple","muted","selected"].forEach((function(e){be[e]=new ve(e,3,!0,e,null,!1)})),["capture","download"].forEach((function(e){be[e]=new ve(e,4,!1,e,null,!1)})),["cols","rows","size","span"].forEach((function(e){be[e]=new ve(e,6,!1,e,null,!1)})),["rowSpan","start"].forEach((function(e){be[e]=new ve(e,5,!1,e.toLowerCase(),null,!1)}));var ge=/[\-:]([a-z])/g;function we(e){return e[1].toUpperCase()}function Ee(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function ke(e,t,n,r){var o=be.hasOwnProperty(t)?be[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null==t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!me.call(ye,e)||!me.call(he,e)&&(de.test(e)?ye[e]=!0:(he[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function xe(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function Se(e){e._valueTracker||(e._valueTracker=function(e){var t=xe(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,i.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function _e(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=xe(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}function Te(e,t){var n=t.checked;return o({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function Ce(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=Ee(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function Oe(e,t){null!=(t=t.checked)&&ke(e,"checked",t,!1)}function Pe(e,t){Oe(e,t);var n=Ee(t.value),r=t.type;if(null!=n)"number"===r?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if("submit"===r||"reset"===r)return void e.removeAttribute("value");t.hasOwnProperty("value")?je(e,t.type,n):t.hasOwnProperty("defaultValue")&&je(e,t.type,Ee(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function Ne(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!("submit"!==r&&"reset"!==r||void 0!==t.value&&null!==t.value))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!!e._wrapperState.initialChecked,""!==n&&(e.name=n)}function je(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function Re(e,t){return e=o({children:void 0},t),(t=function(e){var t="";return r.Children.forEach(e,(function(e){null!=e&&(t+=e)})),t}(t.children))&&(e.children=t),e}function Ie(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ee(n),t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Me(e,t){if(null!=t.dangerouslySetInnerHTML)throw a(Error(91));return o({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ue(e,t){var n=t.value;if(null==n){if(n=t.defaultValue,null!=(t=t.children)){if(null!=n)throw a(Error(92));if(Array.isArray(t)){if(!(1>=t.length))throw a(Error(93));t=t[0]}n=t}null==n&&(n="")}e._wrapperState={initialValue:Ee(n)}}function Le(e,t){var n=Ee(t.value),r=Ee(t.defaultValue);null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&e.defaultValue!==n&&(e.defaultValue=n)),null!=r&&(e.defaultValue=""+r)}function ze(e){var t=e.textContent;t===e._wrapperState.initialValue&&""!==t&&null!==t&&(e.value=t)}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach((function(e){var t=e.replace(ge,we);be[t]=new ve(t,1,!1,e,null,!1)})),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach((function(e){var t=e.replace(ge,we);be[t]=new ve(t,1,!1,e,"http://www.w3.org/1999/xlink",!1)})),["xml:base","xml:lang","xml:space"].forEach((function(e){var t=e.replace(ge,we);be[t]=new ve(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1)})),["tabIndex","crossOrigin"].forEach((function(e){be[e]=new ve(e,1,!1,e.toLowerCase(),null,!1)})),be.xlinkHref=new ve("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0),["src","href","action","formAction"].forEach((function(e){be[e]=new ve(e,1,!1,e.toLowerCase(),null,!0)}));var Ae={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function De(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Fe(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?De(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var qe,Be=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction((function(){return e(t,n)}))}:e}((function(e,t){if(e.namespaceURI!==Ae.svg||"innerHTML"in e)e.innerHTML=t;else{for((qe=qe||document.createElement("div")).innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=qe.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}}));function $e(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}function We(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ve={animationend:We("Animation","AnimationEnd"),animationiteration:We("Animation","AnimationIteration"),animationstart:We("Animation","AnimationStart"),transitionend:We("Transition","TransitionEnd")},Qe={},He={};function Ke(e){if(Qe[e])return Qe[e];if(!Ve[e])return e;var t,n=Ve[e];for(t in n)if(n.hasOwnProperty(t)&&t in He)return Qe[e]=n[t];return e}Z&&(He=document.createElement("div").style,"AnimationEvent"in window||(delete Ve.animationend.animation,delete Ve.animationiteration.animation,delete Ve.animationstart.animation),"TransitionEvent"in window||delete Ve.transitionend.transition);var Ye=Ke("animationend"),Ge=Ke("animationiteration"),Xe=Ke("animationstart"),Je=Ke("transitionend"),Ze="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),et=!1,tt=[],nt=null,rt=null,ot=null,it=new Map,at=new Map,ut="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput close cancel copy cut paste click change contextmenu reset submit".split(" "),lt="focus blur dragenter dragleave mouseover mouseout pointerover pointerout gotpointercapture lostpointercapture".split(" ");function ct(e,t,n,r){return{blockedOn:e,topLevelType:t,eventSystemFlags:32|n,nativeEvent:r}}function st(e,t){switch(e){case"focus":case"blur":nt=null;break;case"dragenter":case"dragleave":rt=null;break;case"mouseover":case"mouseout":ot=null;break;case"pointerover":case"pointerout":it.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":at.delete(t.pointerId)}}function ft(e,t,n,r,o){return null===e||e.nativeEvent!==o?ct(t,n,r,o):(e.eventSystemFlags|=r,e)}function pt(e){if(null!==e.blockedOn)return!1;var t=Tn(e.topLevelType,e.eventSystemFlags,e.nativeEvent);return null===t||(e.blockedOn=t,!1)}function dt(e,t,n){pt(e)&&n.delete(t)}function mt(){for(et=!1;0<tt.length;){var e=tt[0];if(null!==e.blockedOn)break;var t=Tn(e.topLevelType,e.eventSystemFlags,e.nativeEvent);null!==t?e.blockedOn=t:tt.shift()}null!==nt&&pt(nt)&&(nt=null),null!==rt&&pt(rt)&&(rt=null),null!==ot&&pt(ot)&&(ot=null),it.forEach(dt),at.forEach(dt)}function ht(e,t){e.blockedOn===t&&(e.blockedOn=null,et||(et=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,mt)))}function yt(e){function t(t){return ht(t,e)}if(0<tt.length){ht(tt[0],e);for(var n=1;n<tt.length;n++){var r=tt[n];r.blockedOn===e&&(r.blockedOn=null)}}null!==nt&&ht(nt,e),null!==rt&&ht(rt,e),null!==ot&&ht(ot,e),it.forEach(t),at.forEach(t)}var vt=0,bt=2,gt=1024;function wt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do{((t=e).effectTag&(bt|gt))!==vt&&(n=t.return),e=t.return}while(e)}return 3===t.tag?n:null}function Et(e){if(wt(e)!==e)throw a(Error(188))}function kt(e){if(!(e=function(e){var t=e.alternate;if(!t){if(null===(t=wt(e)))throw a(Error(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(null===o)break;var i=o.alternate;if(null===i){if(null!==(r=o.return)){n=r;continue}break}if(o.child===i.child){for(i=o.child;i;){if(i===n)return Et(o),e;if(i===r)return Et(o),t;i=i.sibling}throw a(Error(188))}if(n.return!==r.return)n=o,r=i;else{for(var u=!1,l=o.child;l;){if(l===n){u=!0,n=o,r=i;break}if(l===r){u=!0,r=o,n=i;break}l=l.sibling}if(!u){for(l=i.child;l;){if(l===n){u=!0,n=i,r=o;break}if(l===r){u=!0,r=i,n=o;break}l=l.sibling}if(!u)throw a(Error(189))}}if(n.alternate!==r)throw a(Error(190))}if(3!==n.tag)throw a(Error(188));return n.stateNode.current===n?e:t}(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function xt(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function St(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function _t(e,t,n){(t=R(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=T(n._dispatchListeners,t),n._dispatchInstances=T(n._dispatchInstances,e))}function Tt(e){if(e&&e.dispatchConfig.phasedRegistrationNames){for(var t=e._targetInst,n=[];t;)n.push(t),t=St(t);for(t=n.length;0<t--;)_t(n[t],"captured",e);for(t=0;t<n.length;t++)_t(n[t],"bubbled",e)}}function Ct(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=R(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=T(n._dispatchListeners,t),n._dispatchInstances=T(n._dispatchInstances,e))}function Ot(e){e&&e.dispatchConfig.registrationName&&Ct(e._targetInst,null,e)}function Pt(e){C(e,Tt)}function Nt(){return!0}function jt(){return!1}function Rt(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?Nt:jt,this.isPropagationStopped=jt,this}function It(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function Mt(e){if(!(e instanceof this))throw a(Error(279));e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function Ut(e){e.eventPool=[],e.getPooled=It,e.release=Mt}o(Rt.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=Nt)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=Nt)},persist:function(){this.isPersistent=Nt},isPersistent:jt,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null,this.isPropagationStopped=this.isDefaultPrevented=jt,this._dispatchInstances=this._dispatchListeners=null}}),Rt.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null},Rt.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var i=new t;return o(i,n.prototype),n.prototype=i,n.prototype.constructor=n,n.Interface=o({},r.Interface,e),n.extend=r.extend,Ut(n),n},Ut(Rt);var Lt=Rt.extend({animationName:null,elapsedTime:null,pseudoElement:null}),zt=Rt.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),At=Rt.extend({view:null,detail:null}),Dt=At.extend({relatedTarget:null});function Ft(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}var qt={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Bt={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},$t={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Wt(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=$t[e])&&!!t[e]}function Vt(){return Wt}for(var Qt=At.extend({key:function(e){if(e.key){var t=qt[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=Ft(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?Bt[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Vt,charCode:function(e){return"keypress"===e.type?Ft(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?Ft(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),Ht=0,Kt=0,Yt=!1,Gt=!1,Xt=At.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Vt,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},movementX:function(e){if("movementX"in e)return e.movementX;var t=Ht;return Ht=e.screenX,Yt?"mousemove"===e.type?e.screenX-t:0:(Yt=!0,0)},movementY:function(e){if("movementY"in e)return e.movementY;var t=Kt;return Kt=e.screenY,Gt?"mousemove"===e.type?e.screenY-t:0:(Gt=!0,0)}}),Jt=Xt.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),Zt=Xt.extend({dataTransfer:null}),en=At.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Vt}),tn=Rt.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),nn=Xt.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),rn=[["blur","blur",0],["cancel","cancel",0],["click","click",0],["close","close",0],["contextmenu","contextMenu",0],["copy","copy",0],["cut","cut",0],["auxclick","auxClick",0],["dblclick","doubleClick",0],["dragend","dragEnd",0],["dragstart","dragStart",0],["drop","drop",0],["focus","focus",0],["input","input",0],["invalid","invalid",0],["keydown","keyDown",0],["keypress","keyPress",0],["keyup","keyUp",0],["mousedown","mouseDown",0],["mouseup","mouseUp",0],["paste","paste",0],["pause","pause",0],["play","play",0],["pointercancel","pointerCancel",0],["pointerdown","pointerDown",0],["pointerup","pointerUp",0],["ratechange","rateChange",0],["reset","reset",0],["seeked","seeked",0],["submit","submit",0],["touchcancel","touchCancel",0],["touchend","touchEnd",0],["touchstart","touchStart",0],["volumechange","volumeChange",0],["drag","drag",1],["dragenter","dragEnter",1],["dragexit","dragExit",1],["dragleave","dragLeave",1],["dragover","dragOver",1],["mousemove","mouseMove",1],["mouseout","mouseOut",1],["mouseover","mouseOver",1],["pointermove","pointerMove",1],["pointerout","pointerOut",1],["pointerover","pointerOver",1],["scroll","scroll",1],["toggle","toggle",1],["touchmove","touchMove",1],["wheel","wheel",1],["abort","abort",2],[Ye,"animationEnd",2],[Ge,"animationIteration",2],[Xe,"animationStart",2],["canplay","canPlay",2],["canplaythrough","canPlayThrough",2],["durationchange","durationChange",2],["emptied","emptied",2],["encrypted","encrypted",2],["ended","ended",2],["error","error",2],["gotpointercapture","gotPointerCapture",2],["load","load",2],["loadeddata","loadedData",2],["loadedmetadata","loadedMetadata",2],["loadstart","loadStart",2],["lostpointercapture","lostPointerCapture",2],["playing","playing",2],["progress","progress",2],["seeking","seeking",2],["stalled","stalled",2],["suspend","suspend",2],["timeupdate","timeUpdate",2],[Je,"transitionEnd",2],["waiting","waiting",2]],on={},an={},un=0;un<rn.length;un++){var ln=rn[un],cn=ln[0],sn=ln[1],fn=ln[2],pn="on"+(sn[0].toUpperCase()+sn.slice(1)),dn={phasedRegistrationNames:{bubbled:pn,captured:pn+"Capture"},dependencies:[cn],eventPriority:fn};on[sn]=dn,an[cn]=dn}var mn={eventTypes:on,getEventPriority:function(e){return void 0!==(e=an[e])?e.eventPriority:2},extractEvents:function(e,t,n,r,o){if(!(t=an[e]))return null;switch(e){case"keypress":if(0===Ft(r))return null;case"keydown":case"keyup":e=Qt;break;case"blur":case"focus":e=Dt;break;case"click":if(2===r.button)return null;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=Xt;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=Zt;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=en;break;case Ye:case Ge:case Xe:e=Lt;break;case Je:e=tn;break;case"scroll":e=At;break;case"wheel":e=nn;break;case"copy":case"cut":case"paste":e=zt;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=Jt;break;default:e=Rt}return Pt(n=e.getPooled(t,n,r,o)),n}},hn=mn.getEventPriority,yn=10,vn=[];function bn(e){var t=e.targetInst,n=t;do{if(!n){e.ancestors.push(n);break}var r=n;if(3===r.tag)r=r.stateNode.containerInfo;else{for(;r.return;)r=r.return;r=3!==r.tag?null:r.stateNode.containerInfo}if(!r)break;var o=n.tag;5!==o&&6!==o||e.ancestors.push(n),n=ur(r)}while(n);for(n=0;n<e.ancestors.length;n++){t=e.ancestors[n];var i=xt(e.nativeEvent);r=e.topLevelType,o=e.eventSystemFlags;for(var a=e.nativeEvent,u=null,l=0;l<f.length;l++){var c=f[l];c&&(c=c.extractEvents(r,o,t,a,i))&&(u=T(u,c))}N(u)}}var gn=!0;function wn(e,t){En(t,e,!1)}function En(e,t,n){switch(hn(t)){case 0:var r=kn.bind(null,t,1);break;case 1:r=xn.bind(null,t,1);break;default:r=_n.bind(null,t,1)}n?e.addEventListener(t,r,!0):e.addEventListener(t,r,!1)}function kn(e,t,n){se||le();var r=_n,o=se;se=!0;try{ue(r,e,t,n)}finally{(se=o)||pe()}}function xn(e,t,n){_n(e,t,n)}function Sn(e,t,n,r){if(vn.length){var o=vn.pop();o.topLevelType=e,o.eventSystemFlags=t,o.nativeEvent=n,o.targetInst=r,e=o}else e={topLevelType:e,eventSystemFlags:t,nativeEvent:n,targetInst:r,ancestors:[]};try{if(t=bn,n=e,fe)t(n,void 0);else{fe=!0;try{ce(t,n,void 0)}finally{fe=!1,pe()}}}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,vn.length<yn&&vn.push(e)}}function _n(e,t,n){if(gn)if(0<tt.length&&-1<ut.indexOf(e))e=ct(null,e,t,n),tt.push(e);else{var r=Tn(e,t,n);null===r?st(e,n):-1<ut.indexOf(e)?(e=ct(r,e,t,n),tt.push(e)):function(e,t,n,r){switch(t){case"focus":return nt=ft(nt,e,t,n,r),!0;case"dragenter":return rt=ft(rt,e,t,n,r),!0;case"mouseover":return ot=ft(ot,e,t,n,r),!0;case"pointerover":var o=r.pointerId;return it.set(o,ft(it.get(o)||null,e,t,n,r)),!0;case"gotpointercapture":return o=r.pointerId,at.set(o,ft(at.get(o)||null,e,t,n,r)),!0}return!1}(r,e,t,n)||(st(e,n),Sn(e,t,n,null))}}function Tn(e,t,n){var r=xt(n),o=ur(r);if(null!==o)if(null===(r=wt(o)))o=null;else{var i=r.tag;if(13===i){if(null!==(r=13!==r.tag||(null===(o=r.memoizedState)&&(null!==(r=r.alternate)&&(o=r.memoizedState)),null===o)?null:o.dehydrated))return r;o=null}else if(3===i){if(r.stateNode.hydrate)return 3===r.tag?r.stateNode.containerInfo:null;o=null}else r!==o&&(o=null)}return Sn(e,t,n,o),null}function Cn(e){if(!Z)return!1;var t=(e="on"+e)in document;return t||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t}var On=new("function"==typeof WeakMap?WeakMap:Map);function Pn(e){var t=On.get(e);return void 0===t&&(t=new Set,On.set(e,t)),t}function Nn(e,t,n){if(!n.has(e)){switch(e){case"scroll":En(t,"scroll",!0);break;case"focus":case"blur":En(t,"focus",!0),En(t,"blur",!0),n.add("blur"),n.add("focus");break;case"cancel":case"close":Cn(e)&&En(t,e,!0);break;case"invalid":case"submit":case"reset":break;default:-1===Ze.indexOf(e)&&wn(e,t)}n.add(e)}}var jn={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Rn=["Webkit","ms","Moz","O"];function In(e,t,n){return null==t||"boolean"==typeof t||""===t?"":n||"number"!=typeof t||0===t||jn.hasOwnProperty(e)&&jn[e]?(""+t).trim():t+"px"}function Mn(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=In(n,t[n],r);"float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(jn).forEach((function(e){Rn.forEach((function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),jn[t]=jn[e]}))}));var Un=o({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ln(e,t){if(t){if(Un[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML))throw a(Error(137),e,"");if(null!=t.dangerouslySetInnerHTML){if(null!=t.children)throw a(Error(60));if(!("object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML))throw a(Error(61))}if(null!=t.style&&"object"!=typeof t.style)throw a(Error(62),"")}}function zn(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function An(e,t){var n=Pn(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=m[t];for(var r=0;r<t.length;r++)Nn(t[r],e,n)}function Dn(){}function Fn(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}function qn(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Bn(e,t){var n,r=qn(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=qn(r)}}function $n(){for(var e=window,t=Fn();t instanceof e.HTMLIFrameElement;){try{var n="string"==typeof t.contentWindow.location.href}catch(e){n=!1}if(!n)break;t=Fn((e=t.contentWindow).document)}return t}function Wn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}var Vn="$",Qn="/$",Hn="$?",Kn="$!",Yn=null,Gn=null;function Xn(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function Jn(e,t){return"textarea"===e||"option"===e||"noscript"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&null!=t.dangerouslySetInnerHTML.__html}var Zn="function"==typeof setTimeout?setTimeout:void 0,er="function"==typeof clearTimeout?clearTimeout:void 0;function tr(e){for(;null!=e;e=e.nextSibling){var t=e.nodeType;if(1===t||3===t)break}return e}function nr(e){e=e.previousSibling;for(var t=0;e;){if(8===e.nodeType){var n=e.data;if(n===Vn||n===Kn||n===Hn){if(0===t)return e;t--}else n===Qn&&t++}e=e.previousSibling}return null}var rr=Math.random().toString(36).slice(2),or="__reactInternalInstance$"+rr,ir="__reactEventHandlers$"+rr,ar="__reactContainere$"+rr;function ur(e){var t=e[or];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ar]||n[or]){if(n=t.alternate,null!==t.child||null!==n&&null!==n.child)for(e=nr(e);null!==e;){if(n=e[or])return n;e=nr(e)}return t}n=(e=n).parentNode}return null}function lr(e){return!(e=e[or]||e[ar])||5!==e.tag&&6!==e.tag&&13!==e.tag&&3!==e.tag?null:e}function cr(e){if(5===e.tag||6===e.tag)return e.stateNode;throw a(Error(33))}function sr(e){return e[ir]||null}var fr=null,pr=null,dr=null;function mr(){if(dr)return dr;var e,t,n=pr,r=n.length,o="value"in fr?fr.value:fr.textContent,i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var a=r-e;for(t=1;t<=a&&n[r-t]===o[i-t];t++);return dr=o.slice(e,1<t?1-t:void 0)}var hr=Rt.extend({data:null}),yr=Rt.extend({data:null}),vr=[9,13,27,32],br=Z&&"CompositionEvent"in window,gr=null;Z&&"documentMode"in document&&(gr=document.documentMode);var wr=Z&&"TextEvent"in window&&!gr,Er=Z&&(!br||gr&&8<gr&&11>=gr),kr=String.fromCharCode(32),xr={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Sr=!1;function _r(e,t){switch(e){case"keyup":return-1!==vr.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function Tr(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var Cr=!1;var Or={eventTypes:xr,extractEvents:function(e,t,n,r,o){var i;if(br)e:{switch(e){case"compositionstart":var a=xr.compositionStart;break e;case"compositionend":a=xr.compositionEnd;break e;case"compositionupdate":a=xr.compositionUpdate;break e}a=void 0}else Cr?_r(e,r)&&(a=xr.compositionEnd):"keydown"===e&&229===r.keyCode&&(a=xr.compositionStart);return a?(Er&&"ko"!==r.locale&&(Cr||a!==xr.compositionStart?a===xr.compositionEnd&&Cr&&(i=mr()):(pr="value"in(fr=o)?fr.value:fr.textContent,Cr=!0)),t=hr.getPooled(a,n,r,o),i?t.data=i:null!==(i=Tr(r))&&(t.data=i),Pt(t),i=t):i=null,(e=wr?function(e,t){switch(e){case"compositionend":return Tr(t);case"keypress":return 32!==t.which?null:(Sr=!0,kr);case"textInput":return(e=t.data)===kr&&Sr?null:e;default:return null}}(e,r):function(e,t){if(Cr)return"compositionend"===e||!br&&_r(e,t)?(e=mr(),dr=pr=fr=null,Cr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Er&&"ko"!==t.locale?null:t.data;default:return null}}(e,r))?((n=yr.getPooled(xr.beforeInput,n,r,o)).data=e,Pt(n)):n=null,null===i?n:null===n?i:[i,n]}},Pr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Nr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Pr[e.type]:"textarea"===t}var jr={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Rr(e,t,n){return(e=Rt.getPooled(jr.change,e,t,n)).type="change",oe(n),Pt(e),e}var Ir=null,Mr=null;function Ur(e){N(e)}function Lr(e){if(_e(cr(e)))return e}function zr(e,t){if("change"===e)return t}var Ar=!1;function Dr(){Ir&&(Ir.detachEvent("onpropertychange",Fr),Mr=Ir=null)}function Fr(e){if("value"===e.propertyName&&Lr(Mr))if(e=Rr(Mr,e,xt(e)),se)N(e);else{se=!0;try{ae(Ur,e)}finally{se=!1,pe()}}}function qr(e,t,n){"focus"===e?(Dr(),Mr=n,(Ir=t).attachEvent("onpropertychange",Fr)):"blur"===e&&Dr()}function Br(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Lr(Mr)}function $r(e,t){if("click"===e)return Lr(t)}function Wr(e,t){if("input"===e||"change"===e)return Lr(t)}Z&&(Ar=Cn("input")&&(!document.documentMode||9<document.documentMode));var Vr={eventTypes:jr,_isInputEventSupported:Ar,extractEvents:function(e,t,n,r,o){var i=(t=n?cr(n):window).nodeName&&t.nodeName.toLowerCase();if("select"===i||"input"===i&&"file"===t.type)var a=zr;else if(Nr(t))if(Ar)a=Wr;else{a=Br;var u=qr}else(i=t.nodeName)&&"input"===i.toLowerCase()&&("checkbox"===t.type||"radio"===t.type)&&(a=$r);if(a&&(a=a(e,n)))return Rr(a,r,o);u&&u(e,t,n),"blur"===e&&(e=t._wrapperState)&&e.controlled&&"number"===t.type&&je(t,"number",t.value)}},Qr={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},Hr={eventTypes:Qr,extractEvents:function(e,t,n,r,o){var i="mouseover"===e||"pointerover"===e,a="mouseout"===e||"pointerout"===e;if(i&&0==(32&t)&&(r.relatedTarget||r.fromElement)||!a&&!i)return null;if(t=o.window===o?o:(t=o.ownerDocument)?t.defaultView||t.parentWindow:window,a?(a=n,null!==(n=(n=r.relatedTarget||r.toElement)?ur(n):null)&&(n!==(i=wt(n))||5!==n.tag&&6!==n.tag)&&(n=null)):a=null,a===n)return null;if("mouseout"===e||"mouseover"===e)var u=Xt,l=Qr.mouseLeave,c=Qr.mouseEnter,s="mouse";else"pointerout"!==e&&"pointerover"!==e||(u=Jt,l=Qr.pointerLeave,c=Qr.pointerEnter,s="pointer");if(e=null==a?t:cr(a),t=null==n?t:cr(n),(l=u.getPooled(l,a,r,o)).type=s+"leave",l.target=e,l.relatedTarget=t,(r=u.getPooled(c,n,r,o)).type=s+"enter",r.target=t,r.relatedTarget=e,s=n,(o=a)&&s)e:{for(c=s,e=0,a=u=o;a;a=St(a))e++;for(a=0,n=c;n;n=St(n))a++;for(;0<e-a;)u=St(u),e--;for(;0<a-e;)c=St(c),a--;for(;e--;){if(u===c||u===c.alternate)break e;u=St(u),c=St(c)}u=null}else u=null;for(c=u,u=[];o&&o!==c&&(null===(e=o.alternate)||e!==c);)u.push(o),o=St(o);for(o=[];s&&s!==c&&(null===(e=s.alternate)||e!==c);)o.push(s),s=St(s);for(s=0;s<u.length;s++)Ct(u[s],"bubbled",l);for(s=o.length;0<s--;)Ct(o[s],"captured",r);return[l,r]}};var Kr="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},Yr=Object.prototype.hasOwnProperty;function Gr(e,t){if(Kr(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!Yr.call(t,n[r])||!Kr(e[n[r]],t[n[r]]))return!1;return!0}var Xr=Z&&"documentMode"in document&&11>=document.documentMode,Jr={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Zr=null,eo=null,to=null,no=!1;function ro(e,t){var n=t.window===t?t.document:9===t.nodeType?t:t.ownerDocument;return no||null==Zr||Zr!==Fn(n)?null:("selectionStart"in(n=Zr)&&Wn(n)?n={start:n.selectionStart,end:n.selectionEnd}:n={anchorNode:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset},to&&Gr(to,n)?null:(to=n,(e=Rt.getPooled(Jr.select,eo,e,t)).type="select",e.target=Zr,Pt(e),e))}var oo={eventTypes:Jr,extractEvents:function(e,t,n,r,o){var i;if(!(i=!(t=o.window===o?o.document:9===o.nodeType?o:o.ownerDocument))){e:{t=Pn(t),i=m.onSelect;for(var a=0;a<i.length;a++)if(!t.has(i[a])){t=!1;break e}t=!0}i=!t}if(i)return null;switch(t=n?cr(n):window,e){case"focus":(Nr(t)||"true"===t.contentEditable)&&(Zr=t,eo=n,to=null);break;case"blur":to=eo=Zr=null;break;case"mousedown":no=!0;break;case"contextmenu":case"mouseup":case"dragend":return no=!1,ro(r,o);case"selectionchange":if(Xr)break;case"keydown":case"keyup":return ro(r,o)}return null}};j.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),k=sr,x=lr,S=cr,j.injectEventPluginsByName({SimpleEventPlugin:mn,EnterLeaveEventPlugin:Hr,ChangeEventPlugin:Vr,SelectEventPlugin:oo,BeforeInputEventPlugin:Or}),new Set;var io=[],ao=-1;function uo(e){0>ao||(e.current=io[ao],io[ao]=null,ao--)}function lo(e,t){io[++ao]=e.current,e.current=t}var co={},so={current:co},fo={current:!1},po=co;function mo(e,t){var n=e.type.contextTypes;if(!n)return co;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,i={};for(o in n)i[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function ho(e){return null!=(e=e.childContextTypes)}function yo(e){uo(fo),uo(so)}function vo(e){uo(fo),uo(so)}function bo(e,t,n){if(so.current!==co)throw a(Error(168));lo(so,t),lo(fo,n)}function go(e,t,n){var r=e.stateNode;if(e=t.childContextTypes,"function"!=typeof r.getChildContext)return n;for(var i in r=r.getChildContext())if(!(i in e))throw a(Error(108),X(t)||"Unknown",i);return o({},n,{},r)}function wo(e){var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||co,po=so.current,lo(so,t),lo(fo,fo.current),!0}function Eo(e,t,n){var r=e.stateNode;if(!r)throw a(Error(169));n?(t=go(e,t,po),r.__reactInternalMemoizedMergedChildContext=t,uo(fo),uo(so),lo(so,t)):uo(fo),lo(fo,n)}var ko=i.unstable_runWithPriority,xo=i.unstable_scheduleCallback,So=i.unstable_cancelCallback,_o=i.unstable_shouldYield,To=i.unstable_requestPaint,Co=i.unstable_now,Oo=i.unstable_getCurrentPriorityLevel,Po=i.unstable_ImmediatePriority,No=i.unstable_UserBlockingPriority,jo=i.unstable_NormalPriority,Ro=i.unstable_LowPriority,Io=i.unstable_IdlePriority,Mo={},Uo=void 0!==To?To:function(){},Lo=null,zo=null,Ao=!1,Do=Co(),Fo=1e4>Do?Co:function(){return Co()-Do};function qo(){switch(Oo()){case Po:return 99;case No:return 98;case jo:return 97;case Ro:return 96;case Io:return 95;default:throw a(Error(332))}}function Bo(e){switch(e){case 99:return Po;case 98:return No;case 97:return jo;case 96:return Ro;case 95:return Io;default:throw a(Error(332))}}function $o(e,t){return e=Bo(e),ko(e,t)}function Wo(e,t,n){return e=Bo(e),xo(e,t,n)}function Vo(e){return null===Lo?(Lo=[e],zo=xo(Po,Ho)):Lo.push(e),Mo}function Qo(){if(null!==zo){var e=zo;zo=null,So(e)}Ho()}function Ho(){if(!Ao&&null!==Lo){Ao=!0;var e=0;try{var t=Lo;$o(99,(function(){for(;e<t.length;e++){var n=t[e];do{n=n(!0)}while(null!==n)}})),Lo=null}catch(t){throw null!==Lo&&(Lo=Lo.slice(e+1)),xo(Po,Qo),t}finally{Ao=!1}}}function Ko(e,t){if(e&&e.defaultProps)for(var n in t=o({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}var Yo={current:null},Go=null,Xo=null,Jo=null;function Zo(){Jo=Xo=Go=null}function ei(e,t){var n=e.type._context;lo(Yo,n._currentValue),n._currentValue=t}function ti(e){var t=Yo.current;uo(Yo),e.type._context._currentValue=t}function ni(e,t){for(;null!==e;){var n=e.alternate;if(e.childExpirationTime<t)e.childExpirationTime=t,null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t);else{if(!(null!==n&&n.childExpirationTime<t))break;n.childExpirationTime=t}e=e.return}}function ri(e,t){Go=e,Jo=Xo=null,null!==(e=e.dependencies)&&null!==e.firstContext&&(e.expirationTime>=t&&(Na=!0),e.firstContext=null)}function oi(e,t){if(Jo!==e&&!1!==t&&0!==t)if("number"==typeof t&&1073741823!==t||(Jo=e,t=1073741823),t={context:e,observedBits:t,next:null},null===Xo){if(null===Go)throw a(Error(308));Xo=t,Go.dependencies={expirationTime:0,firstContext:t,responders:null}}else Xo=Xo.next=t;return e._currentValue}var ii=!1;function ai(e){return{baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function ui(e){return{baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function li(e,t){return{expirationTime:e,suspenseConfig:t,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function ci(e,t){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t)}function si(e,t){var n=e.alternate;if(null===n){var r=e.updateQueue,o=null;null===r&&(r=e.updateQueue=ai(e.memoizedState))}else r=e.updateQueue,o=n.updateQueue,null===r?null===o?(r=e.updateQueue=ai(e.memoizedState),o=n.updateQueue=ai(n.memoizedState)):r=e.updateQueue=ui(o):null===o&&(o=n.updateQueue=ui(r));null===o||r===o?ci(r,t):null===r.lastUpdate||null===o.lastUpdate?(ci(r,t),ci(o,t)):(ci(r,t),o.lastUpdate=t)}function fi(e,t){var n=e.updateQueue;null===(n=null===n?e.updateQueue=ai(e.memoizedState):pi(e,n)).lastCapturedUpdate?n.firstCapturedUpdate=n.lastCapturedUpdate=t:(n.lastCapturedUpdate.next=t,n.lastCapturedUpdate=t)}function pi(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=ui(t)),t}function di(e,t,n,r,i,a){switch(n.tag){case 1:return"function"==typeof(e=n.payload)?e.call(a,r,i):e;case 3:e.effectTag=-4097&e.effectTag|64;case 0:if(null==(i="function"==typeof(e=n.payload)?e.call(a,r,i):e))break;return o({},r,i);case 2:ii=!0}return r}function mi(e,t,n,r,o){ii=!1;for(var i=(t=pi(e,t)).baseState,a=null,u=0,l=t.firstUpdate,c=i;null!==l;){var s=l.expirationTime;s<o?(null===a&&(a=l,i=c),u<s&&(u=s)):(yl(s,l.suspenseConfig),c=di(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=l:(t.lastEffect.nextEffect=l,t.lastEffect=l))),l=l.next}for(s=null,l=t.firstCapturedUpdate;null!==l;){var f=l.expirationTime;f<o?(null===s&&(s=l,null===a&&(i=c)),u<f&&(u=f)):(c=di(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=l:(t.lastCapturedEffect.nextEffect=l,t.lastCapturedEffect=l))),l=l.next}null===a&&(t.lastUpdate=null),null===s?t.lastCapturedUpdate=null:e.effectTag|=32,null===a&&null===s&&(i=c),t.baseState=i,t.firstUpdate=a,t.firstCapturedUpdate=s,vl(u),e.expirationTime=u,e.memoizedState=c}function hi(e,t,n){null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),yi(t.firstEffect,n),t.firstEffect=t.lastEffect=null,yi(t.firstCapturedEffect,n),t.firstCapturedEffect=t.lastCapturedEffect=null}function yi(e,t){for(;null!==e;){var n=e.callback;if(null!==n){e.callback=null;var r=t;if("function"!=typeof n)throw a(Error(191),n);n.call(r)}e=e.nextEffect}}var vi=I.ReactCurrentBatchConfig,bi=(new r.Component).refs;function gi(e,t,n,r){n=null==(n=n(r,t=e.memoizedState))?t:o({},t,n),e.memoizedState=n,null!==(r=e.updateQueue)&&0===e.expirationTime&&(r.baseState=n)}var wi={isMounted:function(e){return!!(e=e._reactInternalFiber)&&wt(e)===e},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=Ju(),o=vi.suspense;(o=li(r=Zu(r,e,o),o)).payload=t,null!=n&&(o.callback=n),si(e,o),nl(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=Ju(),o=vi.suspense;(o=li(r=Zu(r,e,o),o)).tag=1,o.payload=t,null!=n&&(o.callback=n),si(e,o),nl(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=Ju(),r=vi.suspense;(r=li(n=Zu(n,e,r),r)).tag=2,null!=t&&(r.callback=t),si(e,r),nl(e,n)}};function Ei(e,t,n,r,o,i,a){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,i,a):!t.prototype||!t.prototype.isPureReactComponent||(!Gr(n,r)||!Gr(o,i))}function ki(e,t,n){var r=!1,o=co,i=t.contextType;return"object"==typeof i&&null!==i?i=oi(i):(o=ho(t)?po:so.current,i=(r=null!=(r=t.contextTypes))?mo(e,o):co),t=new t(n,i),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=wi,e.stateNode=t,t._reactInternalFiber=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=i),t}function xi(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&wi.enqueueReplaceState(t,t.state,null)}function Si(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=bi;var i=t.contextType;"object"==typeof i&&null!==i?o.context=oi(i):(i=ho(t)?po:so.current,o.context=mo(e,i)),null!==(i=e.updateQueue)&&(mi(e,i,n,o,r),o.state=e.memoizedState),"function"==typeof(i=t.getDerivedStateFromProps)&&(gi(e,t,i,n),o.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(t=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),t!==o.state&&wi.enqueueReplaceState(o,o.state,null),null!==(i=e.updateQueue)&&(mi(e,i,n,o,r),o.state=e.memoizedState)),"function"==typeof o.componentDidMount&&(e.effectTag|=4)}var _i=Array.isArray;function Ti(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){if(n=n._owner){if(1!==n.tag)throw a(Error(309));var r=n.stateNode}if(!r)throw a(Error(147),e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs;t===bi&&(t=r.refs={}),null===e?delete t[o]:t[o]=e})._stringRef=o,t)}if("string"!=typeof e)throw a(Error(284));if(!n._owner)throw a(Error(290),e)}return e}function Ci(e,t){if("textarea"!==e.type)throw a(Error(31),"[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function Oi(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=zl(e,t)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=bt,n):r:(t.effectTag=bt,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=bt),t}function l(e,t,n,r){return null===t||6!==t.tag?((t=Fl(n,e.mode,r)).return=e,t):((t=o(t,n)).return=e,t)}function c(e,t,n,r){return null!==t&&t.elementType===n.type?((r=o(t,n.props)).ref=Ti(e,t,n),r.return=e,r):((r=Al(n.type,n.key,n.props,null,e.mode,r)).ref=Ti(e,t,n),r.return=e,r)}function s(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=ql(n,e.mode,r)).return=e,t):((t=o(t,n.children||[])).return=e,t)}function f(e,t,n,r,i){return null===t||7!==t.tag?((t=Dl(n,e.mode,r,i)).return=e,t):((t=o(t,n)).return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Fl(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case L:return(n=Al(t.type,t.key,t.props,null,e.mode,n)).ref=Ti(e,null,t),n.return=e,n;case z:return(t=ql(t,e.mode,n)).return=e,t}if(_i(t)||G(t))return(t=Dl(t,e.mode,n,null)).return=e,t;Ci(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case L:return n.key===o?n.type===A?f(e,t,n.props.children,r,o):c(e,t,n,r):null;case z:return n.key===o?s(e,t,n,r):null}if(_i(n)||G(n))return null!==o?null:f(e,t,n,r,null);Ci(e,n)}return null}function m(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return l(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case L:return e=e.get(null===r.key?n:r.key)||null,r.type===A?f(t,e,r.props.children,o,r.key):c(t,e,r,o);case z:return s(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(_i(r)||G(r))return f(t,e=e.get(n)||null,r,o,null);Ci(t,r)}return null}function h(o,a,u,l){for(var c=null,s=null,f=a,h=a=0,y=null;null!==f&&h<u.length;h++){f.index>h?(y=f,f=null):y=f.sibling;var v=d(o,f,u[h],l);if(null===v){null===f&&(f=y);break}e&&f&&null===v.alternate&&t(o,f),a=i(v,a,h),null===s?c=v:s.sibling=v,s=v,f=y}if(h===u.length)return n(o,f),c;if(null===f){for(;h<u.length;h++)null!==(f=p(o,u[h],l))&&(a=i(f,a,h),null===s?c=f:s.sibling=f,s=f);return c}for(f=r(o,f);h<u.length;h++)null!==(y=m(f,o,h,u[h],l))&&(e&&null!==y.alternate&&f.delete(null===y.key?h:y.key),a=i(y,a,h),null===s?c=y:s.sibling=y,s=y);return e&&f.forEach((function(e){return t(o,e)})),c}function y(o,u,l,c){var s=G(l);if("function"!=typeof s)throw a(Error(150));if(null==(l=s.call(l)))throw a(Error(151));for(var f=s=null,h=u,y=u=0,v=null,b=l.next();null!==h&&!b.done;y++,b=l.next()){h.index>y?(v=h,h=null):v=h.sibling;var g=d(o,h,b.value,c);if(null===g){null===h&&(h=v);break}e&&h&&null===g.alternate&&t(o,h),u=i(g,u,y),null===f?s=g:f.sibling=g,f=g,h=v}if(b.done)return n(o,h),s;if(null===h){for(;!b.done;y++,b=l.next())null!==(b=p(o,b.value,c))&&(u=i(b,u,y),null===f?s=b:f.sibling=b,f=b);return s}for(h=r(o,h);!b.done;y++,b=l.next())null!==(b=m(h,o,y,b.value,c))&&(e&&null!==b.alternate&&h.delete(null===b.key?y:b.key),u=i(b,u,y),null===f?s=b:f.sibling=b,f=b);return e&&h.forEach((function(e){return t(o,e)})),s}return function(e,r,i,l){var c="object"==typeof i&&null!==i&&i.type===A&&null===i.key;c&&(i=i.props.children);var s="object"==typeof i&&null!==i;if(s)switch(i.$$typeof){case L:e:{for(s=i.key,c=r;null!==c;){if(c.key===s){if(7===c.tag?i.type===A:c.elementType===i.type){n(e,c.sibling),(r=o(c,i.type===A?i.props.children:i.props)).ref=Ti(e,c,i),r.return=e,e=r;break e}n(e,c);break}t(e,c),c=c.sibling}i.type===A?((r=Dl(i.props.children,e.mode,l,i.key)).return=e,e=r):((l=Al(i.type,i.key,i.props,null,e.mode,l)).ref=Ti(e,r,i),l.return=e,e=l)}return u(e);case z:e:{for(c=i.key;null!==r;){if(r.key===c){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=o(r,i.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=ql(i,e.mode,l)).return=e,e=r}return u(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,i)).return=e,e=r):(n(e,r),(r=Fl(i,e.mode,l)).return=e,e=r),u(e);if(_i(i))return h(e,r,i,l);if(G(i))return y(e,r,i,l);if(s&&Ci(e,i),void 0===i&&!c)switch(e.tag){case 1:case 0:throw e=e.type,a(Error(152),e.displayName||e.name||"Component")}return n(e,r)}}var Pi=Oi(!0),Ni=Oi(!1),ji={},Ri={current:ji},Ii={current:ji},Mi={current:ji};function Ui(e){if(e===ji)throw a(Error(174));return e}function Li(e,t){lo(Mi,t),lo(Ii,e),lo(Ri,ji);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Fe(null,"");break;default:t=Fe(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}uo(Ri),lo(Ri,t)}function zi(e){uo(Ri),uo(Ii),uo(Mi)}function Ai(e){Ui(Mi.current);var t=Ui(Ri.current),n=Fe(t,e.type);t!==n&&(lo(Ii,e),lo(Ri,n))}function Di(e){Ii.current===e&&(uo(Ri),uo(Ii))}var Fi={current:0};function qi(e){for(var t=e;null!==t;){if(13===t.tag){var n=t.memoizedState;if(null!==n&&(null===(n=n.dehydrated)||n.data===Hn||n.data===Kn))return t}else if(19===t.tag&&void 0!==t.memoizedProps.revealOrder){if((64&t.effectTag)!==vt)return t}else if(null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}function Bi(e,t){return{responder:e,props:t}}var $i=I.ReactCurrentDispatcher,Wi=0,Vi=null,Qi=null,Hi=null,Ki=null,Yi=null,Gi=null,Xi=0,Ji=null,Zi=0,ea=!1,ta=null,na=0;function ra(){throw a(Error(321))}function oa(e,t){if(null===t)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Kr(e[n],t[n]))return!1;return!0}function ia(e,t,n,r,o,i){if(Wi=i,Vi=t,Hi=null!==e?e.memoizedState:null,$i.current=null===Hi?ba:ga,t=n(r,o),ea){do{ea=!1,na+=1,Hi=null!==e?e.memoizedState:null,Gi=Ki,Ji=Yi=Qi=null,$i.current=ga,t=n(r,o)}while(ea);ta=null,na=0}if($i.current=va,(e=Vi).memoizedState=Ki,e.expirationTime=Xi,e.updateQueue=Ji,e.effectTag|=Zi,e=null!==Qi&&null!==Qi.next,Wi=0,Gi=Yi=Ki=Hi=Qi=Vi=null,Xi=0,Ji=null,Zi=0,e)throw a(Error(300));return t}function aa(){$i.current=va,Wi=0,Gi=Yi=Ki=Hi=Qi=Vi=null,Xi=0,Ji=null,Zi=0,ea=!1,ta=null,na=0}function ua(){var e={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};return null===Yi?Ki=Yi=e:Yi=Yi.next=e,Yi}function la(){if(null!==Gi)Gi=(Yi=Gi).next,Hi=null!==(Qi=Hi)?Qi.next:null;else{if(null===Hi)throw a(Error(310));var e={memoizedState:(Qi=Hi).memoizedState,baseState:Qi.baseState,queue:Qi.queue,baseUpdate:Qi.baseUpdate,next:null};Yi=null===Yi?Ki=e:Yi.next=e,Hi=Qi.next}return Yi}function ca(e,t){return"function"==typeof t?t(e):t}function sa(e){var t=la(),n=t.queue;if(null===n)throw a(Error(311));if(n.lastRenderedReducer=e,0<na){var r=n.dispatch;if(null!==ta){var o=ta.get(n);if(void 0!==o){ta.delete(n);var i=t.memoizedState;do{i=e(i,o.action),o=o.next}while(null!==o);return Kr(i,t.memoizedState)||(Na=!0),t.memoizedState=i,t.baseUpdate===n.last&&(t.baseState=i),n.lastRenderedState=i,[i,r]}}return[t.memoizedState,r]}r=n.last;var u=t.baseUpdate;if(i=t.baseState,null!==u?(null!==r&&(r.next=null),r=u.next):r=null!==r?r.next:null,null!==r){var l=o=null,c=r,s=!1;do{var f=c.expirationTime;f<Wi?(s||(s=!0,l=u,o=i),f>Xi&&vl(Xi=f)):(yl(f,c.suspenseConfig),i=c.eagerReducer===e?c.eagerState:e(i,c.action)),u=c,c=c.next}while(null!==c&&c!==r);s||(l=u,o=i),Kr(i,t.memoizedState)||(Na=!0),t.memoizedState=i,t.baseUpdate=l,t.baseState=o,n.lastRenderedState=i}return[t.memoizedState,n.dispatch]}function fa(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},null===Ji?(Ji={lastEffect:null}).lastEffect=e.next=e:null===(t=Ji.lastEffect)?Ji.lastEffect=e.next=e:(n=t.next,t.next=e,e.next=n,Ji.lastEffect=e),e}function pa(e,t,n,r){var o=ua();Zi|=e,o.memoizedState=fa(t,n,void 0,void 0===r?null:r)}function da(e,t,n,r){var o=la();r=void 0===r?null:r;var i=void 0;if(null!==Qi){var a=Qi.memoizedState;if(i=a.destroy,null!==r&&oa(r,a.deps))return void fa(0,n,i,r)}Zi|=e,o.memoizedState=fa(t,n,i,r)}function ma(e,t){return"function"==typeof t?(e=e(),t(e),function(){t(null)}):null!=t?(e=e(),t.current=e,function(){t.current=null}):void 0}function ha(){}function ya(e,t,n){if(!(25>na))throw a(Error(301));var r=e.alternate;if(e===Vi||null!==r&&r===Vi)if(ea=!0,e={expirationTime:Wi,suspenseConfig:null,action:n,eagerReducer:null,eagerState:null,next:null},null===ta&&(ta=new Map),void 0===(n=ta.get(t)))ta.set(t,e);else{for(t=n;null!==t.next;)t=t.next;t.next=e}else{var o=Ju(),i=vi.suspense;i={expirationTime:o=Zu(o,e,i),suspenseConfig:i,action:n,eagerReducer:null,eagerState:null,next:null};var u=t.last;if(null===u)i.next=i;else{var l=u.next;null!==l&&(i.next=l),u.next=i}if(t.last=i,0===e.expirationTime&&(null===r||0===r.expirationTime)&&null!==(r=t.lastRenderedReducer))try{var c=t.lastRenderedState,s=r(c,n);if(i.eagerReducer=r,i.eagerState=s,Kr(s,c))return}catch(e){}nl(e,o)}}var va={readContext:oi,useCallback:ra,useContext:ra,useEffect:ra,useImperativeHandle:ra,useLayoutEffect:ra,useMemo:ra,useReducer:ra,useRef:ra,useState:ra,useDebugValue:ra,useResponder:ra},ba={readContext:oi,useCallback:function(e,t){return ua().memoizedState=[e,void 0===t?null:t],e},useContext:oi,useEffect:function(e,t){return pa(516,192,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,pa(4,36,ma.bind(null,t,e),n)},useLayoutEffect:function(e,t){return pa(4,36,e,t)},useMemo:function(e,t){var n=ua();return t=void 0===t?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=ua();return t=void 0!==n?n(t):t,r.memoizedState=r.baseState=t,e=(e=r.queue={last:null,dispatch:null,lastRenderedReducer:e,lastRenderedState:t}).dispatch=ya.bind(null,Vi,e),[r.memoizedState,e]},useRef:function(e){return e={current:e},ua().memoizedState=e},useState:function(e){var t=ua();return"function"==typeof e&&(e=e()),t.memoizedState=t.baseState=e,e=(e=t.queue={last:null,dispatch:null,lastRenderedReducer:ca,lastRenderedState:e}).dispatch=ya.bind(null,Vi,e),[t.memoizedState,e]},useDebugValue:ha,useResponder:Bi},ga={readContext:oi,useCallback:function(e,t){var n=la();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&oa(t,r[1])?r[0]:(n.memoizedState=[e,t],e)},useContext:oi,useEffect:function(e,t){return da(516,192,e,t)},useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,da(4,36,ma.bind(null,t,e),n)},useLayoutEffect:function(e,t){return da(4,36,e,t)},useMemo:function(e,t){var n=la();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&oa(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)},useReducer:sa,useRef:function(){return la().memoizedState},useState:function(e){return sa(ca)},useDebugValue:ha,useResponder:Bi},wa=null,Ea=null,ka=!1;function xa(e,t){var n=Ul(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function Sa(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);case 13:default:return!1}}function _a(e){if(ka){var t=Ea;if(t){var n=t;if(!Sa(e,t)){if(!(t=tr(n.nextSibling))||!Sa(e,t))return e.effectTag=e.effectTag&~gt|bt,ka=!1,void(wa=e);xa(wa,n)}wa=e,Ea=tr(t.firstChild)}else e.effectTag=e.effectTag&~gt|bt,ka=!1,wa=e}}function Ta(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&13!==e.tag;)e=e.return;wa=e}function Ca(e){if(e!==wa)return!1;if(!ka)return Ta(e),ka=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!Jn(t,e.memoizedProps))for(t=Ea;t;)xa(e,t),t=tr(t.nextSibling);if(Ta(e),13===e.tag)if(null===(e=null!==(e=e.memoizedState)?e.dehydrated:null))e=Ea;else e:{for(e=e.nextSibling,t=0;e;){if(8===e.nodeType){var n=e.data;if(n===Qn){if(0===t){e=tr(e.nextSibling);break e}t--}else n!==Vn&&n!==Kn&&n!==Hn||t++}e=e.nextSibling}e=null}else e=wa?tr(e.stateNode.nextSibling):null;return Ea=e,!0}function Oa(){Ea=wa=null,ka=!1}var Pa=I.ReactCurrentOwner,Na=!1;function ja(e,t,n,r){t.child=null===e?Ni(t,null,n,r):Pi(t,e.child,n,r)}function Ra(e,t,n,r,o){n=n.render;var i=t.ref;return ri(t,o),r=ia(e,t,n,r,i,o),null===e||Na?(t.effectTag|=1,ja(e,t,r,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),Ka(e,t,o))}function Ia(e,t,n,r,o,i){if(null===e){var a=n.type;return"function"!=typeof a||Ll(a)||void 0!==a.defaultProps||null!==n.compare||void 0!==n.defaultProps?((e=Al(n.type,null,r,null,t.mode,i)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=a,Ma(e,t,a,r,o,i))}return a=e.child,o<i&&(o=a.memoizedProps,(n=null!==(n=n.compare)?n:Gr)(o,r)&&e.ref===t.ref)?Ka(e,t,i):(t.effectTag|=1,(e=zl(a,r)).ref=t.ref,e.return=t,t.child=e)}function Ma(e,t,n,r,o,i){return null!==e&&Gr(e.memoizedProps,r)&&e.ref===t.ref&&(Na=!1,o<i)?Ka(e,t,i):La(e,t,n,r,i)}function Ua(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function La(e,t,n,r,o){var i=ho(n)?po:so.current;return i=mo(t,i),ri(t,o),n=ia(e,t,n,r,i,o),null===e||Na?(t.effectTag|=1,ja(e,t,n,o),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=o&&(e.expirationTime=0),Ka(e,t,o))}function za(e,t,n,r,o){if(ho(n)){var i=!0;wo(t)}else i=!1;if(ri(t,o),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=bt),ki(t,n,r),Si(t,n,r,o),r=!0;else if(null===e){var a=t.stateNode,u=t.memoizedProps;a.props=u;var l=a.context,c=n.contextType;"object"==typeof c&&null!==c?c=oi(c):c=mo(t,c=ho(n)?po:so.current);var s=n.getDerivedStateFromProps,f="function"==typeof s||"function"==typeof a.getSnapshotBeforeUpdate;f||"function"!=typeof a.UNSAFE_componentWillReceiveProps&&"function"!=typeof a.componentWillReceiveProps||(u!==r||l!==c)&&xi(t,a,r,c),ii=!1;var p=t.memoizedState;l=a.state=p;var d=t.updateQueue;null!==d&&(mi(t,d,r,a,o),l=t.memoizedState),u!==r||p!==l||fo.current||ii?("function"==typeof s&&(gi(t,n,s,r),l=t.memoizedState),(u=ii||Ei(t,n,u,r,p,l,c))?(f||"function"!=typeof a.UNSAFE_componentWillMount&&"function"!=typeof a.componentWillMount||("function"==typeof a.componentWillMount&&a.componentWillMount(),"function"==typeof a.UNSAFE_componentWillMount&&a.UNSAFE_componentWillMount()),"function"==typeof a.componentDidMount&&(t.effectTag|=4)):("function"==typeof a.componentDidMount&&(t.effectTag|=4),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=c,r=u):("function"==typeof a.componentDidMount&&(t.effectTag|=4),r=!1)}else a=t.stateNode,u=t.memoizedProps,a.props=t.type===t.elementType?u:Ko(t.type,u),l=a.context,"object"==typeof(c=n.contextType)&&null!==c?c=oi(c):c=mo(t,c=ho(n)?po:so.current),(f="function"==typeof(s=n.getDerivedStateFromProps)||"function"==typeof a.getSnapshotBeforeUpdate)||"function"!=typeof a.UNSAFE_componentWillReceiveProps&&"function"!=typeof a.componentWillReceiveProps||(u!==r||l!==c)&&xi(t,a,r,c),ii=!1,l=t.memoizedState,p=a.state=l,null!==(d=t.updateQueue)&&(mi(t,d,r,a,o),p=t.memoizedState),u!==r||l!==p||fo.current||ii?("function"==typeof s&&(gi(t,n,s,r),p=t.memoizedState),(s=ii||Ei(t,n,u,r,l,p,c))?(f||"function"!=typeof a.UNSAFE_componentWillUpdate&&"function"!=typeof a.componentWillUpdate||("function"==typeof a.componentWillUpdate&&a.componentWillUpdate(r,p,c),"function"==typeof a.UNSAFE_componentWillUpdate&&a.UNSAFE_componentWillUpdate(r,p,c)),"function"==typeof a.componentDidUpdate&&(t.effectTag|=4),"function"==typeof a.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof a.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof a.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=s):("function"!=typeof a.componentDidUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof a.getSnapshotBeforeUpdate||u===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),r=!1);return Aa(e,t,n,r,i,o)}function Aa(e,t,n,r,o,i){Ua(e,t);var a=(64&t.effectTag)!==vt;if(!r&&!a)return o&&Eo(t,n,!1),Ka(e,t,i);r=t.stateNode,Pa.current=t;var u=a&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.effectTag|=1,null!==e&&a?(t.child=Pi(t,e.child,null,i),t.child=Pi(t,null,u,i)):ja(e,t,u,i),t.memoizedState=r.state,o&&Eo(t,n,!0),t.child}function Da(e){var t=e.stateNode;t.pendingContext?bo(0,t.pendingContext,t.pendingContext!==t.context):t.context&&bo(0,t.context,!1),Li(e,t.containerInfo)}var Fa,qa,Ba,$a,Wa={dehydrated:null,retryTime:1};function Va(e,t,n){var r,o=t.mode,i=t.pendingProps,a=Fi.current,u=!1;if((r=(64&t.effectTag)!==vt)||(r=0!=(2&a)&&(null===e||null!==e.memoizedState)),r?(u=!0,t.effectTag&=-65):null!==e&&null===e.memoizedState||void 0===i.fallback||!0===i.unstable_avoidThisFallback||(a|=1),lo(Fi,1&a),null===e){if(u){if(u=i.fallback,(i=Dl(null,o,0,null)).return=t,0==(2&t.mode))for(e=null!==t.memoizedState?t.child.child:t.child,i.child=e;null!==e;)e.return=i,e=e.sibling;return(n=Dl(u,o,n,null)).return=t,i.sibling=n,t.memoizedState=Wa,t.child=i,n}return o=i.children,t.memoizedState=null,t.child=Ni(t,null,o,n)}if(null!==e.memoizedState){if(o=(e=e.child).sibling,u){if(i=i.fallback,(n=zl(e,e.pendingProps)).return=t,0==(2&t.mode)&&(u=null!==t.memoizedState?t.child.child:t.child)!==e.child)for(n.child=u;null!==u;)u.return=n,u=u.sibling;return(o=zl(o,i,o.expirationTime)).return=t,n.sibling=o,n.childExpirationTime=0,t.memoizedState=Wa,t.child=n,o}return n=Pi(t,e.child,i.children,n),t.memoizedState=null,t.child=n}if(e=e.child,u){if(u=i.fallback,(i=Dl(null,o,0,null)).return=t,i.child=e,null!==e&&(e.return=i),0==(2&t.mode))for(e=null!==t.memoizedState?t.child.child:t.child,i.child=e;null!==e;)e.return=i,e=e.sibling;return(n=Dl(u,o,n,null)).return=t,i.sibling=n,n.effectTag|=bt,i.childExpirationTime=0,t.memoizedState=Wa,t.child=i,n}return t.memoizedState=null,t.child=Pi(t,e,i.children,n)}function Qa(e,t,n,r,o){var i=e.memoizedState;null===i?e.memoizedState={isBackwards:t,rendering:null,last:r,tail:n,tailExpiration:0,tailMode:o}:(i.isBackwards=t,i.rendering=null,i.last=r,i.tail=n,i.tailExpiration=0,i.tailMode=o)}function Ha(e,t,n){var r=t.pendingProps,o=r.revealOrder,i=r.tail;if(ja(e,t,r.children,n),0!=(2&(r=Fi.current)))r=1&r|2,t.effectTag|=64;else{if(null!==e&&(64&e.effectTag)!==vt)e:for(e=t.child;null!==e;){if(13===e.tag){if(null!==e.memoizedState){e.expirationTime<n&&(e.expirationTime=n);var a=e.alternate;null!==a&&a.expirationTime<n&&(a.expirationTime=n),ni(e.return,n)}}else if(null!==e.child){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;null===e.sibling;){if(null===e.return||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(lo(Fi,r),0==(2&t.mode))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;null!==n;)null!==(r=n.alternate)&&null===qi(r)&&(o=n),n=n.sibling;null===(n=o)?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Qa(t,!1,o,n,i);break;case"backwards":for(n=null,o=t.child,t.child=null;null!==o;){if(null!==(r=o.alternate)&&null===qi(r)){t.child=o;break}r=o.sibling,o.sibling=n,n=o,o=r}Qa(t,!0,n,null,i);break;case"together":Qa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ka(e,t,n){null!==e&&(t.dependencies=e.dependencies);var r=t.expirationTime;if(0!==r&&vl(r),t.childExpirationTime<n)return null;if(null!==e&&t.child!==e.child)throw a(Error(153));if(null!==t.child){for(n=zl(e=t.child,e.pendingProps,e.expirationTime),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=zl(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function Ya(e){e.effectTag|=4}function Ga(e,t){switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;null!==t;)null!==t.alternate&&(n=t),t=t.sibling;null===n?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;null!==n;)null!==n.alternate&&(r=n),n=n.sibling;null===r?t||null===e.tail?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Xa(e){switch(e.tag){case 1:ho(e.type)&&yo();var t=e.effectTag;return 4096&t?(e.effectTag=-4097&t|64,e):null;case 3:if(zi(),vo(),(64&(t=e.effectTag))!==vt)throw a(Error(285));return e.effectTag=-4097&t|64,e;case 5:return Di(e),null;case 13:return uo(Fi),4096&(t=e.effectTag)?(e.effectTag=-4097&t|64,e):null;case 19:return uo(Fi),null;case 4:return zi(),null;case 10:return ti(e),null;default:return null}}function Ja(e,t){return{value:e,source:t,stack:J(t)}}Fa=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)e.appendChild(n.stateNode);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},qa=function(){},Ba=function(e,t,n,r,i){var a=e.memoizedProps;if(a!==r){var u,l,c=t.stateNode;switch(Ui(Ri.current),e=null,n){case"input":a=Te(c,a),r=Te(c,r),e=[];break;case"option":a=Re(c,a),r=Re(c,r),e=[];break;case"select":a=o({},a,{value:void 0}),r=o({},r,{value:void 0}),e=[];break;case"textarea":a=Me(c,a),r=Me(c,r),e=[];break;default:"function"!=typeof a.onClick&&"function"==typeof r.onClick&&(c.onclick=Dn)}for(u in Ln(n,r),n=null,a)if(!r.hasOwnProperty(u)&&a.hasOwnProperty(u)&&null!=a[u])if("style"===u)for(l in c=a[u])c.hasOwnProperty(l)&&(n||(n={}),n[l]="");else"dangerouslySetInnerHTML"!==u&&"children"!==u&&"suppressContentEditableWarning"!==u&&"suppressHydrationWarning"!==u&&"autoFocus"!==u&&(d.hasOwnProperty(u)?e||(e=[]):(e=e||[]).push(u,null));for(u in r){var s=r[u];if(c=null!=a?a[u]:void 0,r.hasOwnProperty(u)&&s!==c&&(null!=s||null!=c))if("style"===u)if(c){for(l in c)!c.hasOwnProperty(l)||s&&s.hasOwnProperty(l)||(n||(n={}),n[l]="");for(l in s)s.hasOwnProperty(l)&&c[l]!==s[l]&&(n||(n={}),n[l]=s[l])}else n||(e||(e=[]),e.push(u,n)),n=s;else"dangerouslySetInnerHTML"===u?(s=s?s.__html:void 0,c=c?c.__html:void 0,null!=s&&c!==s&&(e=e||[]).push(u,""+s)):"children"===u?c===s||"string"!=typeof s&&"number"!=typeof s||(e=e||[]).push(u,""+s):"suppressContentEditableWarning"!==u&&"suppressHydrationWarning"!==u&&(d.hasOwnProperty(u)?(null!=s&&An(i,u),e||c===s||(e=[])):(e=e||[]).push(u,s))}n&&(e=e||[]).push("style",n),i=e,(t.updateQueue=i)&&Ya(t)}},$a=function(e,t,n,r){n!==r&&Ya(t)};var Za="function"==typeof WeakSet?WeakSet:Set;function eu(e,t){var n=t.source,r=t.stack;null===r&&null!==n&&(r=J(n)),null!==n&&X(n.type),t=t.value,null!==e&&1===e.tag&&X(e.type);try{console.error(t)}catch(e){setTimeout((function(){throw e}))}}function tu(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){Pl(e,t)}else t.current=null}function nu(e,t){switch(t.tag){case 0:case 11:case 15:ru(2,0,t);break;case 1:if(256&t.effectTag&&null!==e){var n=e.memoizedProps,r=e.memoizedState;t=(e=t.stateNode).getSnapshotBeforeUpdate(t.elementType===t.type?n:Ko(t.type,n),r),e.__reactInternalSnapshotBeforeUpdate=t}break;case 3:case 5:case 6:case 4:case 17:break;default:throw a(Error(163))}}function ru(e,t,n){if(null!==(n=null!==(n=n.updateQueue)?n.lastEffect:null)){var r=n=n.next;do{if(0!=(r.tag&e)){var o=r.destroy;r.destroy=void 0,void 0!==o&&o()}0!=(r.tag&t)&&(o=r.create,r.destroy=o()),r=r.next}while(r!==n)}}function ou(e,t,n){switch("function"==typeof Il&&Il(t),t.tag){case 0:case 11:case 14:case 15:if(null!==(e=t.updateQueue)&&null!==(e=e.lastEffect)){var r=e.next;$o(97<n?97:n,(function(){var e=r;do{var n=e.destroy;if(void 0!==n){var o=t;try{n()}catch(e){Pl(o,e)}}e=e.next}while(e!==r)}))}break;case 1:tu(t),"function"==typeof(n=t.stateNode).componentWillUnmount&&function(e,t){try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){Pl(e,t)}}(t,n);break;case 5:tu(t);break;case 4:lu(e,t,n)}}function iu(e){var t=e.alternate;e.return=null,e.child=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.alternate=null,e.firstEffect=null,e.lastEffect=null,e.pendingProps=null,e.memoizedProps=null,null!==t&&iu(t)}function au(e){return 5===e.tag||3===e.tag||4===e.tag}function uu(e){e:{for(var t=e.return;null!==t;){if(au(t)){var n=t;break e}t=t.return}throw a(Error(160))}switch(t=n.stateNode,n.tag){case 5:var r=!1;break;case 3:case 4:t=t.containerInfo,r=!0;break;default:throw a(Error(161))}16&n.effectTag&&($e(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||au(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag&&18!==n.tag;){if(n.effectTag&bt)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(n.effectTag&bt)){n=n.stateNode;break e}}for(var o=e;;){var i=5===o.tag||6===o.tag;if(i){var u=i?o.stateNode:o.stateNode.instance;if(n)if(r){var l=u;u=n,8===(i=t).nodeType?i.parentNode.insertBefore(l,u):i.insertBefore(l,u)}else t.insertBefore(u,n);else r?(8===(l=t).nodeType?(i=l.parentNode).insertBefore(u,l):(i=l).appendChild(u),null!=(l=l._reactRootContainer)||null!==i.onclick||(i.onclick=Dn)):t.appendChild(u)}else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function lu(e,t,n){for(var r,o,i=t,u=!1;;){if(!u){u=i.return;e:for(;;){if(null===u)throw a(Error(160));switch(r=u.stateNode,u.tag){case 5:o=!1;break e;case 3:case 4:r=r.containerInfo,o=!0;break e}u=u.return}u=!0}if(5===i.tag||6===i.tag){e:for(var l=e,c=i,s=n,f=c;;)if(ou(l,f,s),null!==f.child&&4!==f.tag)f.child.return=f,f=f.child;else{if(f===c)break;for(;null===f.sibling;){if(null===f.return||f.return===c)break e;f=f.return}f.sibling.return=f.return,f=f.sibling}o?(l=r,c=i.stateNode,8===l.nodeType?l.parentNode.removeChild(c):l.removeChild(c)):r.removeChild(i.stateNode)}else if(4===i.tag){if(null!==i.child){r=i.stateNode.containerInfo,o=!0,i.child.return=i,i=i.child;continue}}else if(ou(e,i,n),null!==i.child){i.child.return=i,i=i.child;continue}if(i===t)break;for(;null===i.sibling;){if(null===i.return||i.return===t)return;4===(i=i.return).tag&&(u=!1)}i.sibling.return=i.return,i=i.sibling}}function cu(e,t){switch(t.tag){case 0:case 11:case 14:case 15:ru(4,8,t);break;case 1:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps,o=null!==e?e.memoizedProps:r;e=t.type;var i=t.updateQueue;if(t.updateQueue=null,null!==i){for(n[ir]=r,"input"===e&&"radio"===r.type&&null!=r.name&&Oe(n,r),zn(e,o),t=zn(e,r),o=0;o<i.length;o+=2){var u=i[o],l=i[o+1];"style"===u?Mn(n,l):"dangerouslySetInnerHTML"===u?Be(n,l):"children"===u?$e(n,l):ke(n,u,l,t)}switch(e){case"input":Pe(n,r);break;case"textarea":Le(n,r);break;case"select":t=n._wrapperState.wasMultiple,n._wrapperState.wasMultiple=!!r.multiple,null!=(e=r.value)?Ie(n,!!r.multiple,e,!1):t!==!!r.multiple&&(null!=r.defaultValue?Ie(n,!!r.multiple,r.defaultValue,!0):Ie(n,!!r.multiple,r.multiple?[]:"",!1))}}}break;case 6:if(null===t.stateNode)throw a(Error(162));t.stateNode.nodeValue=t.memoizedProps;break;case 3:(t=t.stateNode).hydrate&&(t.hydrate=!1,yt(t.containerInfo));break;case 12:break;case 13:if(n=t,null===t.memoizedState?r=!1:(r=!0,n=t.child,Du=Fo()),null!==n)e:for(e=n;;){if(5===e.tag)i=e.stateNode,r?"function"==typeof(i=i.style).setProperty?i.setProperty("display","none","important"):i.display="none":(i=e.stateNode,o=null!=(o=e.memoizedProps.style)&&o.hasOwnProperty("display")?o.display:null,i.style.display=In("display",o));else if(6===e.tag)e.stateNode.nodeValue=r?"":e.memoizedProps;else{if(13===e.tag&&null!==e.memoizedState&&null===e.memoizedState.dehydrated){(i=e.child.sibling).return=e,e=i;continue}if(null!==e.child){e.child.return=e,e=e.child;continue}}if(e===n)break e;for(;null===e.sibling;){if(null===e.return||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}su(t);break;case 19:su(t);break;case 17:case 20:case 21:break;default:throw a(Error(163))}}function su(e){var t=e.updateQueue;if(null!==t){e.updateQueue=null;var n=e.stateNode;null===n&&(n=e.stateNode=new Za),t.forEach((function(t){var r=jl.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))}))}}var fu="function"==typeof WeakMap?WeakMap:Map;function pu(e,t,n){(n=li(n,null)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Bu||(Bu=!0,$u=r),eu(e,t)},n}function du(e,t,n){(n=li(n,null)).tag=3;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var o=t.value;n.payload=function(){return eu(e,t),r(o)}}var i=e.stateNode;return null!==i&&"function"==typeof i.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===Wu?Wu=new Set([this]):Wu.add(this),eu(e,t));var n=t.stack;this.componentDidCatch(t.value,{componentStack:null!==n?n:""})}),n}var mu=Math.ceil,hu=I.ReactCurrentDispatcher,yu=I.ReactCurrentOwner,vu=0,bu=8,gu=16,wu=32,Eu=0,ku=1,xu=2,Su=3,_u=4,Tu=5,Cu=6,Ou=vu,Pu=null,Nu=null,ju=0,Ru=Eu,Iu=null,Mu=1073741823,Uu=1073741823,Lu=null,zu=0,Au=!1,Du=0,Fu=500,qu=null,Bu=!1,$u=null,Wu=null,Vu=!1,Qu=null,Hu=90,Ku=null,Yu=0,Gu=null,Xu=0;function Ju(){return(Ou&(gu|wu))!==vu?1073741821-(Fo()/10|0):0!==Xu?Xu:Xu=1073741821-(Fo()/10|0)}function Zu(e,t,n){if(0==(2&(t=t.mode)))return 1073741823;var r=qo();if(0==(4&t))return 99===r?1073741823:1073741822;if((Ou&gu)!==vu)return ju;if(null!==n)e=1073741821-25*(1+((1073741821-e+(0|n.timeoutMs||5e3)/10)/25|0));else switch(r){case 99:e=1073741823;break;case 98:e=1073741821-10*(1+((1073741821-e+15)/10|0));break;case 97:case 96:e=1073741821-25*(1+((1073741821-e+500)/25|0));break;case 95:e=2;break;default:throw a(Error(326))}return null!==Pu&&e===ju&&--e,e}var el,tl=0;function nl(e,t){if(50<Yu)throw Yu=0,Gu=null,a(Error(185));if(null!==(e=rl(e,t))){var n=qo();1073741823===t?(Ou&bu)!==vu&&(Ou&(gu|wu))===vu?ul(e):(il(e),Ou===vu&&Qo()):il(e),(4&Ou)===vu||98!==n&&99!==n||(null===Ku?Ku=new Map([[e,t]]):(void 0===(n=Ku.get(e))||n>t)&&Ku.set(e,t))}}function rl(e,t){e.expirationTime<t&&(e.expirationTime=t);var n=e.alternate;null!==n&&n.expirationTime<t&&(n.expirationTime=t);var r=e.return,o=null;if(null===r&&3===e.tag)o=e.stateNode;else for(;null!==r;){if(n=r.alternate,r.childExpirationTime<t&&(r.childExpirationTime=t),null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t),null===r.return&&3===r.tag){o=r.stateNode;break}r=r.return}return null!==o&&(Pu===o&&(vl(t),Ru===_u&&Wl(o,ju)),Vl(o,t)),o}function ol(e){var t=e.lastExpiredTime;return 0!==t?t:$l(e,t=e.firstPendingTime)?(t=e.lastPingedTime)>(e=e.nextKnownPendingLevel)?t:e:t}function il(e){if(0!==e.lastExpiredTime)e.callbackExpirationTime=1073741823,e.callbackPriority=99,e.callbackNode=Vo(ul.bind(null,e));else{var t=ol(e),n=e.callbackNode;if(0===t)null!==n&&(e.callbackNode=null,e.callbackExpirationTime=0,e.callbackPriority=90);else{var r=Ju();if(1073741823===t?r=99:1===t||2===t?r=95:r=0>=(r=10*(1073741821-t)-10*(1073741821-r))?99:250>=r?98:5250>=r?97:95,null!==n){var o=e.callbackPriority;if(e.callbackExpirationTime===t&&o>=r)return;n!==Mo&&So(n)}e.callbackExpirationTime=t,e.callbackPriority=r,t=1073741823===t?Vo(ul.bind(null,e)):Wo(r,al.bind(null,e),{timeout:10*(1073741821-t)-Fo()}),e.callbackNode=t}}}function al(e,t){if(Xu=0,t)return Ql(e,t=Ju()),il(e),null;var n=ol(e);if(0!==n){if(t=e.callbackNode,(Ou&(gu|wu))!==vu)throw a(Error(327));if(Tl(),e===Pu&&n===ju||dl(e,n),null!==Nu){var r=Ou;Ou|=gu;for(var o=hl();;)try{gl();break}catch(t){ml(e,t)}if(Zo(),Ou=r,hu.current=o,Ru===ku)throw t=Iu,dl(e,n),Wl(e,n),il(e),t;if(null===Nu)switch(o=e.finishedWork=e.current.alternate,e.finishedExpirationTime=n,cl(e,n),r=Ru,Pu=null,r){case Eu:case ku:throw a(Error(345));case xu:if(2!==n){Ql(e,2);break}xl(e);break;case Su:if(Wl(e,n),n===(r=e.lastSuspendedTime)&&(e.nextKnownPendingLevel=kl(o)),1073741823===Mu&&10<(o=Du+Fu-Fo())){if(Au){var i=e.lastPingedTime;if(0===i||i>=n){e.lastPingedTime=n,dl(e,n);break}}if(0!==(i=ol(e))&&i!==n)break;if(0!==r&&r!==n){e.lastPingedTime=r;break}e.timeoutHandle=Zn(xl.bind(null,e),o);break}xl(e);break;case _u:if(Wl(e,n),n===(r=e.lastSuspendedTime)&&(e.nextKnownPendingLevel=kl(o)),Au&&(0===(o=e.lastPingedTime)||o>=n)){e.lastPingedTime=n,dl(e,n);break}if(0!==(o=ol(e))&&o!==n)break;if(0!==r&&r!==n){e.lastPingedTime=r;break}if(1073741823!==Uu?r=10*(1073741821-Uu)-Fo():1073741823===Mu?r=0:(r=10*(1073741821-Mu)-5e3,0>(r=(o=Fo())-r)&&(r=0),(n=10*(1073741821-n)-o)<(r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*mu(r/1960))-r)&&(r=n)),10<r){e.timeoutHandle=Zn(xl.bind(null,e),r);break}xl(e);break;case Tu:if(1073741823!==Mu&&null!==Lu){i=Mu;var u=Lu;if(0>=(r=0|u.busyMinDurationMs)?r=0:(o=0|u.busyDelayMs,r=(i=Fo()-(10*(1073741821-i)-(0|u.timeoutMs||5e3)))<=o?0:o+r-i),10<r){Wl(e,n),e.timeoutHandle=Zn(xl.bind(null,e),r);break}}xl(e);break;case Cu:Wl(e,n);break;default:throw a(Error(329))}if(il(e),e.callbackNode===t)return al.bind(null,e)}}return null}function ul(e){var t=e.lastExpiredTime;if(t=0!==t?t:1073741823,e.finishedExpirationTime===t)xl(e);else{if((Ou&(gu|wu))!==vu)throw a(Error(327));if(Tl(),e===Pu&&t===ju||dl(e,t),null!==Nu){var n=Ou;Ou|=gu;for(var r=hl();;)try{bl();break}catch(t){ml(e,t)}if(Zo(),Ou=n,hu.current=r,Ru===ku)throw n=Iu,dl(e,t),Wl(e,t),il(e),n;if(null!==Nu)throw a(Error(261));e.finishedWork=e.current.alternate,e.finishedExpirationTime=t,cl(e,t),Ru===Cu?Wl(e,t):(Pu=null,xl(e)),il(e)}}return null}function ll(){(Ou&(1|gu|wu))===vu&&(function(){if(null!==Ku){var e=Ku;Ku=null,e.forEach((function(e,t){Ql(t,e),il(t)})),Qo()}}(),Tl())}function cl(e,t){var n=e.firstBatch;null!==n&&n._defer&&n._expirationTime>=t&&(Wo(97,(function(){return n._onComplete(),null})),Ru=Cu)}function sl(e,t){var n=Ou;Ou|=1;try{return e(t)}finally{(Ou=n)===vu&&Qo()}}function fl(e,t,n,r){var o=Ou;Ou|=4;try{return $o(98,e.bind(null,t,n,r))}finally{(Ou=o)===vu&&Qo()}}function pl(e,t){var n=Ou;Ou&=-2,Ou|=bu;try{return e(t)}finally{(Ou=n)===vu&&Qo()}}function dl(e,t){e.finishedWork=null,e.finishedExpirationTime=0;var n=e.timeoutHandle;if(-1!==n&&(e.timeoutHandle=-1,er(n)),null!==Nu)for(n=Nu.return;null!==n;){var r=n;switch(r.tag){case 1:var o=r.type.childContextTypes;null!=o&&yo();break;case 3:zi(),vo();break;case 5:Di(r);break;case 4:zi();break;case 13:case 19:uo(Fi);break;case 10:ti(r)}n=n.return}Pu=e,Nu=zl(e.current,null),ju=t,Ru=Eu,Iu=null,Uu=Mu=1073741823,Lu=null,zu=0,Au=!1}function ml(e,t){for(;;){try{if(Zo(),aa(),null===Nu||null===Nu.return)return Ru=ku,Iu=t,null;e:{var n=e,r=Nu.return,o=Nu,i=t;if(t=ju,o.effectTag|=2048,o.firstEffect=o.lastEffect=null,null!==i&&"object"==typeof i&&"function"==typeof i.then){var a=i,u=0!=(1&Fi.current),l=r;do{var c;if(c=13===l.tag){var s=l.memoizedState;if(null!==s)c=null!==s.dehydrated;else{var f=l.memoizedProps;c=void 0!==f.fallback&&(!0!==f.unstable_avoidThisFallback||!u)}}if(c){var p=l.updateQueue;if(null===p){var d=new Set;d.add(a),l.updateQueue=d}else p.add(a);if(0==(2&l.mode)){if(l.effectTag|=64,o.effectTag&=-2981,1===o.tag)if(null===o.alternate)o.tag=17;else{var m=li(1073741823,null);m.tag=2,si(o,m)}o.expirationTime=1073741823;break e}i=void 0,o=t;var h=n.pingCache;if(null===h?(h=n.pingCache=new fu,i=new Set,h.set(a,i)):void 0===(i=h.get(a))&&(i=new Set,h.set(a,i)),!i.has(o)){i.add(o);var y=Nl.bind(null,n,a,o);a.then(y,y)}l.effectTag|=4096,l.expirationTime=t;break e}l=l.return}while(null!==l);i=Error((X(o.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+J(o))}Ru!==Tu&&(Ru=xu),i=Ja(i,o),l=r;do{switch(l.tag){case 3:a=i,l.effectTag|=4096,l.expirationTime=t,fi(l,pu(l,a,t));break e;case 1:a=i;var v=l.type,b=l.stateNode;if((64&l.effectTag)===vt&&("function"==typeof v.getDerivedStateFromError||null!==b&&"function"==typeof b.componentDidCatch&&(null===Wu||!Wu.has(b)))){l.effectTag|=4096,l.expirationTime=t,fi(l,du(l,a,t));break e}}l=l.return}while(null!==l)}Nu=El(Nu)}catch(e){t=e;continue}break}}function hl(){var e=hu.current;return hu.current=va,null===e?va:e}function yl(e,t){e<Mu&&2<e&&(Mu=e),null!==t&&e<Uu&&2<e&&(Uu=e,Lu=t)}function vl(e){e>zu&&(zu=e)}function bl(){for(;null!==Nu;)Nu=wl(Nu)}function gl(){for(;null!==Nu&&!_o();)Nu=wl(Nu)}function wl(e){var t=el(e.alternate,e,ju);return e.memoizedProps=e.pendingProps,null===t&&(t=El(e)),yu.current=null,t}function El(e){Nu=e;do{var t=Nu.alternate;if(e=Nu.return,(2048&Nu.effectTag)===vt){e:{var n=t,r=ju,i=(t=Nu).pendingProps;switch(t.tag){case 2:case 16:break;case 15:case 0:break;case 1:ho(t.type)&&yo();break;case 3:zi(),vo(),(r=t.stateNode).pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(null===n||null===n.child)&&Ca(t)&&Ya(t),qa(t);break;case 5:Di(t),r=Ui(Mi.current);var u=t.type;if(null!==n&&null!=t.stateNode)Ba(n,t,u,i,r),n.ref!==t.ref&&(t.effectTag|=128);else if(i){var l=Ui(Ri.current);if(Ca(t)){u=void 0,n=(i=t).stateNode;var c=i.type,s=i.memoizedProps;switch(n[or]=i,n[ir]=s,c){case"iframe":case"object":case"embed":wn("load",n);break;case"video":case"audio":for(var f=0;f<Ze.length;f++)wn(Ze[f],n);break;case"source":wn("error",n);break;case"img":case"image":case"link":wn("error",n),wn("load",n);break;case"form":wn("reset",n),wn("submit",n);break;case"details":wn("toggle",n);break;case"input":Ce(n,s),wn("invalid",n),An(r,"onChange");break;case"select":n._wrapperState={wasMultiple:!!s.multiple},wn("invalid",n),An(r,"onChange");break;case"textarea":Ue(n,s),wn("invalid",n),An(r,"onChange")}for(u in Ln(c,s),f=null,s)s.hasOwnProperty(u)&&(l=s[u],"children"===u?"string"==typeof l?n.textContent!==l&&(f=["children",l]):"number"==typeof l&&n.textContent!==""+l&&(f=["children",""+l]):d.hasOwnProperty(u)&&null!=l&&An(r,u));switch(c){case"input":Se(n),Ne(n,s,!0);break;case"textarea":Se(n),ze(n);break;case"select":case"option":break;default:"function"==typeof s.onClick&&(n.onclick=Dn)}r=f,i.updateQueue=r,null!==r&&Ya(t)}else{s=u,n=i,c=t,f=9===r.nodeType?r:r.ownerDocument,l===Ae.html&&(l=De(s)),l===Ae.html?"script"===s?((s=f.createElement("div")).innerHTML="<script><\/script>",f=s.removeChild(s.firstChild)):"string"==typeof n.is?f=f.createElement(s,{is:n.is}):(f=f.createElement(s),"select"===s&&(s=f,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):f=f.createElementNS(l,s),(s=f)[or]=c,s[ir]=n,Fa(n=s,t,!1,!1),t.stateNode=n,l=r;var p=zn(u,i);switch(u){case"iframe":case"object":case"embed":wn("load",n),r=i;break;case"video":case"audio":for(r=0;r<Ze.length;r++)wn(Ze[r],n);r=i;break;case"source":wn("error",n),r=i;break;case"img":case"image":case"link":wn("error",n),wn("load",n),r=i;break;case"form":wn("reset",n),wn("submit",n),r=i;break;case"details":wn("toggle",n),r=i;break;case"input":Ce(n,i),r=Te(n,i),wn("invalid",n),An(l,"onChange");break;case"option":r=Re(n,i);break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=o({},i,{value:void 0}),wn("invalid",n),An(l,"onChange");break;case"textarea":Ue(n,i),r=Me(n,i),wn("invalid",n),An(l,"onChange");break;default:r=i}Ln(u,r),c=void 0,s=u,f=n;var m=r;for(c in m)if(m.hasOwnProperty(c)){var h=m[c];"style"===c?Mn(f,h):"dangerouslySetInnerHTML"===c?null!=(h=h?h.__html:void 0)&&Be(f,h):"children"===c?"string"==typeof h?("textarea"!==s||""!==h)&&$e(f,h):"number"==typeof h&&$e(f,""+h):"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&"autoFocus"!==c&&(d.hasOwnProperty(c)?null!=h&&An(l,c):null!=h&&ke(f,c,h,p))}switch(u){case"input":Se(n),Ne(n,i,!1);break;case"textarea":Se(n),ze(n);break;case"option":null!=i.value&&n.setAttribute("value",""+Ee(i.value));break;case"select":r=n,n=i,r.multiple=!!n.multiple,null!=(c=n.value)?Ie(r,!!n.multiple,c,!1):null!=n.defaultValue&&Ie(r,!!n.multiple,n.defaultValue,!0);break;default:"function"==typeof r.onClick&&(n.onclick=Dn)}Xn(u,i)&&Ya(t)}null!==t.ref&&(t.effectTag|=128)}else if(null===t.stateNode)throw a(Error(166));break;case 6:if(n&&null!=t.stateNode)$a(n,t,n.memoizedProps,i);else{if("string"!=typeof i&&null===t.stateNode)throw a(Error(166));u=Ui(Mi.current),Ui(Ri.current),Ca(t)?(r=t.stateNode,i=t.memoizedProps,r[or]=t,r.nodeValue!==i&&Ya(t)):(r=t,(i=(9===u.nodeType?u:u.ownerDocument).createTextNode(i))[or]=t,r.stateNode=i)}break;case 11:break;case 13:if(uo(Fi),i=t.memoizedState,(64&t.effectTag)!==vt){t.expirationTime=r;break e}r=null!==i,i=!1,null===n?Ca(t):(i=null!==(u=n.memoizedState),r||null===u||null!==(u=n.child.sibling)&&(null!==(c=t.firstEffect)?(t.firstEffect=u,u.nextEffect=c):(t.firstEffect=t.lastEffect=u,u.nextEffect=null),u.effectTag=8)),r&&!i&&0!=(2&t.mode)&&(null===n&&!0!==t.memoizedProps.unstable_avoidThisFallback||0!=(1&Fi.current)?Ru===Eu&&(Ru=Su):(Ru!==Eu&&Ru!==Su||(Ru=_u),0!==zu&&null!==Pu&&(Wl(Pu,ju),Vl(Pu,zu)))),(r||i)&&(t.effectTag|=4);break;case 7:case 8:case 12:break;case 4:zi(),qa(t);break;case 10:ti(t);break;case 9:case 14:break;case 17:ho(t.type)&&yo();break;case 19:if(uo(Fi),null===(i=t.memoizedState))break;if(u=(64&t.effectTag)!==vt,null===(c=i.rendering)){if(u)Ga(i,!1);else if(Ru!==Eu||null!==n&&(64&n.effectTag)!==vt)for(n=t.child;null!==n;){if(null!==(c=qi(n))){for(t.effectTag|=64,Ga(i,!1),null!==(i=c.updateQueue)&&(t.updateQueue=i,t.effectTag|=4),t.firstEffect=t.lastEffect=null,i=t.child;null!==i;)n=r,(u=i).effectTag&=bt,u.nextEffect=null,u.firstEffect=null,u.lastEffect=null,null===(c=u.alternate)?(u.childExpirationTime=0,u.expirationTime=n,u.child=null,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null):(u.childExpirationTime=c.childExpirationTime,u.expirationTime=c.expirationTime,u.child=c.child,u.memoizedProps=c.memoizedProps,u.memoizedState=c.memoizedState,u.updateQueue=c.updateQueue,n=c.dependencies,u.dependencies=null===n?null:{expirationTime:n.expirationTime,firstContext:n.firstContext,responders:n.responders}),i=i.sibling;lo(Fi,1&Fi.current|2),t=t.child;break e}n=n.sibling}}else{if(!u)if(null!==(n=qi(c))){if(t.effectTag|=64,u=!0,Ga(i,!0),null===i.tail&&"hidden"===i.tailMode){null!==(r=n.updateQueue)&&(t.updateQueue=r,t.effectTag|=4),null!==(t=t.lastEffect=i.lastEffect)&&(t.nextEffect=null);break}}else Fo()>i.tailExpiration&&1<r&&(t.effectTag|=64,u=!0,Ga(i,!1),t.expirationTime=t.childExpirationTime=r-1);i.isBackwards?(c.sibling=t.child,t.child=c):(null!==(r=i.last)?r.sibling=c:t.child=c,i.last=c)}if(null!==i.tail){0===i.tailExpiration&&(i.tailExpiration=Fo()+500),r=i.tail,i.rendering=r,i.tail=r.sibling,i.lastEffect=t.lastEffect,r.sibling=null,i=Fi.current,lo(Fi,i=u?1&i|2:1&i),t=r;break e}break;case 20:case 21:break;default:throw a(Error(156),t.tag)}t=null}if(r=Nu,1===ju||1!==r.childExpirationTime){for(i=0,u=r.child;null!==u;)(n=u.expirationTime)>i&&(i=n),(c=u.childExpirationTime)>i&&(i=c),u=u.sibling;r.childExpirationTime=i}if(null!==t)return t;null!==e&&(2048&e.effectTag)===vt&&(null===e.firstEffect&&(e.firstEffect=Nu.firstEffect),null!==Nu.lastEffect&&(null!==e.lastEffect&&(e.lastEffect.nextEffect=Nu.firstEffect),e.lastEffect=Nu.lastEffect),1<Nu.effectTag&&(null!==e.lastEffect?e.lastEffect.nextEffect=Nu:e.firstEffect=Nu,e.lastEffect=Nu))}else{if(null!==(t=Xa(Nu)))return t.effectTag&=2047,t;null!==e&&(e.firstEffect=e.lastEffect=null,e.effectTag|=2048)}if(null!==(t=Nu.sibling))return t;Nu=e}while(null!==Nu);return Ru===Eu&&(Ru=Tu),null}function kl(e){var t=e.expirationTime;return t>(e=e.childExpirationTime)?t:e}function xl(e){var t=qo();return $o(99,Sl.bind(null,e,t)),null}function Sl(e,t){if(Tl(),(Ou&(gu|wu))!==vu)throw a(Error(327));var n=e.finishedWork,r=e.finishedExpirationTime;if(null===n)return null;if(e.finishedWork=null,e.finishedExpirationTime=0,n===e.current)throw a(Error(177));e.callbackNode=null,e.callbackExpirationTime=0,e.callbackPriority=90,e.nextKnownPendingLevel=0;var o=kl(n);if(e.firstPendingTime=o,r<=e.lastSuspendedTime?e.firstSuspendedTime=e.lastSuspendedTime=e.nextKnownPendingLevel=0:r<=e.firstSuspendedTime&&(e.firstSuspendedTime=r-1),r<=e.lastPingedTime&&(e.lastPingedTime=0),r<=e.lastExpiredTime&&(e.lastExpiredTime=0),e===Pu&&(Nu=Pu=null,ju=0),1<n.effectTag?null!==n.lastEffect?(n.lastEffect.nextEffect=n,o=n.firstEffect):o=n:o=n.firstEffect,null!==o){var i=Ou;Ou|=wu,yu.current=null,Yn=gn;var u=$n();if(Wn(u)){if("selectionStart"in u)var l={start:u.selectionStart,end:u.selectionEnd};else e:{var c=(l=(l=u.ownerDocument)&&l.defaultView||window).getSelection&&l.getSelection();if(c&&0!==c.rangeCount){l=c.anchorNode;var s=c.anchorOffset,f=c.focusNode;c=c.focusOffset;try{l.nodeType,f.nodeType}catch(e){l=null;break e}var p=0,d=-1,m=-1,h=0,y=0,v=u,b=null;t:for(;;){for(var g;v!==l||0!==s&&3!==v.nodeType||(d=p+s),v!==f||0!==c&&3!==v.nodeType||(m=p+c),3===v.nodeType&&(p+=v.nodeValue.length),null!==(g=v.firstChild);)b=v,v=g;for(;;){if(v===u)break t;if(b===l&&++h===s&&(d=p),b===f&&++y===c&&(m=p),null!==(g=v.nextSibling))break;b=(v=b).parentNode}v=g}l=-1===d||-1===m?null:{start:d,end:m}}else l=null}l=l||{start:0,end:0}}else l=null;Gn={focusedElem:u,selectionRange:l},gn=!1,qu=o;do{try{_l()}catch(e){if(null===qu)throw a(Error(330));Pl(qu,e),qu=qu.nextEffect}}while(null!==qu);qu=o;do{try{for(u=e,l=t;null!==qu;){var w=qu.effectTag;if(16&w&&$e(qu.stateNode,""),128&w){var E=qu.alternate;if(null!==E){var k=E.ref;null!==k&&("function"==typeof k?k(null):k.current=null)}}switch(w&(12|bt|gt)){case bt:uu(qu),qu.effectTag&=~bt;break;case 6:uu(qu),qu.effectTag&=~bt,cu(qu.alternate,qu);break;case gt:qu.effectTag&=~gt;break;case 1028:qu.effectTag&=~gt,cu(qu.alternate,qu);break;case 4:cu(qu.alternate,qu);break;case 8:lu(u,s=qu,l),iu(s)}qu=qu.nextEffect}}catch(e){if(null===qu)throw a(Error(330));Pl(qu,e),qu=qu.nextEffect}}while(null!==qu);if(k=Gn,E=$n(),w=k.focusedElem,l=k.selectionRange,E!==w&&w&&w.ownerDocument&&function e(t,n){return!(!t||!n)&&(t===n||(!t||3!==t.nodeType)&&(n&&3===n.nodeType?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}(w.ownerDocument.documentElement,w)){null!==l&&Wn(w)&&(E=l.start,void 0===(k=l.end)&&(k=E),"selectionStart"in w?(w.selectionStart=E,w.selectionEnd=Math.min(k,w.value.length)):(k=(E=w.ownerDocument||document)&&E.defaultView||window).getSelection&&(k=k.getSelection(),s=w.textContent.length,u=Math.min(l.start,s),l=void 0===l.end?u:Math.min(l.end,s),!k.extend&&u>l&&(s=l,l=u,u=s),s=Bn(w,u),f=Bn(w,l),s&&f&&(1!==k.rangeCount||k.anchorNode!==s.node||k.anchorOffset!==s.offset||k.focusNode!==f.node||k.focusOffset!==f.offset)&&((E=E.createRange()).setStart(s.node,s.offset),k.removeAllRanges(),u>l?(k.addRange(E),k.extend(f.node,f.offset)):(E.setEnd(f.node,f.offset),k.addRange(E))))),E=[];for(k=w;k=k.parentNode;)1===k.nodeType&&E.push({element:k,left:k.scrollLeft,top:k.scrollTop});for("function"==typeof w.focus&&w.focus(),w=0;w<E.length;w++)(k=E[w]).element.scrollLeft=k.left,k.element.scrollTop=k.top}Gn=null,gn=!!Yn,Yn=null,e.current=n,qu=o;do{try{for(w=r;null!==qu;){var x=qu.effectTag;if(36&x){var S=qu.alternate;switch(k=w,(E=qu).tag){case 0:case 11:case 15:ru(16,32,E);break;case 1:var _=E.stateNode;if(4&E.effectTag)if(null===S)_.componentDidMount();else{var T=E.elementType===E.type?S.memoizedProps:Ko(E.type,S.memoizedProps);_.componentDidUpdate(T,S.memoizedState,_.__reactInternalSnapshotBeforeUpdate)}var C=E.updateQueue;null!==C&&hi(0,C,_);break;case 3:var O=E.updateQueue;if(null!==O){if(u=null,null!==E.child)switch(E.child.tag){case 5:u=E.child.stateNode;break;case 1:u=E.child.stateNode}hi(0,O,u)}break;case 5:var P=E.stateNode;null===S&&4&E.effectTag&&(k=P,Xn(E.type,E.memoizedProps)&&k.focus());break;case 6:case 4:case 12:break;case 13:if(null===E.memoizedState){var N=E.alternate;if(null!==N){var j=N.memoizedState;if(null!==j){var R=j.dehydrated;null!==R&&yt(R)}}}break;case 19:case 17:case 20:case 21:break;default:throw a(Error(163))}}if(128&x){var I=(E=qu).ref;if(null!==I){var M=E.stateNode;switch(E.tag){case 5:var U=M;break;default:U=M}"function"==typeof I?I(U):I.current=U}}qu=qu.nextEffect}}catch(e){if(null===qu)throw a(Error(330));Pl(qu,e),qu=qu.nextEffect}}while(null!==qu);qu=null,Uo(),Ou=i}else e.current=n;if(Vu)Vu=!1,Qu=e,Hu=t;else for(qu=o;null!==qu;)t=qu.nextEffect,qu.nextEffect=null,qu=t;if(0===(t=e.firstPendingTime)&&(Wu=null),1073741823===t?e===Gu?Yu++:(Yu=0,Gu=e):Yu=0,"function"==typeof Rl&&Rl(n.stateNode,r),il(e),Bu)throw Bu=!1,e=$u,$u=null,e;return(Ou&bu)!==vu?null:(Qo(),null)}function _l(){for(;null!==qu;){var e=qu.effectTag;(256&e)!==vt&&nu(qu.alternate,qu),(512&e)===vt||Vu||(Vu=!0,Wo(97,(function(){return Tl(),null}))),qu=qu.nextEffect}}function Tl(){if(90!==Hu){var e=97<Hu?97:Hu;return Hu=90,$o(e,Cl)}}function Cl(){if(null===Qu)return!1;var e=Qu;if(Qu=null,(Ou&(gu|wu))!==vu)throw a(Error(331));var t=Ou;for(Ou|=wu,e=e.current.firstEffect;null!==e;){try{var n=e;if((512&n.effectTag)!==vt)switch(n.tag){case 0:case 11:case 15:ru(128,0,n),ru(0,64,n)}}catch(t){if(null===e)throw a(Error(330));Pl(e,t)}n=e.nextEffect,e.nextEffect=null,e=n}return Ou=t,Qo(),!0}function Ol(e,t,n){si(e,t=pu(e,t=Ja(n,t),1073741823)),null!==(e=rl(e,1073741823))&&il(e)}function Pl(e,t){if(3===e.tag)Ol(e,e,t);else for(var n=e.return;null!==n;){if(3===n.tag){Ol(n,e,t);break}if(1===n.tag){var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===Wu||!Wu.has(r))){si(n,e=du(n,e=Ja(t,e),1073741823)),null!==(n=rl(n,1073741823))&&il(n);break}}n=n.return}}function Nl(e,t,n){var r=e.pingCache;null!==r&&r.delete(t),Pu===e&&ju===n?Ru===_u||Ru===Su&&1073741823===Mu&&Fo()-Du<Fu?dl(e,ju):Au=!0:$l(e,n)&&(0!==(t=e.lastPingedTime)&&t<n||(e.lastPingedTime=n,e.finishedExpirationTime===n&&(e.finishedExpirationTime=0,e.finishedWork=null),il(e)))}function jl(e,t){var n=e.stateNode;null!==n&&n.delete(t),1===(t=1)&&(t=Zu(t=Ju(),e,null)),null!==(e=rl(e,t))&&il(e)}el=function(e,t,n){var r=t.expirationTime;if(null!==e){var o=t.pendingProps;if(e.memoizedProps!==o||fo.current)Na=!0;else{if(r<n){switch(Na=!1,t.tag){case 3:Da(t),Oa();break;case 5:if(Ai(t),4&t.mode&&1!==n&&o.hidden)return t.expirationTime=t.childExpirationTime=1,null;break;case 1:ho(t.type)&&wo(t);break;case 4:Li(t,t.stateNode.containerInfo);break;case 10:ei(t,t.memoizedProps.value);break;case 13:if(null!==t.memoizedState)return 0!==(r=t.child.childExpirationTime)&&r>=n?Va(e,t,n):(lo(Fi,1&Fi.current),null!==(t=Ka(e,t,n))?t.sibling:null);lo(Fi,1&Fi.current);break;case 19:if(r=t.childExpirationTime>=n,(64&e.effectTag)!==vt){if(r)return Ha(e,t,n);t.effectTag|=64}if(null!==(o=t.memoizedState)&&(o.rendering=null,o.tail=null),lo(Fi,Fi.current),!r)return null}return Ka(e,t,n)}Na=!1}}else Na=!1;switch(t.expirationTime=0,t.tag){case 2:if(r=t.type,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=bt),e=t.pendingProps,o=mo(t,so.current),ri(t,n),o=ia(null,t,r,e,o,n),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof){if(t.tag=1,aa(),ho(r)){var i=!0;wo(t)}else i=!1;t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null;var u=r.getDerivedStateFromProps;"function"==typeof u&&gi(t,r,u,e),o.updater=wi,t.stateNode=o,o._reactInternalFiber=t,Si(t,r,e,n),t=Aa(null,t,r,!0,i,n)}else t.tag=0,ja(null,t,o,n),t=t.child;return t;case 16:if(o=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=bt),e=t.pendingProps,function(e){if(-1===e._status){e._status=0;var t=e._ctor;t=t(),e._result=t,t.then((function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)}),(function(t){0===e._status&&(e._status=2,e._result=t)}))}}(o),1!==o._status)throw o._result;switch(o=o._result,t.type=o,i=t.tag=function(e){if("function"==typeof e)return Ll(e)?1:0;if(null!=e){if((e=e.$$typeof)===W)return 11;if(e===H)return 14}return 2}(o),e=Ko(o,e),i){case 0:t=La(null,t,o,e,n);break;case 1:t=za(null,t,o,e,n);break;case 11:t=Ra(null,t,o,e,n);break;case 14:t=Ia(null,t,o,Ko(o.type,e),r,n);break;default:throw a(Error(306),o,"")}return t;case 0:return r=t.type,o=t.pendingProps,La(e,t,r,o=t.elementType===r?o:Ko(r,o),n);case 1:return r=t.type,o=t.pendingProps,za(e,t,r,o=t.elementType===r?o:Ko(r,o),n);case 3:if(Da(t),null===(r=t.updateQueue))throw a(Error(282));if(o=null!==(o=t.memoizedState)?o.element:null,mi(t,r,t.pendingProps,null,n),(r=t.memoizedState.element)===o)Oa(),t=Ka(e,t,n);else{if((o=t.stateNode.hydrate)&&(Ea=tr(t.stateNode.containerInfo.firstChild),wa=t,o=ka=!0),o)for(n=Ni(t,null,r,n),t.child=n;n;)n.effectTag=n.effectTag&~bt|gt,n=n.sibling;else ja(e,t,r,n),Oa();t=t.child}return t;case 5:return Ai(t),null===e&&_a(t),r=t.type,o=t.pendingProps,i=null!==e?e.memoizedProps:null,u=o.children,Jn(r,o)?u=null:null!==i&&Jn(r,i)&&(t.effectTag|=16),Ua(e,t),4&t.mode&&1!==n&&o.hidden?(t.expirationTime=t.childExpirationTime=1,t=null):(ja(e,t,u,n),t=t.child),t;case 6:return null===e&&_a(t),null;case 13:return Va(e,t,n);case 4:return Li(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=Pi(t,null,r,n):ja(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,Ra(e,t,r,o=t.elementType===r?o:Ko(r,o),n);case 7:return ja(e,t,t.pendingProps,n),t.child;case 8:case 12:return ja(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,u=t.memoizedProps,ei(t,i=o.value),null!==u){var l=u.value;if(0===(i=Kr(l,i)?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,i):1073741823))){if(u.children===o.children&&!fo.current){t=Ka(e,t,n);break e}}else for(null!==(l=t.child)&&(l.return=t);null!==l;){var c=l.dependencies;if(null!==c){u=l.child;for(var s=c.firstContext;null!==s;){if(s.context===r&&0!=(s.observedBits&i)){1===l.tag&&((s=li(n,null)).tag=2,si(l,s)),l.expirationTime<n&&(l.expirationTime=n),null!==(s=l.alternate)&&s.expirationTime<n&&(s.expirationTime=n),ni(l.return,n),c.expirationTime<n&&(c.expirationTime=n);break}s=s.next}}else u=10===l.tag&&l.type===t.type?null:l.child;if(null!==u)u.return=l;else for(u=l;null!==u;){if(u===t){u=null;break}if(null!==(l=u.sibling)){l.return=u.return,u=l;break}u=u.return}l=u}}ja(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=(i=t.pendingProps).children,ri(t,n),r=r(o=oi(o,i.unstable_observedBits)),t.effectTag|=1,ja(e,t,r,n),t.child;case 14:return i=Ko(o=t.type,t.pendingProps),Ia(e,t,o,i=Ko(o.type,i),r,n);case 15:return Ma(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Ko(r,o),null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=bt),t.tag=1,ho(r)?(e=!0,wo(t)):e=!1,ri(t,n),ki(t,r,o),Si(t,r,o,n),Aa(null,t,r,!0,e,n);case 19:return Ha(e,t,n)}throw a(Error(156),t.tag)};var Rl=null,Il=null;function Ml(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=vt,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childExpirationTime=this.expirationTime=0,this.alternate=null}function Ul(e,t,n,r){return new Ml(e,t,n,r)}function Ll(e){return!(!(e=e.prototype)||!e.isReactComponent)}function zl(e,t){var n=e.alternate;return null===n?((n=Ul(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.effectTag=vt,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childExpirationTime=e.childExpirationTime,n.expirationTime=e.expirationTime,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=null===t?null:{expirationTime:t.expirationTime,firstContext:t.firstContext,responders:t.responders},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Al(e,t,n,r,o,i){var u=2;if(r=e,"function"==typeof e)Ll(e)&&(u=1);else if("string"==typeof e)u=5;else e:switch(e){case A:return Dl(n.children,o,i,t);case $:u=8,o|=7;break;case D:u=8,o|=1;break;case F:return(e=Ul(12,n,t,8|o)).elementType=F,e.type=F,e.expirationTime=i,e;case V:return(e=Ul(13,n,t,o)).type=V,e.elementType=V,e.expirationTime=i,e;case Q:return(e=Ul(19,n,t,o)).elementType=Q,e.expirationTime=i,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case q:u=10;break e;case B:u=9;break e;case W:u=11;break e;case H:u=14;break e;case K:u=16,r=null;break e}throw a(Error(130),null==e?e:typeof e,"")}return(t=Ul(u,n,t,o)).elementType=e,t.type=r,t.expirationTime=i,t}function Dl(e,t,n,r){return(e=Ul(7,e,r,t)).expirationTime=n,e}function Fl(e,t,n){return(e=Ul(6,e,null,t)).expirationTime=n,e}function ql(e,t,n){return(t=Ul(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Bl(e,t,n){this.tag=t,this.current=null,this.containerInfo=e,this.pingCache=this.pendingChildren=null,this.finishedExpirationTime=0,this.finishedWork=null,this.timeoutHandle=-1,this.pendingContext=this.context=null,this.hydrate=n,this.callbackNode=this.firstBatch=null,this.callbackPriority=90,this.lastExpiredTime=this.lastPingedTime=this.nextKnownPendingLevel=this.lastSuspendedTime=this.firstSuspendedTime=this.firstPendingTime=0}function $l(e,t){var n=e.firstSuspendedTime;return e=e.lastSuspendedTime,0!==n&&n>=t&&e<=t}function Wl(e,t){var n=e.firstSuspendedTime,r=e.lastSuspendedTime;n<t&&(e.firstSuspendedTime=t),(r>t||0===n)&&(e.lastSuspendedTime=t),t<=e.lastPingedTime&&(e.lastPingedTime=0),t<=e.lastExpiredTime&&(e.lastExpiredTime=0)}function Vl(e,t){t>e.firstPendingTime&&(e.firstPendingTime=t);var n=e.firstSuspendedTime;0!==n&&(t>=n?e.firstSuspendedTime=e.lastSuspendedTime=e.nextKnownPendingLevel=0:t>=e.lastSuspendedTime&&(e.lastSuspendedTime=t+1),t>e.nextKnownPendingLevel&&(e.nextKnownPendingLevel=t))}function Ql(e,t){var n=e.lastExpiredTime;(0===n||n>t)&&(e.lastExpiredTime=t)}function Hl(e,t,n,r,o,i){var u=t.current;e:if(n){t:{if(wt(n=n._reactInternalFiber)!==n||1!==n.tag)throw a(Error(170));var l=n;do{switch(l.tag){case 3:l=l.stateNode.context;break t;case 1:if(ho(l.type)){l=l.stateNode.__reactInternalMemoizedMergedChildContext;break t}}l=l.return}while(null!==l);throw a(Error(171))}if(1===n.tag){var c=n.type;if(ho(c)){n=go(n,c,l);break e}}n=l}else n=co;return null===t.context?t.context=n:t.pendingContext=n,t=i,(o=li(r,o)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),si(u,o),nl(u,r),r}function Kl(e,t,n,r){var o=t.current,i=Ju(),a=vi.suspense;return Hl(e,t,n,o=Zu(i,o,a),a,r)}function Yl(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function Gl(e){var t=1073741821-25*(1+((1073741821-Ju()+500)/25|0));t<=tl&&--t,this._expirationTime=tl=t,this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function Xl(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function Jl(e,t,n){var r=new Bl(e,t,n=null!=n&&!0===n.hydrate),o=Ul(3,null,null,2===t?7:1===t?3:0);return r.current=o,o.stateNode=r,e[ar]=r.current,n&&0!==t&&function(e){var t=Pn(e);ut.forEach((function(n){Nn(n,e,t)})),lt.forEach((function(n){Nn(n,e,t)}))}(9===e.nodeType?e:e.ownerDocument),r}function Zl(e,t,n){this._internalRoot=Jl(e,t,n)}function ec(e,t){this._internalRoot=Jl(e,2,t)}function tc(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function nc(e,t,n,r,o){var i=n._reactRootContainer;if(i){var a=i._internalRoot;if("function"==typeof o){var u=o;o=function(){var e=Yl(a);u.call(e)}}Kl(t,a,e,o)}else{if(i=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new Zl(e,0,t?{hydrate:!0}:void 0)}(n,r),a=i._internalRoot,"function"==typeof o){var l=o;o=function(){var e=Yl(a);l.call(e)}}pl((function(){Kl(t,a,e,o)}))}return Yl(a)}function rc(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!tc(t))throw a(Error(200));return function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:z,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}ee=function(e,t,n){switch(t){case"input":if(Pe(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=sr(r);if(!o)throw a(Error(90));_e(r),Pe(r,o)}}}break;case"textarea":Le(e,n);break;case"select":null!=(t=n.value)&&Ie(e,!!n.multiple,t,!1)}},Gl.prototype.render=function(e){if(!this._defer)throw a(Error(250));this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new Xl;return Hl(e,t,null,n,null,r._onCommit),r},Gl.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},Gl.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(!this._defer||null===t)throw a(Error(251));if(this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;if(null===r)throw a(Error(251));r._next=o._next,this._next=t,e.firstBatch=this}if(this._defer=!1,t=n,(Ou&(gu|wu))!==vu)throw a(Error(253));Ql(e,t),il(e),Qo(),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},Gl.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},Xl.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},Xl.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];if("function"!=typeof n)throw a(Error(191),n);n()}}},ec.prototype.render=Zl.prototype.render=function(e,t){var n=this._internalRoot,r=new Xl;return null!==(t=void 0===t?null:t)&&r.then(t),Kl(e,n,null,r._onCommit),r},ec.prototype.unmount=Zl.prototype.unmount=function(e){var t=this._internalRoot,n=new Xl;return null!==(e=void 0===e?null:e)&&n.then(e),Kl(null,t,null,n._onCommit),n},ec.prototype.createBatch=function(){var e=new Gl(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime>=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},ae=sl,ue=fl,le=ll,ce=function(e,t){var n=Ou;Ou|=2;try{return e(t)}finally{(Ou=n)===vu&&Qo()}};var oc,ic,ac={createPortal:rc,findDOMNode:function(e){if(null==e)e=null;else if(1!==e.nodeType){var t=e._reactInternalFiber;if(void 0===t){if("function"==typeof e.render)throw a(Error(188));throw a(Error(268),Object.keys(e))}e=null===(e=kt(t))?null:e.stateNode}return e},hydrate:function(e,t,n){if(!tc(t))throw a(Error(200));return nc(null,e,t,!0,n)},render:function(e,t,n){if(!tc(t))throw a(Error(200));return nc(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){if(!tc(n))throw a(Error(200));if(null==e||void 0===e._reactInternalFiber)throw a(Error(38));return nc(e,t,n,!1,r)},unmountComponentAtNode:function(e){if(!tc(e))throw a(Error(40));return!!e._reactRootContainer&&(pl((function(){nc(null,null,e,!1,(function(){e._reactRootContainer=null}))})),!0)},unstable_createPortal:function(){return rc.apply(void 0,arguments)},unstable_batchedUpdates:sl,unstable_interactiveUpdates:function(e,t,n,r){return ll(),fl(e,t,n,r)},unstable_discreteUpdates:fl,unstable_flushDiscreteUpdates:ll,flushSync:function(e,t){if((Ou&(gu|wu))!==vu)throw a(Error(187));var n=Ou;Ou|=1;try{return $o(99,e.bind(null,t))}finally{Ou=n,Qo()}},unstable_createRoot:function(e,t){if(!tc(e))throw a(Error(299),"unstable_createRoot");return new ec(e,t)},unstable_createSyncRoot:function(e,t){if(!tc(e))throw a(Error(299),"unstable_createRoot");return new Zl(e,1,t)},unstable_flushControlled:function(e){var t=Ou;Ou|=1;try{$o(99,e)}finally{(Ou=t)===vu&&Qo()}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[lr,cr,sr,j.injectEventPluginsByName,p,Pt,function(e){C(e,Ot)},oe,ie,_n,N,Tl,{current:!1}]}};ic=(oc={findFiberByHostInstance:ur,bundleType:0,version:"16.10.1",rendererPackageName:"react-dom"}).findFiberByHostInstance,function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);Rl=function(e){try{t.onCommitFiberRoot(n,e,void 0,64==(64&e.current.effectTag))}catch(e){}},Il=function(e){try{t.onCommitFiberUnmount(n,e)}catch(e){}}}catch(e){}}(o({},oc,{overrideHookState:null,overrideProps:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:I.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return null===(e=kt(e))?null:e.stateNode},findFiberByHostInstance:function(e){return ic?ic(e):null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null}));var uc={default:ac},lc=uc&&ac||uc;e.exports=lc.default||lc},function(e,t,n){"use strict";e.exports=n(17)},function(e,t,n){"use strict";
/** @license React v0.16.1
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r,o,i,a,u;if(Object.defineProperty(t,"__esModule",{value:!0}),"undefined"==typeof window||"function"!=typeof MessageChannel){var l=null,c=null,s=function(){if(null!==l)try{var e=t.unstable_now();l(!0,e),l=null}catch(e){throw setTimeout(s,0),e}},f=Date.now();t.unstable_now=function(){return Date.now()-f},r=function(e){null!==l?setTimeout(r,0,e):(l=e,setTimeout(s,0))},o=function(e,t){c=setTimeout(e,t)},i=function(){clearTimeout(c)},a=function(){return!1},u=t.unstable_forceFrameRate=function(){}}else{var p=window.performance,d=window.Date,m=window.setTimeout,h=window.clearTimeout,y=window.requestAnimationFrame,v=window.cancelAnimationFrame;if("undefined"!=typeof console&&("function"!=typeof y&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!=typeof v&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills")),"object"==typeof p&&"function"==typeof p.now)t.unstable_now=function(){return p.now()};else{var b=d.now();t.unstable_now=function(){return d.now()-b}}var g=!1,w=null,E=-1,k=5,x=0;a=function(){return t.unstable_now()>=x},u=function(){},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):k=0<e?Math.floor(1e3/e):33.33};var S=new MessageChannel,_=S.port2;S.port1.onmessage=function(){if(null!==w){var e=t.unstable_now();x=e+k;try{w(!0,e)?_.postMessage(null):(g=!1,w=null)}catch(e){throw _.postMessage(null),e}}else g=!1},r=function(e){w=e,g||(g=!0,_.postMessage(null))},o=function(e,n){E=m((function(){e(t.unstable_now())}),n)},i=function(){h(E),E=-1}}function T(e,t){var n=e.length;e.push(t);e:for(;;){var r=Math.floor((n-1)/2),o=e[r];if(!(void 0!==o&&0<P(o,t)))break e;e[r]=t,e[n]=o,n=r}}function C(e){return void 0===(e=e[0])?null:e}function O(e){var t=e[0];if(void 0!==t){var n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,o=e.length;r<o;){var i=2*(r+1)-1,a=e[i],u=i+1,l=e[u];if(void 0!==a&&0>P(a,n))void 0!==l&&0>P(l,a)?(e[r]=l,e[u]=n,r=u):(e[r]=a,e[i]=n,r=i);else{if(!(void 0!==l&&0>P(l,n)))break e;e[r]=l,e[u]=n,r=u}}}return t}return null}function P(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}var N=[],j=[],R=1,I=null,M=3,U=!1,L=!1,z=!1;function A(e){for(var t=C(j);null!==t;){if(null===t.callback)O(j);else{if(!(t.startTime<=e))break;O(j),t.sortIndex=t.expirationTime,T(N,t)}t=C(j)}}function D(e){if(z=!1,A(e),!L)if(null!==C(N))L=!0,r(F);else{var t=C(j);null!==t&&o(D,t.startTime-e)}}function F(e,n){L=!1,z&&(z=!1,i()),U=!0;var r=M;try{for(A(n),I=C(N);null!==I&&(!(I.expirationTime>n)||e&&!a());){var u=I.callback;if(null!==u){I.callback=null,M=I.priorityLevel;var l=u(I.expirationTime<=n);n=t.unstable_now(),"function"==typeof l?I.callback=l:I===C(N)&&O(N),A(n)}else O(N);I=C(N)}if(null!==I)var c=!0;else{var s=C(j);null!==s&&o(D,s.startTime-n),c=!1}return c}finally{I=null,M=r,U=!1}}function q(e){switch(e){case 1:return-1;case 2:return 250;case 5:return 1073741823;case 4:return 1e4;default:return 5e3}}var B=u;t.unstable_ImmediatePriority=1,t.unstable_UserBlockingPriority=2,t.unstable_NormalPriority=3,t.unstable_IdlePriority=5,t.unstable_LowPriority=4,t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=M;M=e;try{return t()}finally{M=n}},t.unstable_next=function(e){switch(M){case 1:case 2:case 3:var t=3;break;default:t=M}var n=M;M=t;try{return e()}finally{M=n}},t.unstable_scheduleCallback=function(e,n,a){var u=t.unstable_now();if("object"==typeof a&&null!==a){var l=a.delay;l="number"==typeof l&&0<l?u+l:u,a="number"==typeof a.timeout?a.timeout:q(e)}else a=q(e),l=u;return e={id:R++,callback:n,priorityLevel:e,startTime:l,expirationTime:a=l+a,sortIndex:-1},l>u?(e.sortIndex=l,T(j,e),null===C(N)&&e===C(j)&&(z?i():z=!0,o(D,l-u))):(e.sortIndex=a,T(N,e),L||U||(L=!0,r(F))),e},t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_wrapCallback=function(e){var t=M;return function(){var n=M;M=t;try{return e.apply(this,arguments)}finally{M=n}}},t.unstable_getCurrentPriorityLevel=function(){return M},t.unstable_shouldYield=function(){var e=t.unstable_now();A(e);var n=C(N);return n!==I&&null!==I&&null!==n&&null!==n.callback&&n.startTime<=e&&n.expirationTime<I.expirationTime||a()},t.unstable_requestPaint=B,t.unstable_continueExecution=function(){L||U||(L=!0,r(F))},t.unstable_pauseExecution=function(){},t.unstable_getFirstCallbackNode=function(){return C(N)},t.unstable_Profiling=null},function(e,t,n){"use strict";var r=n(19);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,i,a){if(a!==r){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";
/** @license React v16.10.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,i=r?Symbol.for("react.portal"):60106,a=r?Symbol.for("react.fragment"):60107,u=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,c=r?Symbol.for("react.provider"):60109,s=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,p=r?Symbol.for("react.concurrent_mode"):60111,d=r?Symbol.for("react.forward_ref"):60112,m=r?Symbol.for("react.suspense"):60113,h=r?Symbol.for("react.suspense_list"):60120,y=r?Symbol.for("react.memo"):60115,v=r?Symbol.for("react.lazy"):60116,b=r?Symbol.for("react.fundamental"):60117,g=r?Symbol.for("react.responder"):60118,w=r?Symbol.for("react.scope"):60119;function E(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case p:case a:case l:case u:case m:return e;default:switch(e=e&&e.$$typeof){case s:case d:case c:return e;default:return t}}case v:case y:case i:return t}}}function k(e){return E(e)===p}t.typeOf=E,t.AsyncMode=f,t.ConcurrentMode=p,t.ContextConsumer=s,t.ContextProvider=c,t.Element=o,t.ForwardRef=d,t.Fragment=a,t.Lazy=v,t.Memo=y,t.Portal=i,t.Profiler=l,t.StrictMode=u,t.Suspense=m,t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===a||e===p||e===l||e===u||e===m||e===h||"object"==typeof e&&null!==e&&(e.$$typeof===v||e.$$typeof===y||e.$$typeof===c||e.$$typeof===s||e.$$typeof===d||e.$$typeof===b||e.$$typeof===g||e.$$typeof===w)},t.isAsyncMode=function(e){return k(e)||E(e)===f},t.isConcurrentMode=k,t.isContextConsumer=function(e){return E(e)===s},t.isContextProvider=function(e){return E(e)===c},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return E(e)===d},t.isFragment=function(e){return E(e)===a},t.isLazy=function(e){return E(e)===v},t.isMemo=function(e){return E(e)===y},t.isPortal=function(e){return E(e)===i},t.isProfiler=function(e){return E(e)===l},t.isStrictMode=function(e){return E(e)===u},t.isSuspense=function(e){return E(e)===m}},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),i=n(4),a=n.n(i),u=n(1),l=n.n(u),c=o.a.createContext(null);var s=function(e){e()},f=function(){return s},p=null,d={notify:function(){}};var m=function(){function e(e,t){this.store=e,this.parentSub=t,this.unsubscribe=null,this.listeners=d,this.handleChangeWrapper=this.handleChangeWrapper.bind(this)}var t=e.prototype;return t.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},t.notifyNestedSubs=function(){this.listeners.notify()},t.handleChangeWrapper=function(){this.onStateChange&&this.onStateChange()},t.isSubscribed=function(){return Boolean(this.unsubscribe)},t.trySubscribe=function(){var e,t,n;this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.handleChangeWrapper):this.store.subscribe(this.handleChangeWrapper),this.listeners=(e=f(),t=[],n=[],{clear:function(){n=p,t=p},notify:function(){var r=t=n;e((function(){for(var e=0;e<r.length;e++)r[e]()}))},get:function(){return n},subscribe:function(e){var r=!0;return n===t&&(n=t.slice()),n.push(e),function(){r&&t!==p&&(r=!1,n===t&&(n=t.slice()),n.splice(n.indexOf(e),1))}}}))},t.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=d)},e}();function h(e){var t=e.store,n=e.context,i=e.children,a=Object(r.useMemo)((function(){var e=new m(t);return e.onStateChange=e.notifyNestedSubs,{store:t,subscription:e}}),[t]),u=Object(r.useMemo)((function(){return t.getState()}),[t]);Object(r.useEffect)((function(){var e=a.subscription;return e.trySubscribe(),u!==t.getState()&&e.notifyNestedSubs(),function(){e.tryUnsubscribe(),e.onStateChange=null}}),[a,u]);var l=n||c;return o.a.createElement(l.Provider,{value:a},i)}h.propTypes={store:l.a.shape({subscribe:l.a.func.isRequired,dispatch:l.a.func.isRequired,getState:l.a.func.isRequired}),context:l.a.object,children:l.a.any};var y=h;function v(){return(v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function b(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}var g=n(3),w=n.n(g),E=n(2),k=n.n(E),x=n(5),S=[],_=[null,null];function T(e,t){var n=e[1];return[t.payload,n+1]}var C=function(){return[null,0]},O="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?r.useLayoutEffect:r.useEffect;function P(e,t){void 0===t&&(t={});var n=t,i=n.getDisplayName,a=void 0===i?function(e){return"ConnectAdvanced("+e+")"}:i,u=n.methodName,l=void 0===u?"connectAdvanced":u,s=n.renderCountProp,f=void 0===s?void 0:s,p=n.shouldHandleStateChanges,d=void 0===p||p,h=n.storeKey,y=void 0===h?"store":h,g=n.withRef,E=void 0!==g&&g,P=n.forwardRef,N=void 0!==P&&P,j=n.context,R=void 0===j?c:j,I=b(n,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"]);k()(void 0===f,"renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension"),k()(!E,"withRef is removed. To access the wrapped instance, use a ref on the connected component");k()("store"===y,"storeKey has been removed and does not do anything. To use a custom Redux store for specific components, create a custom React context with React.createContext(), and pass the context object to React Redux's Provider and specific components like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. You may also pass a {context : MyContext} option to connect");var M=R;return function(t){var n=t.displayName||t.name||"Component",i=a(n),u=v({},I,{getDisplayName:a,methodName:l,renderCountProp:f,shouldHandleStateChanges:d,storeKey:y,displayName:i,wrappedComponentName:n,WrappedComponent:t}),c=I.pure;var s=c?r.useMemo:function(e){return e()};function p(n){var a=Object(r.useMemo)((function(){var e=n.forwardedRef,t=b(n,["forwardedRef"]);return[n.context,e,t]}),[n]),l=a[0],c=a[1],f=a[2],p=Object(r.useMemo)((function(){return l&&l.Consumer&&Object(x.isContextConsumer)(o.a.createElement(l.Consumer,null))?l:M}),[l,M]),h=Object(r.useContext)(p),y=Boolean(n.store),g=Boolean(h)&&Boolean(h.store);k()(y||g,'Could not find "store" in the context of "'+i+'". Either wrap the root component in a <Provider>, or pass a custom React context provider to <Provider> and the corresponding React context consumer to '+i+" in connect options.");var w=n.store||h.store,E=Object(r.useMemo)((function(){return function(t){return e(t.dispatch,u)}(w)}),[w]),P=Object(r.useMemo)((function(){if(!d)return _;var e=new m(w,y?null:h.subscription),t=e.notifyNestedSubs.bind(e);return[e,t]}),[w,y,h]),N=P[0],j=P[1],R=Object(r.useMemo)((function(){return y?h:v({},h,{subscription:N})}),[y,h,N]),I=Object(r.useReducer)(T,S,C),U=I[0][0],L=I[1];if(U&&U.error)throw U.error;var z=Object(r.useRef)(),A=Object(r.useRef)(f),D=Object(r.useRef)(),F=Object(r.useRef)(!1),q=s((function(){return D.current&&f===A.current?D.current:E(w.getState(),f)}),[w,U,f]);O((function(){A.current=f,z.current=q,F.current=!1,D.current&&(D.current=null,j())})),O((function(){if(d){var e=!1,t=null,n=function(){if(!e){var n,r,o=w.getState();try{n=E(o,A.current)}catch(e){r=e,t=e}r||(t=null),n===z.current?F.current||j():(z.current=n,D.current=n,F.current=!0,L({type:"STORE_UPDATED",payload:{latestStoreState:o,error:r}}))}};N.onStateChange=n,N.trySubscribe(),n();return function(){if(e=!0,N.tryUnsubscribe(),N.onStateChange=null,t)throw t}}}),[w,N,E]);var B=Object(r.useMemo)((function(){return o.a.createElement(t,v({},q,{ref:c}))}),[c,t,q]);return Object(r.useMemo)((function(){return d?o.a.createElement(p.Provider,{value:R},B):B}),[p,B,R])}var h=c?o.a.memo(p):p;if(h.WrappedComponent=t,h.displayName=i,N){var g=o.a.forwardRef((function(e,t){return o.a.createElement(h,v({},e,{forwardedRef:t}))}));return g.displayName=i,g.WrappedComponent=t,w()(g,t)}return w()(h,t)}}var N=Object.prototype.hasOwnProperty;function j(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function R(e,t){if(j(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!N.call(t,n[o])||!j(e[n[o]],t[n[o]]))return!1;return!0}var I=n(7),M=function(){return Math.random().toString(36).substring(7).split("").join(".")},U={INIT:"@@redux/INIT"+M(),REPLACE:"@@redux/REPLACE"+M(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+M()}};function L(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function z(e,t,n){var r;if("function"==typeof t&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(z)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var o=e,i=t,a=[],u=a,l=!1;function c(){u===a&&(u=a.slice())}function s(){if(l)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return i}function f(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(l)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return c(),u.push(e),function(){if(t){if(l)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,c();var n=u.indexOf(e);u.splice(n,1)}}}function p(e){if(!L(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(l)throw new Error("Reducers may not dispatch actions.");try{l=!0,i=o(i,e)}finally{l=!1}for(var t=a=u,n=0;n<t.length;n++){(0,t[n])()}return e}return p({type:U.INIT}),(r={dispatch:p,subscribe:f,getState:s,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");o=e,p({type:U.REPLACE})}})[I.a]=function(){var e,t=f;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(s())}return n(),{unsubscribe:t(n)}}})[I.a]=function(){return this},e},r}function A(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function D(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];0,"function"==typeof e[o]&&(n[o]=e[o])}var i,a=Object.keys(n);try{!function(e){Object.keys(e).forEach((function(t){var n=e[t];if(void 0===n(void 0,{type:U.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:U.PROBE_UNKNOWN_ACTION()}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+U.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')}))}(n)}catch(e){i=e}return function(e,t){if(void 0===e&&(e={}),i)throw i;for(var r=!1,o={},u=0;u<a.length;u++){var l=a[u],c=n[l],s=e[l],f=c(s,t);if(void 0===f){var p=A(l,t);throw new Error(p)}o[l]=f,r=r||f!==s}return r?o:e}}function F(e,t){return function(){return t(e.apply(this,arguments))}}function q(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function B(e,t){var n=Object.keys(e);return Object.getOwnPropertySymbols&&n.push.apply(n,Object.getOwnPropertySymbols(e)),t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n}function W(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?B(n,!0).forEach((function(t){q(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):B(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function V(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce((function(e,t){return function(){return e(t.apply(void 0,arguments))}}))}function Q(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){var n=e.apply(void 0,arguments),r=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},i=t.map((function(e){return e(o)}));return W({},n,{dispatch:r=V.apply(void 0,i)(n.dispatch)})}}}function H(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function K(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function Y(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=K(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=K(o),o=r(t,n)),o},r}}var G=[function(e){return"function"==typeof e?Y(e):void 0},function(e){return e?void 0:H((function(e){return{dispatch:e}}))},function(e){return e&&"object"==typeof e?H((function(t){return function(e,t){if("function"==typeof e)return F(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');var n={};for(var r in e){var o=e[r];"function"==typeof o&&(n[r]=F(o,t))}return n}(e,t)})):void 0}];var X=[function(e){return"function"==typeof e?Y(e):void 0},function(e){return e?void 0:H((function(){return{}}))}];function J(e,t,n){return v({},n,{},e,{},t)}var Z=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r,o=n.pure,i=n.areMergedPropsEqual,a=!1;return function(t,n,u){var l=e(t,n,u);return a?o&&i(l,r)||(r=l):(a=!0,r=l),r}}}(e):void 0},function(e){return e?void 0:function(){return J}}];function ee(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function te(e,t,n,r,o){var i,a,u,l,c,s=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1;function m(o,d){var m,h,y=!f(d,a),v=!s(o,i);return i=o,a=d,y&&v?(u=e(i,a),t.dependsOnOwnProps&&(l=t(r,a)),c=n(u,l,a)):y?(e.dependsOnOwnProps&&(u=e(i,a)),t.dependsOnOwnProps&&(l=t(r,a)),c=n(u,l,a)):v?(m=e(i,a),h=!p(m,u),u=m,h&&(c=n(u,l,a)),c):c}return function(o,s){return d?m(o,s):(u=e(i=o,a=s),l=t(r,a),c=n(u,l,a),d=!0,c)}}function ne(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,i=b(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),a=n(e,i),u=r(e,i),l=o(e,i);return(i.pure?te:ee)(a,u,l,e,i)}function re(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function oe(e,t){return e===t}var ie,ae,ue,le,ce,se,fe,pe,de,me,he,ye,ve=(ue=(ae=void 0===ie?{}:ie).connectHOC,le=void 0===ue?P:ue,ce=ae.mapStateToPropsFactories,se=void 0===ce?X:ce,fe=ae.mapDispatchToPropsFactories,pe=void 0===fe?G:fe,de=ae.mergePropsFactories,me=void 0===de?Z:de,he=ae.selectorFactory,ye=void 0===he?ne:he,function(e,t,n,r){void 0===r&&(r={});var o=r,i=o.pure,a=void 0===i||i,u=o.areStatesEqual,l=void 0===u?oe:u,c=o.areOwnPropsEqual,s=void 0===c?R:c,f=o.areStatePropsEqual,p=void 0===f?R:f,d=o.areMergedPropsEqual,m=void 0===d?R:d,h=b(o,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),y=re(e,se,"mapStateToProps"),g=re(t,pe,"mapDispatchToProps"),w=re(n,me,"mergeProps");return le(ye,v({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:y,initMapDispatchToProps:g,initMergeProps:w,pure:a,areStatesEqual:l,areOwnPropsEqual:s,areStatePropsEqual:p,areMergedPropsEqual:m},h))});function be(){var e=Object(r.useContext)(c);return k()(e,"could not find react-redux context value; please ensure the component is wrapped in a <Provider>"),e}function ge(e){void 0===e&&(e=c);var t=e===c?be:function(){return Object(r.useContext)(e)};return function(){return t().store}}var we=ge();!function(e){void 0===e&&(e=c);var t=e===c?we:ge(e)}();var Ee="undefined"!=typeof window?r.useLayoutEffect:r.useEffect,ke=function(e,t){return e===t};var xe;!function(e){void 0===e&&(e=c);var t=e===c?be:function(){return Object(r.useContext)(e)}}();function Se(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function _e(e){return"/"===e.charAt(0)}function Te(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}xe=i.unstable_batchedUpdates,s=xe;var Ce=function(e,t){void 0===t&&(t="");var n,r=e&&e.split("/")||[],o=t&&t.split("/")||[],i=e&&_e(e),a=t&&_e(t),u=i||a;if(e&&_e(e)?o=r:r.length&&(o.pop(),o=o.concat(r)),!o.length)return"/";if(o.length){var l=o[o.length-1];n="."===l||".."===l||""===l}else n=!1;for(var c=0,s=o.length;s>=0;s--){var f=o[s];"."===f?Te(o,s):".."===f?(Te(o,s),c++):c&&(Te(o,s),c--)}if(!u)for(;c--;c)o.unshift("..");!u||""===o[0]||o[0]&&_e(o[0])||o.unshift("");var p=o.join("/");return n&&"/"!==p.substr(-1)&&(p+="/"),p};function Oe(e){return e.valueOf?e.valueOf():Object.prototype.valueOf.call(e)}var Pe=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every((function(t,r){return e(t,n[r])}));if("object"==typeof t||"object"==typeof n){var r=Oe(t),o=Oe(n);return r!==t||o!==n?e(r,o):Object.keys(Object.assign({},t,n)).every((function(r){return e(t[r],n[r])}))}return!1},Ne=!0,je="Invariant failed";var Re=function(e,t){if(!e)throw Ne?new Error(je):new Error(je+": "+(t||""))};function Ie(e){return"/"===e.charAt(0)?e:"/"+e}function Me(e){return"/"===e.charAt(0)?e.substr(1):e}function Ue(e,t){return function(e,t){return 0===e.toLowerCase().indexOf(t.toLowerCase())&&-1!=="/?#".indexOf(e.charAt(t.length))}(e,t)?e.substr(t.length):e}function Le(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e}function ze(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}function Ae(e,t,n,r){var o;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=v({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=Ce(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o}function De(){var e=null;var t=[];return{setPrompt:function(t){return e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,o):o(!0):o(!1!==i)}else o(!0)},appendListener:function(e){var n=!0;function r(){n&&e.apply(void 0,arguments)}return t.push(r),function(){n=!1,t=t.filter((function(e){return e!==r}))}},notifyListeners:function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach((function(e){return e.apply(void 0,n)}))}}}var Fe=!("undefined"==typeof window||!window.document||!window.document.createElement);function qe(e,t){t(window.confirm(e))}var Be="popstate",$e="hashchange";function We(){try{return window.history.state||{}}catch(e){return{}}}function Ve(e){void 0===e&&(e={}),Fe||Re(!1);var t,n=window.history,r=(-1===(t=window.navigator.userAgent).indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&window.history&&"pushState"in window.history,o=!(-1===window.navigator.userAgent.indexOf("Trident")),i=e,a=i.forceRefresh,u=void 0!==a&&a,l=i.getUserConfirmation,c=void 0===l?qe:l,s=i.keyLength,f=void 0===s?6:s,p=e.basename?Le(Ie(e.basename)):"";function d(e){var t=e||{},n=t.key,r=t.state,o=window.location,i=o.pathname+o.search+o.hash;return p&&(i=Ue(i,p)),Ae(i,r,n)}function m(){return Math.random().toString(36).substr(2,f)}var h=De();function y(e){v(P,e),P.length=n.length,h.notifyListeners(P.location,P.action)}function b(e){(function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")})(e)||E(d(e.state))}function g(){E(d(We()))}var w=!1;function E(e){if(w)w=!1,y();else{h.confirmTransitionTo(e,"POP",c,(function(t){t?y({action:"POP",location:e}):function(e){var t=P.location,n=x.indexOf(t.key);-1===n&&(n=0);var r=x.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(w=!0,_(o))}(e)}))}}var k=d(We()),x=[k.key];function S(e){return p+ze(e)}function _(e){n.go(e)}var T=0;function C(e){1===(T+=e)&&1===e?(window.addEventListener(Be,b),o&&window.addEventListener($e,g)):0===T&&(window.removeEventListener(Be,b),o&&window.removeEventListener($e,g))}var O=!1;var P={length:n.length,action:"POP",location:k,createHref:S,push:function(e,t){var o=Ae(e,t,m(),P.location);h.confirmTransitionTo(o,"PUSH",c,(function(e){if(e){var t=S(o),i=o.key,a=o.state;if(r)if(n.pushState({key:i,state:a},null,t),u)window.location.href=t;else{var l=x.indexOf(P.location.key),c=x.slice(0,l+1);c.push(o.key),x=c,y({action:"PUSH",location:o})}else window.location.href=t}}))},replace:function(e,t){var o=Ae(e,t,m(),P.location);h.confirmTransitionTo(o,"REPLACE",c,(function(e){if(e){var t=S(o),i=o.key,a=o.state;if(r)if(n.replaceState({key:i,state:a},null,t),u)window.location.replace(t);else{var l=x.indexOf(P.location.key);-1!==l&&(x[l]=o.key),y({action:"REPLACE",location:o})}else window.location.replace(t)}}))},go:_,goBack:function(){_(-1)},goForward:function(){_(1)},block:function(e){void 0===e&&(e=!1);var t=h.setPrompt(e);return O||(C(1),O=!0),function(){return O&&(O=!1,C(-1)),t()}},listen:function(e){var t=h.appendListener(e);return C(1),function(){C(-1),t()}}};return P}var Qe="hashchange",He={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+Me(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:Me,decodePath:Ie},slash:{encodePath:Ie,decodePath:Ie}};function Ke(e){var t=e.indexOf("#");return-1===t?e:e.slice(0,t)}function Ye(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)}function Ge(e){window.location.replace(Ke(window.location.href)+"#"+e)}function Xe(e){void 0===e&&(e={}),Fe||Re(!1);var t=window.history,n=(window.navigator.userAgent.indexOf("Firefox"),e),r=n.getUserConfirmation,o=void 0===r?qe:r,i=n.hashType,a=void 0===i?"slash":i,u=e.basename?Le(Ie(e.basename)):"",l=He[a],c=l.encodePath,s=l.decodePath;function f(){var e=s(Ye());return u&&(e=Ue(e,u)),Ae(e)}var p=De();function d(e){v(T,e),T.length=t.length,p.notifyListeners(T.location,T.action)}var m=!1,h=null;function y(){var e,t,n=Ye(),r=c(n);if(n!==r)Ge(r);else{var i=f(),a=T.location;if(!m&&(t=i,(e=a).pathname===t.pathname&&e.search===t.search&&e.hash===t.hash))return;if(h===ze(i))return;h=null,function(e){if(m)m=!1,d();else{p.confirmTransitionTo(e,"POP",o,(function(t){t?d({action:"POP",location:e}):function(e){var t=T.location,n=E.lastIndexOf(ze(t));-1===n&&(n=0);var r=E.lastIndexOf(ze(e));-1===r&&(r=0);var o=n-r;o&&(m=!0,k(o))}(e)}))}}(i)}}var b=Ye(),g=c(b);b!==g&&Ge(g);var w=f(),E=[ze(w)];function k(e){t.go(e)}var x=0;function S(e){1===(x+=e)&&1===e?window.addEventListener(Qe,y):0===x&&window.removeEventListener(Qe,y)}var _=!1;var T={length:t.length,action:"POP",location:w,createHref:function(e){var t=document.querySelector("base"),n="";return t&&t.getAttribute("href")&&(n=Ke(window.location.href)),n+"#"+c(u+ze(e))},push:function(e,t){var n=Ae(e,void 0,void 0,T.location);p.confirmTransitionTo(n,"PUSH",o,(function(e){if(e){var t=ze(n),r=c(u+t);if(Ye()!==r){h=t,function(e){window.location.hash=e}(r);var o=E.lastIndexOf(ze(T.location)),i=E.slice(0,o+1);i.push(t),E=i,d({action:"PUSH",location:n})}else d()}}))},replace:function(e,t){var n=Ae(e,void 0,void 0,T.location);p.confirmTransitionTo(n,"REPLACE",o,(function(e){if(e){var t=ze(n),r=c(u+t);Ye()!==r&&(h=t,Ge(r));var o=E.indexOf(ze(T.location));-1!==o&&(E[o]=t),d({action:"REPLACE",location:n})}}))},go:k,goBack:function(){k(-1)},goForward:function(){k(1)},block:function(e){void 0===e&&(e=!1);var t=p.setPrompt(e);return _||(S(1),_=!0),function(){return _&&(_=!1,S(-1)),t()}},listen:function(e){var t=p.appendListener(e);return S(1),function(){S(-1),t()}}};return T}function Je(e,t,n){return Math.min(Math.max(e,t),n)}var Ze=n(8),et=n.n(Ze),tt=n(13),nt=n.n(tt),rt=1073741823;var ot=o.a.createContext||function(e,t){var n,o,i="__create-react-context-"+nt()()+"__",a=function(e){function n(){var t,n,r;return(t=e.apply(this,arguments)||this).emitter=(n=t.props.value,r=[],{on:function(e){r.push(e)},off:function(e){r=r.filter((function(t){return t!==e}))},get:function(){return n},set:function(e,t){n=e,r.forEach((function(e){return e(n,t)}))}}),t}et()(n,e);var r=n.prototype;return r.getChildContext=function(){var e;return(e={})[i]=this.emitter,e},r.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n,r=this.props.value,o=e.value;((i=r)===(a=o)?0!==i||1/i==1/a:i!=i&&a!=a)?n=0:(n="function"==typeof t?t(r,o):rt,0!==(n|=0)&&this.emitter.set(e.value,n))}var i,a},r.render=function(){return this.props.children},n}(r.Component);a.childContextTypes=((n={})[i]=l.a.object.isRequired,n);var u=function(t){function n(){var e;return(e=t.apply(this,arguments)||this).state={value:e.getValue()},e.onUpdate=function(t,n){0!=((0|e.observedBits)&n)&&e.setState({value:e.getValue()})},e}et()(n,t);var r=n.prototype;return r.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=null==t?rt:t},r.componentDidMount=function(){this.context[i]&&this.context[i].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=null==e?rt:e},r.componentWillUnmount=function(){this.context[i]&&this.context[i].off(this.onUpdate)},r.getValue=function(){return this.context[i]?this.context[i].get():e},r.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return u.contextTypes=((o={})[i]=l.a.object,o),{Provider:a,Consumer:u}},it=n(9),at=n.n(it),ut=function(e){var t=ot();return t.displayName=e,t}("Router"),lt=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={location:t.history.location},n._isMounted=!1,n._pendingLocation=null,t.staticContext||(n.unlisten=t.history.listen((function(e){n._isMounted?n.setState({location:e}):n._pendingLocation=e}))),n}Se(t,e),t.computeRootMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}};var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},n.componentWillUnmount=function(){this.unlisten&&this.unlisten()},n.render=function(){return o.a.createElement(ut.Provider,{children:this.props.children||null,value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}})},t}(o.a.Component);o.a.Component;var ct=function(e){function t(){return e.apply(this,arguments)||this}Se(t,e);var n=t.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(e){this.props.onUpdate&&this.props.onUpdate.call(this,this,e)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},t}(o.a.Component);var st={},ft=1e4,pt=0;function dt(e,t){return void 0===e&&(e="/"),void 0===t&&(t={}),"/"===e?e:function(e){if(st[e])return st[e];var t=at.a.compile(e);return pt<ft&&(st[e]=t,pt++),t}(e)(t,{pretty:!0})}function mt(e){var t=e.computedMatch,n=e.to,r=e.push,i=void 0!==r&&r;return o.a.createElement(ut.Consumer,null,(function(e){e||Re(!1);var r=e.history,a=e.staticContext,u=i?r.push:r.replace,l=Ae(t?"string"==typeof n?dt(n,t.params):v({},n,{pathname:dt(n.pathname,t.params)}):n);return a?(u(l),null):o.a.createElement(ct,{onMount:function(){u(l)},onUpdate:function(e,t){var n,r,o=Ae(t.to);n=o,r=v({},l,{key:o.key}),n.pathname===r.pathname&&n.search===r.search&&n.hash===r.hash&&n.key===r.key&&Pe(n.state,r.state)||u(l)},to:n})}))}var ht={},yt=1e4,vt=0;function bt(e,t){void 0===t&&(t={}),("string"==typeof t||Array.isArray(t))&&(t={path:t});var n=t,r=n.path,o=n.exact,i=void 0!==o&&o,a=n.strict,u=void 0!==a&&a,l=n.sensitive,c=void 0!==l&&l;return[].concat(r).reduce((function(t,n){if(!n&&""!==n)return null;if(t)return t;var r=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=ht[n]||(ht[n]={});if(r[e])return r[e];var o=[],i={regexp:at()(e,o,t),keys:o};return vt<yt&&(r[e]=i,vt++),i}(n,{end:i,strict:u,sensitive:c}),o=r.regexp,a=r.keys,l=o.exec(e);if(!l)return null;var s=l[0],f=l.slice(1),p=e===s;return i&&!p?null:{path:n,url:"/"===n&&""===s?"/":s,isExact:p,params:a.reduce((function(e,t,n){return e[t.name]=f[n],e}),{})}}),null)}var gt=function(e){function t(){return e.apply(this,arguments)||this}return Se(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(ut.Consumer,null,(function(t){t||Re(!1);var n=e.props.location||t.location,r=v({},t,{location:n,match:e.props.computedMatch?e.props.computedMatch:e.props.path?bt(n.pathname,e.props):t.match}),i=e.props,a=i.children,u=i.component,l=i.render;return Array.isArray(a)&&0===a.length&&(a=null),o.a.createElement(ut.Provider,{value:r},r.match?a?"function"==typeof a?a(r):a:u?o.a.createElement(u,r):l?l(r):null:"function"==typeof a?a(r):null)}))},t}(o.a.Component);function wt(e){return"/"===e.charAt(0)?e:"/"+e}function Et(e,t){if(!e)return t;var n=wt(e);return 0!==t.pathname.indexOf(n)?t:v({},t,{pathname:t.pathname.substr(n.length)})}function kt(e){return"string"==typeof e?e:ze(e)}function xt(e){return function(){Re(!1)}}function St(){}o.a.Component;var _t=function(e){function t(){return e.apply(this,arguments)||this}return Se(t,e),t.prototype.render=function(){var e=this;return o.a.createElement(ut.Consumer,null,(function(t){t||Re(!1);var n,r,i=e.props.location||t.location;return o.a.Children.forEach(e.props.children,(function(e){if(null==r&&o.a.isValidElement(e)){n=e;var a=e.props.path||e.props.from;r=a?bt(i.pathname,v({},e.props,{path:a})):t.match}})),r?o.a.cloneElement(n,{location:i,computedMatch:r}):null}))},t}(o.a.Component);function Tt(e){var t="withRouter("+(e.displayName||e.name)+")",n=function(t){var n=t.wrappedComponentRef,r=b(t,["wrappedComponentRef"]);return o.a.createElement(ut.Consumer,null,(function(t){return t||Re(!1),o.a.createElement(e,v({},r,t,{ref:n}))}))};return n.displayName=t,n.WrappedComponent=e,w()(n,e)}o.a.useContext;o.a.Component;var Ct=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(t=e.call.apply(e,[this].concat(r))||this).history=Xe(t.props),t}return Se(t,e),t.prototype.render=function(){return o.a.createElement(lt,{history:this.history,children:this.props.children})},t}(o.a.Component);var Ot=function(e,t){return"function"==typeof e?e(t):e},Pt=function(e,t){return"string"==typeof e?Ae(e,null,null,t):e},Nt=function(e){return e},jt=o.a.forwardRef;void 0===jt&&(jt=Nt);var Rt=jt((function(e,t){var n=e.innerRef,r=e.navigate,i=e.onClick,a=b(e,["innerRef","navigate","onClick"]),u=a.target,l=v({},a,{onClick:function(e){try{i&&i(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||u&&"_self"!==u||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)||(e.preventDefault(),r())}});return l.ref=Nt!==jt&&t||n,o.a.createElement("a",l)}));var It=jt((function(e,t){var n=e.component,r=void 0===n?Rt:n,i=e.replace,a=e.to,u=e.innerRef,l=b(e,["component","replace","to","innerRef"]);return o.a.createElement(ut.Consumer,null,(function(e){e||Re(!1);var n=e.history,c=Pt(Ot(a,e.location),e.location),s=c?n.createHref(c):"",f=v({},l,{href:s,navigate:function(){var t=Ot(a,e.location);(i?n.replace:n.push)(t)}});return Nt!==jt?f.ref=t||u:f.innerRef=u,o.a.createElement(r,f)}))})),Mt=function(e){return e},Ut=o.a.forwardRef;void 0===Ut&&(Ut=Mt);Ut((function(e,t){var n=e["aria-current"],r=void 0===n?"page":n,i=e.activeClassName,a=void 0===i?"active":i,u=e.activeStyle,l=e.className,c=e.exact,s=e.isActive,f=e.location,p=e.strict,d=e.style,m=e.to,h=e.innerRef,y=b(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","strict","style","to","innerRef"]);return o.a.createElement(ut.Consumer,null,(function(e){e||Re(!1);var n=f||e.location,i=Pt(Ot(m,n),n),b=i.pathname,g=b&&b.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),w=g?bt(n.pathname,{path:g,exact:c,strict:p}):null,E=!!(s?s(w,n):w),k=E?function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return e})).join(" ")}(l,a):l,x=E?v({},d,{},u):d,S=v({"aria-current":E&&r||null,className:k,style:x,to:i},y);return Mt!==Ut?S.ref=t||h:S.innerRef=h,o.a.createElement(It,S)}))}));var Lt=function(e){return{loggedIn:Boolean(e.session.id)}},zt=Tt(ve(Lt)((function(e){var t=e.component,n=e.path,r=e.loggedIn,i=e.exact;return o.a.createElement(gt,{path:n,exact:i,render:function(e){return r?o.a.createElement(mt,{to:"/"}):o.a.createElement(t,e)}})}))),At=Tt(ve(Lt)((function(e){var t=e.component,n=e.path,r=e.loggedIn,i=e.exact;return o.a.createElement(gt,{path:n,exact:i,render:function(e){return r?o.a.createElement(t,e):o.a.createElement(mt,{to:"/login"})}})}))),Dt=function(e){return{type:"RECEIVE_CURRENT_USER",currentUser:e}},Ft=function(e){return{type:"RECEIVE_SESSION_ERRORS",errors:e}},qt=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/user",data:{user:e}})}(e).then((function(e){return t(Dt(e))}),(function(e){return t(Ft(e.responseJSON))}))}},Bt=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/session",data:{user:e}})}(e).then((function(e){return t(Dt(e))}),(function(e){return t(Ft(e.responseJSON))}))}},$t=function(){return function(e){return $.ajax({method:"DELETE",url:"/api/session"}).then((function(t){return e({type:"LOGOUT_CURRENT_USER"})}))}},Wt=function(e){return $.ajax({method:"GET",url:"/api/questions?".concat(e?$.param(e):"")})},Vt=function(e){return{type:"RECEIVE_ALL_QUESTIONS",questions:e}},Qt=function(e){return{type:"RECEIVE_QUESTION",payload:e}},Ht=function(e){return{type:"RECEIVE_QUESTION_ERRORS",errors:e}},Kt=function(e){return function(t){return Wt(e).then((function(e){return t(Vt(e))}),(function(e){return t(Ht(e))}))}},Yt=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/questions/".concat(e)})}(e).then((function(e){return t(Qt(e))}),(function(e){return t(Ht(e))}))}},Gt=function(e){return function(t){return(n=e,$.ajax({method:"DELETE",url:"api/questions/".concat(n)})).then((function(e){return t(Vt(e))}),(function(e){return t(Ht(e))}));var n}},Xt=function(e){return function(t){return(n=e,$.ajax({method:"POST",url:"/api/questions",data:{question:n}})).then((function(e){return t(Qt(e))}),(function(e){return t(Ht(e))}));var n}},Jt=function(e){return function(t){return(n=e,$.ajax({method:"PATCH",url:"/api/questions/".concat(n.id),data:{question:n}})).then((function(e){return t(Qt(e))}),(function(e){return t(Ht(e))}));var n}},Zt=function(e,t){return function(e){return Wt().then((function(n){return e(Vt(function(e,t){var n=new RegExp(t,"i");for(var r in e){var o=e[r].question;n.test(o)||delete e[r]}return e}(n,t)))}),(function(t){return e(Ht(t))}))}};function en(e){return(en="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function tn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function nn(e,t){return!t||"object"!==en(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function rn(e){return(rn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function on(e,t){return(on=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var an=Tt(function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),nn(this,rn(t).call(this,e))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&on(e,t)}(t,e),n=t,(r=[{key:"searchQuestion",value:function(){var e=this;return function(t){var n;if("/"!==e.props.history.location.pathname&&e.props.history.push("/"),t.target.value.includes(":")){var r=t.target.value.split(":");n={field:r[0],value:r[1]}}else n={field:"question",value:t.target.value};e.props.fetchQuestions(n)}}},{key:"render",value:function(){var e=this;return void 0===this.props.currentUser?o.a.createElement("div",null):o.a.createElement("div",{className:"siteHeader"},o.a.createElement("div",{className:"headerInner"},o.a.createElement("div",{className:"headerLogo"},o.a.createElement("a",{href:"/"},o.a.createElement("span",null,"Muses"))),o.a.createElement("div",{className:"headerContents"},o.a.createElement("div",{className:"headerNav"},o.a.createElement("button",{className:"submitButton",style:{marginTop:"10px"},onClick:e.props.logout},"Log Out"))),o.a.createElement("div",{className:"rightContents"},o.a.createElement("div",{className:"askBar"},o.a.createElement("div",{className:"lookupBarSelector"},o.a.createElement("input",{id:"headerSearchBar",onChange:e.searchQuestion(),placeholder:"Search Muses",className:"selectorInput",type:"text"})))),o.a.createElement("div",{className:"headerProfile"}),o.a.createElement("div",{className:"askWrapper"})))}}])&&tn(n.prototype,r),i&&tn(n,i),t}(o.a.Component)),un=ve((function(e,t){var n=Object.values(e.entities.questions);return{currentUser:null===e.session.id?void 0:e.session.id,questions:n}}),(function(e){return{logout:function(){return e($t())},search:function(t,n){return e(Zt(0,n))},fetchQuestions:function(t){return e(Kt(t))}}}))(an);function ln(e){return(ln="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function cn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function sn(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function fn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function pn(e){return(pn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function dn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function mn(e,t){return(mn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var hn=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==ln(t)&&"function"!=typeof t?dn(e):t}(this,pn(t).call(this,e))).state=n.props.default_user,n.handleLogin=n.handleLogin.bind(dn(n)),n.handleSignup=n.handleSignup.bind(dn(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&mn(e,t)}(t,e),n=t,(r=[{key:"update",value:function(e,t){var n=this;return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?cn(n,!0).forEach((function(t){sn(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):cn(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}}({},this.state[e]),function(r){return n.setState(sn({},e,Object.assign(n.state[e],sn({},t,r.target.value))))}}},{key:"handleLogin",value:function(e){e.preventDefault(),this.props.login(this.state)}},{key:"handleSignup",value:function(e){e.preventDefault(),this.props.signup(this.state)}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"loggedOutPage"},o.a.createElement("div",{className:"contentWrapper"},o.a.createElement("div",{className:"bgContainer"},o.a.createElement("div",{className:"bgImage"})),o.a.createElement("div",{className:"baseSignUpContainer"},o.a.createElement("div",{className:"projectLogo"}),o.a.createElement("h2",{className:"tagline"},"Where questions are asked, answered, and edited by users."),this.props.errors.length?o.a.createElement("div",{className:"session-errors"},e.props.errors):"",o.a.createElement("div",{className:"formContainer"},o.a.createElement("div",{className:"signUpLogin"},o.a.createElement("div",{className:"signup"},o.a.createElement("form",{onSubmit:this.handleSignup},o.a.createElement("div",{className:"title"},"Sign Up"),o.a.createElement("div",{className:"stackedForm"},o.a.createElement("div",{className:"firstLastNameGroup"},o.a.createElement("div",{className:"formRow half"},o.a.createElement("label",null,"First Name"),o.a.createElement("input",{className:"text",type:"text",tabIndex:"9",value:this.state.signup.first_name,onChange:this.update("signup","first_name")})),o.a.createElement("div",{className:"formRow half"},o.a.createElement("label",null,"Last Name"),o.a.createElement("input",{className:"text",type:"text",tabIndex:"9",value:this.state.signup.last_name,onChange:this.update("signup","last_name")}))),o.a.createElement("div",{className:"formRow"},o.a.createElement("label",null,"Email"),o.a.createElement("input",{className:"text",type:"text",value:this.state.email,onChange:this.update("signup","email")})),o.a.createElement("div",{className:"formRow"},o.a.createElement("label",null,"Password"),o.a.createElement("input",{className:"text",type:"password",value:this.state.signup.password,onChange:this.update("signup","password")}))),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"formButtons"},o.a.createElement("input",{className:"submitButton",type:"submit",value:"Sign Up"}))))),o.a.createElement("div",{className:"login"},o.a.createElement("div",{className:"regularLogin"},o.a.createElement("form",{onSubmit:this.handleLogin},o.a.createElement("div",{className:"title"},"Login"),o.a.createElement("div",{className:"formInputs"},o.a.createElement("div",{className:"formColumn"},o.a.createElement("input",{type:"text",id:"emailInput",placeholder:"Email",className:"text headerLoginTextBox",value:this.state.login.email,onChange:this.update("login","email")})),o.a.createElement("div",{className:"formColumn"},o.a.createElement("input",{type:"password",id:"passwordInput",placeholder:"Password",className:"text headerLoginTextBox",value:this.state.login.password,onChange:this.update("login","password")})),o.a.createElement("div",{className:"formColumn"},o.a.createElement("input",{className:"submitButton",id:"loginButton",type:"submit",value:"Login"}),o.a.createElement("input",{type:"hidden",name:"email",value:"ajakubczyk0@tiny.cc"}),o.a.createElement("button",{id:"demoButton",onClick:function(){e.state=e.props.demo_user},className:"submitButton demoButton"},"Demo")))))))))))}}])&&fn(n.prototype,r),i&&fn(n,i),t}(o.a.Component)),yn=ve((function(e){return{errors:e.errors.session,default_user:{signup:{first_name:"",last_name:"",email:"",password:""},login:{email:"",password:""}},demo_user:{login:{email:"ajakubczyk0@tiny.cc",password:"OgUq8GUitk"}}}}),(function(e){return{signup:function(t){return e(qt(t.signup))},login:function(t){return e(Bt(t.login))}}}))(hn),vn=function(e){var t=e.question;return o.a.createElement("div",{className:"feedItem"},o.a.createElement(It,{className:"questionText",to:"questions/".concat(t.id,"/")},t.question))},bn=function(){return function(e){return $.ajax({method:"GET",url:"/api/topics"}).then((function(t){return e(function(e){return{type:"RECEIVE_ALL_TOPICS",topics:e}}(t))}))}},gn=function(e){var t=new Date(e);return"".concat(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()]," ").concat(t.getDay(),", ").concat(t.getFullYear())};function wn(e){return(wn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function En(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function kn(e){return(kn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function xn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Sn(e,t){return(Sn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var _n=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==wn(t)&&"function"!=typeof t?xn(e):t}(this,kn(t).call(this,e))).state=n.props.default_comment,n.handleSubmit=n.handleSubmit.bind(xn(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Sn(e,t)}(t,e),n=t,(r=[{key:"update",value:function(e){var t=this;return function(n){var r,o,i;t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.props.match.params.question_id,n=this.props.default_comment.answer_id;this.props.action(t,n,this.state),this.setState(this.props.default_comment)}},{key:"render",value:function(){return o.a.createElement("div",{className:"addCommentGroup"},o.a.createElement("div",{className:"addCommentProfileAvatar"},o.a.createElement("img",{src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfBY-Rgh-5AduJ15F_FBljvzkeEdOTRuAWavFEC0XzNPrQoPYdLg"})),o.a.createElement("form",{onSubmit:this.handleSubmit},o.a.createElement("input",{type:"text",className:"addCommentInput",onChange:this.update("comment_body"),value:this.state.comment_body,placeholder:"Add a Comment"}),o.a.createElement("input",{type:"submit",className:"submitButton addCommentButton",value:"Add Comment"})))}}])&&En(n.prototype,r),i&&En(n,i),t}(o.a.Component)),Tn=function(e,t,n){return function(r){return function(e,t,n){return $.ajax({method:"POST",url:"/api/questions/".concat(e,"/answers/").concat(t,"/comments"),data:{comment:n}})}(e,t,n).then((function(e){return r(Qt(e))}))}},Cn=ve((function(e,t){return{default_comment:{comment_body:"",answer_id:t.answerId,comment_author_id:e.session.id}}}),(function(e){return{action:function(t,n,r){return e(Tn(t,n,r))}}}))(_n),On=function(e){var t="".concat(e.user.first_name," ").concat(e.user.last_name),n=e.comment.comment_body;return o.a.createElement("div",{className:"comment"},o.a.createElement("div",{className:"commentContents"},o.a.createElement("div",{className:"commentHeader"},o.a.createElement("div",{className:"commentProfileAvatar"},o.a.createElement("img",{src:"https://p.jing.fm/clipimg/small/115-1152777_profile-png-man-user-icon.png"})),o.a.createElement("div",{className:"commentDetails"},o.a.createElement("span",{className:"commentProfileFullName"},t),o.a.createElement("div",{className:"commentMetaData"},"Updated ".concat(e.date))))),o.a.createElement("span",{className:"commentBodyText"},n))},Pn=ve((function(e,t){var n=t.comment.comment_author_id;return{user:e.entities.users[n],date:gn(t.comment.created_at)}}),(function(e){return{}}))(On);function Nn(e){return(Nn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function jn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Rn(e,t){return!t||"object"!==Nn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function In(e){return(In=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Mn(e,t){return(Mn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Un=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Rn(this,In(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Mn(e,t)}(t,e),n=t,(r=[{key:"render",value:function(){var e=this.props.comments.map((function(e){return o.a.createElement(Pn,{key:e.id,comment:e})}));return o.a.createElement("div",{className:"commentListWrapper"},e)}}])&&jn(n.prototype,r),i&&jn(n,i),t}(o.a.Component),Ln=ve((function(e,t){var n=Object.values(e.entities.comments).filter((function(e){return e.answer_id==t.answerId})),r=Object.values(e.entities.users).filter((function(e){return n.map((function(e){return e.comment_author_id})).includes(e.id)}));return{comments:n,comment_authors:r}}),(function(e){return{}}))(Un),zn=function(e){return o.a.createElement("div",{className:"pageListItem"},o.a.createElement("div",{className:"answerBase"},o.a.createElement("div",{className:"answerHeader answerHeaderContent"},o.a.createElement("div",{className:"answerHeaderContentProfileAvatar"},o.a.createElement("img",{src:"https://p.jing.fm/clipimg/small/115-1152777_profile-png-man-user-icon.png"})),o.a.createElement("div",{className:"answerHeaderContentProfileText"},o.a.createElement("span",{className:"answerHeaderContentItem"},o.a.createElement("span",{className:"userDetails"},"".concat(e.user.first_name," ").concat(e.user.last_name))),o.a.createElement("span",{className:"answerHeaderContentItem"},o.a.createElement("div",{className:"userFacts"},"Answered ".concat(e.date))))),o.a.createElement("p",{className:"answerContent"},e.answer.answer_body),o.a.createElement("div",{className:"answerActionBar"}),o.a.createElement("div",{className:"threadedComments"},o.a.createElement(Cn,{answerId:e.answer.id}),o.a.createElement(Ln,{answerId:e.answer.id}))))},An=ve((function(e,t){var n=gn(t.answer.created_at);return{user:e.entities.users[t.answer.answer_author_id],date:n}}),(function(e){return{}}))(zn);function Dn(e){return(Dn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Fn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function qn(e){return(qn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Bn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function $n(e,t){return($n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Wn=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Dn(t)&&"function"!=typeof t?Bn(e):t}(this,qn(t).call(this,e))).state=n.props.answer,n.handleSubmit=n.handleSubmit.bind(Bn(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&$n(e,t)}(t,e),n=t,(r=[{key:"update",value:function(e){var t=this;return function(n){var r,o,i;t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.props.match.params.question_id;this.props.action(t,this.state),this.setState(this.props.answer)}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("form",{onSubmit:this.handleSubmit,className:"questionAnswerForm"},o.a.createElement("textarea",{onChange:this.update("answer_body"),placeholder:"Answer Question...",value:this.state.answer_body}),o.a.createElement("input",{className:"submitButton",type:"submit",value:"Submit"})))}}])&&Fn(n.prototype,r),i&&Fn(n,i),t}(o.a.Component)),Vn=function(e,t){return function(n){return function(e,t){return $.ajax({method:"POST",url:"/api/questions/".concat(e,"/answers"),data:{answer:t}})}(e,t).then((function(e){return n(Qt(e))}))}},Qn=ve((function(e,t){return{answer:{answer_body:"",answer_author_id:e.session.id}}}),(function(e){return{action:function(t,n){return e(Vn(t,n))}}}))(Wn);function Hn(e){return(Hn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Kn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Yn(e,t){return!t||"object"!==Hn(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Gn(e){return(Gn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Xn(e,t){return(Xn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Jn=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Yn(this,Gn(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Xn(e,t)}(t,e),n=t,(r=[{key:"render",value:function(){var e=this.props.answers.map((function(e){return o.a.createElement(An,{key:e.id,answer:e})}));return o.a.createElement("div",null,o.a.createElement(Qn,null),o.a.createElement("div",{className:"pageListWrapper"},e))}}])&&Kn(n.prototype,r),i&&Kn(n,i),t}(o.a.Component),Zn=ve((function(e,t){return{}}),(function(e){return{}}))(Jn);function er(e){return(er="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function tr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function nr(e){return(nr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function rr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function or(e,t){return(or=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var ir=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==er(t)&&"function"!=typeof t?rr(e):t}(this,nr(t).call(this,e))).state=n.props.question,n.handleSubmit=n.handleSubmit.bind(rr(n)),n.handleChange=n.handleChange.bind(rr(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&or(e,t)}(t,e),n=t,(r=[{key:"handleSubmit",value:function(e){e.preventDefault();var t=e.target.topics_drop_down.selectedIndex,n=this.props.availableTopics[t].id,r=this.props.question.topics;r.push(n);var o=Object.assign({},this.props.question,{topics:r});this.props.action(o)}},{key:"handleChange",value:function(e){}},{key:"render",value:function(){var e=this.props.availableTopics.map((function(e){return o.a.createElement("option",{key:e.id,value:e.id},e.name)}));return o.a.createElement("div",null,o.a.createElement("form",{onSubmit:this.handleSubmit},o.a.createElement("select",{className:"topics_drop_down",name:"topics_drop_down",defaultValue:"DEFAULT",onChange:this.handleChange},e),o.a.createElement("input",{type:"submit",style:{padding:"5px"},className:"submitButton",value:"Add Topic"})))}}])&&tr(n.prototype,r),i&&tr(n,i),t}(o.a.Component)),ar=ve((function(e,t){return{question:Object.values(e.entities.questions)[0]}}),(function(e){return{action:function(t){return e(Jt(t))}}}))(ir);function ur(e){return(ur="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function lr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function cr(e,t){return!t||"object"!==ur(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function sr(e){return(sr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function fr(e,t){return(fr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var pr=Tt(function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),cr(this,sr(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&fr(e,t)}(t,e),n=t,(r=[{key:"filterQByTopic",value:function(e){document.getElementById("headerSearchBar").fire}},{key:"render",value:function(){var e=[];return this.props.questionTopics&&(e=this.props.questionTopics.map((function(e){return o.a.createElement("div",{key:e.id,className:"questionTopicHeaderListItem"},o.a.createElement("span",null,e.name))}))),o.a.createElement("div",{className:"questionTopicHeaderList"},e,o.a.createElement(ar,{availableTopics:this.props.availableTopics}))}}])&&lr(n.prototype,r),i&&lr(n,i),t}(o.a.Component)),dr=ve((function(e,t){var n=[],r=[];return t.questionTopics.includes(void 0)||(n=t.questionTopics.map((function(e){return"".concat(e.id)})),r=Object.values(e.entities.topics).filter((function(e){return!n.includes("".concat(e.id))}))),{availableTopics:r}}),(function(e){return{fetchQuestions:function(t){return e(Kt(t))}}}))(pr);function mr(e){return(mr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function hr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function yr(e){return(yr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function vr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function br(e,t){return(br=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var gr=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==mr(t)&&"function"!=typeof t?vr(e):t}(this,yr(t).call(this,e))).state=n.props.question,n.handleSubmit=n.handleSubmit.bind(vr(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&br(e,t)}(t,e),n=t,(r=[{key:"update",value:function(e){var t=this;return function(n){var r,o,i;t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r))}}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.action(this.state)}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("form",{onSubmit:this.handleSubmit,className:"updateQuestionForm"},o.a.createElement("input",{type:"text",value:this.state.question,onChange:this.update("question")}),o.a.createElement("input",{className:"submitButton",type:"submit",value:"Update"})))}}])&&hr(n.prototype,r),i&&hr(n,i),t}(o.a.Component)),wr=ve((function(e,t){return{question:t.question}}),(function(e){return{action:function(t){return e(Jt(t))}}}))(gr);function Er(e){return(Er="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function kr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function xr(e){return(xr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Sr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _r(e,t){return(_r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Tr=Tt(function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Er(t)&&"function"!=typeof t?Sr(e):t}(this,xr(t).call(this,e))).state=n.props.options,n.displayEditForm=n.displayEditForm.bind(Sr(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_r(e,t)}(t,e),n=t,(r=[{key:"componentDidMount",value:function(){var e=this,t=this.props.match.params.question_id;this.props.fetchQuestion(t).then((function(){return e.props.fetchTopics()}))}},{key:"componentWillReceiveProps",value:function(e){this.displayEditForm(!1)}},{key:"displayEditForm",value:function(e){var t=e?"Cancel":"Edit";this.setState({displayEdit:e,displayEditBtn:t})}},{key:"render",value:function(){var e=this,t="",n=[],r=[],i=!1;if(void 0===this.props.question)return"loading component";t=this.props.question.question,Object.values(this.props.topics).length&&(r=this.props.question.topics.map((function(t){return e.props.topics[t]}))),n=this.props.answers;var a=(i=this.props.question.question_author_id===this.props.currentUserId)?o.a.createElement("a",{href:"",onClick:function(){return e.props.deleteQuestion(e.props.match.params.question_id)}},"Remove"):"",u=i?o.a.createElement("button",{id:"editUpdateBtn",className:"submitButton",onClick:function(){return e.displayEditForm(!e.state.displayEdit)}},this.state.displayEditBtn):"";return o.a.createElement("div",null,o.a.createElement("div",{className:"questionPage"},o.a.createElement("div",{className:"contentWrapper"},o.a.createElement("div",{className:"layout2colMain"},o.a.createElement("div",{className:"questionHeader"},o.a.createElement(dr,{questionTopics:r}),o.a.createElement("span",{className:"questionPageText"},this.state.displayEdit?o.a.createElement(wr,{question:this.props.question}):t),o.a.createElement("div",{className:"questionActions"},a,u)),o.a.createElement(Zn,{answers:n})))))}}])&&kr(n.prototype,r),i&&kr(n,i),t}(o.a.Component)),Cr=ve((function(e,t){var n=t.match.params.question_id;return{question:e.entities.questions[n],answers:Object.values(e.entities.answers),topics:e.entities.topics,currentUserId:e.session.id,options:{displayEdit:!1,displayEditBtn:"Edit"}}}),(function(e){return{fetchQuestion:function(t){return e(Yt(t))},fetchTopics:function(){return e(bn())},deleteQuestion:function(t){return e(Gt(t))}}}))(Tr);function Or(e){return(Or="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Pr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Nr(e){return(Nr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function jr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Rr(e,t){return(Rr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Ir=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t){return!t||"object"!==Or(t)&&"function"!=typeof t?jr(e):t}(this,Nr(t).call(this,e))).state=n.props.question,n.handleSubmit=n.handleSubmit.bind(jr(n)),n}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Rr(e,t)}(t,e),n=t,(r=[{key:"update",value:function(e){var t=this;return function(n){var r,o,i;t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r))}}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.action(this.state),this.setState(this.props.question)}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("form",{onSubmit:this.handleSubmit,className:"askQuestionButton"},o.a.createElement("input",{className:"askQuestionInput",type:"text",placeholder:"What is your question or link?",value:this.state.question,onChange:this.update("question")}),o.a.createElement("input",{className:"submitButton",type:"submit",value:"Add Question"})))}}])&&Pr(n.prototype,r),i&&Pr(n,i),t}(o.a.Component),Mr=ve((function(e,t){return{question:{question:"",question_author_id:e.session.id},allQuestions:e.entities.questions}}),(function(e){return{action:function(t){return e(Xt(t))}}}))(Ir);function Ur(e){return(Ur="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Lr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function zr(e,t){return!t||"object"!==Ur(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Ar(e){return(Ar=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Dr(e,t){return(Dr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Fr=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),zr(this,Ar(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Dr(e,t)}(t,e),n=t,(r=[{key:"componentDidMount",value:function(){this.props.fetchQuestions()}},{key:"render",value:function(){var e=this.props.questions.map((function(e,t){return o.a.createElement(vn,{key:t,question:e})}));return o.a.createElement("div",{className:"layout3ColCenter"},o.a.createElement("div",{className:"addQuestionPrompt"},o.a.createElement("div",{className:"userAsksHeader"},o.a.createElement(Mr,null))),e)}}])&&Lr(n.prototype,r),i&&Lr(n,i),t}(o.a.Component),qr=ve((function(e,t){return{questions:Object.values(e.entities.questions)}}),(function(e){return{fetchQuestions:function(){return e(Kt())}}}))(Fr);function Br(e){return(Br="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function $r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Wr(e,t){return!t||"object"!==Br(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Vr(e){return(Vr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Qr(e,t){return(Qr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Hr=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),Wr(this,Vr(t).apply(this,arguments))}var n,r,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Qr(e,t)}(t,e),n=t,(r=[{key:"componentDidMount",value:function(){this.props.fetchTopics()}},{key:"filterQByTopic",value:function(e){var t={field:"topic",value:"".concat(e)};this.props.fetchQuestions(t),this.forceUpdate()}},{key:"render",value:function(){var e=this,t=this.props.topics;return t.length&&(t=t.map((function(t){return o.a.createElement("li",{key:t.id,className:"topicItem"},o.a.createElement("a",{href:"#",onClick:function(){return e.filterQByTopic(t.id)},className:"topicItemLink"},o.a.createElement("div",{className:"topicItemLinkImage"}),o.a.createElement("div",{className:"topicLabel"},t.name)))}))),o.a.createElement("div",{className:"layout3ColLeft"},o.a.createElement("div",{className:"leftColInner"},o.a.createElement("ul",null,t)))}}])&&$r(n.prototype,r),i&&$r(n,i),t}(o.a.Component),Kr=ve((function(e,t){var n=[];return t.discussedTopics&&(n=Object.values(e.entities.topics).filter((function(e){return t.discussedTopics.includes("".concat(e.id))}))),{topics:n}}),(function(e){return{fetchTopics:function(){return e(bn())},fetchQuestions:function(t){return e(Kt(t))}}}))(Hr),Yr=function(e){return o.a.createElement("div",{className:"feed"},o.a.createElement("div",{className:"contentWrapper"},o.a.createElement("div",{className:"gridPage"},o.a.createElement(Kr,{discussedTopics:e.discussedTopics}),o.a.createElement(qr,null))))};function Gr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Xr(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Jr=ve((function(e,t){var n=e.entities.questions,r=[];return Object.values(n).length&&(r=Object.values(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Gr(n,!0).forEach((function(t){Xr(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Gr(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},Object.values(e.entities.questions).map((function(e){return e.topics})).flat()))),{discussedTopics:r}}),(function(e){return{}}))(Yr),Zr=function(){return o.a.createElement("div",null,o.a.createElement("header",null,o.a.createElement(un,null)),o.a.createElement(_t,null,o.a.createElement(zt,{exact:!0,path:"/login",component:yn}),o.a.createElement(At,{exact:!0,path:"/",component:Jr}),o.a.createElement(At,{path:"/questions/:question_id",component:Cr})))},eo=function(e){var t=e.store;return o.a.createElement(y,{store:t},o.a.createElement(Ct,null,o.a.createElement(Zr,null)))};function to(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}var no=to();no.withExtraArgument=to;var ro=no,oo=Object.freeze({}),io=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:oo,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_ALL_QUESTIONS":var n={};return Object.values(t.questions).forEach((function(e){n[e.question_author_id]={id:e.question_author_id,first_name:e.question_author_first_name,last_name:e.question_author_last_name}})),Object.assign({},n);case"RECEIVE_QUESTION":return Object.assign({},t.payload.users);default:return e}};function ao(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var uo=Object.freeze({}),lo=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:uo,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"FILTERED_QUESTIONS":return t.question;case"RECEIVE_ALL_QUESTIONS":return Object.assign({},t.questions);case"RECEIVE_QUESTION":var n=t.payload.question,r=n.id;return Object.assign({},ao({},r,n));default:return e}},co=Object.freeze({}),so=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:co,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_QUESTION":return Object.assign({},t.payload.answers);case"RECEIVE_ALL_QUESTIONS":return co;default:return e}},fo=Object.freeze({}),po=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:fo,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_QUESTION":return Object.assign({},t.payload.comments);case"RECEIVE_ALL_QUESTIONS":return fo;default:return e}},mo=Object.freeze({}),ho=D({topics:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:mo,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_ALL_TOPICS":return Object.assign({},t.topics);default:return e}},comments:po,users:io,questions:lo,answers:so}),yo=Object.freeze({id:null}),vo=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:yo,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return{id:t.currentUser.id};case"LOGOUT_CURRENT_USER":return yo;default:return e}},bo=D({session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_SESSION_ERRORS":return t.errors;case"RECEIVE_CURRENT_USER":return[];default:return e}},questions:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_QUESTION_ERRORS":return t.errors.responseJSON;case"RECEIVE_QUESTION":return[];default:return e}}}),go=D({entities:ho,session:vo,errors:bo}),wo=[ro],Eo=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return z(go,e,Q.apply(void 0,wo))};document.addEventListener("DOMContentLoaded",(function(){var e;if(window.currentUser){var t={session:{id:window.currentUser.id}};delete window.currentUser,e=Eo(t)}else e=Eo();var n=document.getElementById("root");a.a.render(o.a.createElement(eo,{store:e}),n)}))}]);
//# sourceMappingURL=bundle.js.map
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//






;
