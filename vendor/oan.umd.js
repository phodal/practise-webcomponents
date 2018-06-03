(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.oan = {})));
}(this, (function (exports) { 'use strict';

  var App = {};
  //# sourceMappingURL=app.js.map

  var Dep = /** @class */ (function () {
      function Dep() {
          this.deps = [];
      }
      Dep.prototype.addDep = function (watcher) {
          if (watcher) {
              this.deps.push(watcher);
          }
      };
      Dep.prototype.notify = function () {
          this.deps.forEach(function (watcher) {
              watcher.update();
          });
      };
      return Dep;
  }());
  //# sourceMappingURL=Dep.js.map

  var Watcher = /** @class */ (function () {
      function Watcher(vm, node, name, nodeType) {
          Dep.target = this;
          this.name = name;
          this.node = node;
          this.vm = vm;
          this.nodeType = nodeType;
          this.update();
          Dep.target = null;
      }
      Watcher.prototype.get = function () {
          this.value = this.vm[this.name];
      };
      Watcher.prototype.update = function () {
          this.get();
          if (this.nodeType === 'text') {
              this.node.nodeValue = this.value;
          }
          if (this.nodeType === 'input') {
              this.node.value = this.value;
          }
      };
      return Watcher;
  }());
  //# sourceMappingURL=Watcher.js.map

  function Observe(obj, vm) {
      Object.keys(obj).forEach(function (key) {
          defineReactive(vm, key, obj[key]);
      });
  }
  function defineReactive(obj, key, val) {
      var dep = new Dep();
      Object.defineProperty(obj, key, {
          get: function () {
              if (Dep.target) {
                  dep.addDep(Dep.target);
              }
              return val;
          },
          set: function (newVal) {
              if (newVal === val)
                  return;
              val = newVal;
              dep.notify();
          }
      });
  }
  //# sourceMappingURL=Observe.js.map

  var DiliComponent = function (component) {
      function DiliElement() {
          var construct = Reflect.construct(HTMLElement, [], DiliElement);
          construct.constructor(component);
          return construct;
      }
      DiliElement.prototype = Object.create(HTMLElement.prototype, {
          constructor: {
              value: function constructor() {
                  var _this = this;
                  this.component = component;
                  var data = this.component.data;
                  if (data) {
                      Observe(data, this.component);
                  }
                  this.childNodes.forEach(function (node) {
                      var reg = /{{(.*)}}/;
                      var that = _this;
                      var nodeName = node.nodeName.toLowerCase();
                      if (nodeName === 'input') {
                          if (node.attributes && node.attributes.length > 0) {
                              var mapName = void 0;
                              var _loop_1 = function (i) {
                                  var attr = node.attributes[i];
                                  if (attr.name === '[model]') {
                                      var name_1 = (mapName = attr.nodeValue);
                                      node.addEventListener('input', function (e) {
                                          that.component[name_1] = e.target.value;
                                      });
                                      node.value = that.component.data[name_1];
                                      node.removeAttribute('[model]');
                                  }
                              };
                              for (var i = 0; i < node.attributes.length; i++) {
                                  _loop_1(i);
                              }
                              var watcher = new Watcher(that.component, node, mapName, 'input');
                          }
                      }
                      if (node.nodeType === node.TEXT_NODE) {
                          if (reg.test(node.nodeValue)) {
                              var name_2 = RegExp.$1; // 获取匹配到的字符串
                              name_2 = name_2.trim();
                              var watcher = new Watcher(that.component, node, name_2, 'text');
                          }
                      }
                  });
                  return DiliElement;
              }
          },
          connectedCallback: {
              value: function connectedCallback() {
                  // this._childrenRead = false;
                  // https://stackoverflow.com/questions/49786436/accessing-childnodes-of-custom-elments
                  // const shadowRoot = this.attachShadow({mode: 'open'});
                  // const template = document.createElement('template');
                  // template.innerHTML = `Place your template here`;
                  // const instance = template.content.cloneNode(true);
                  // shadowRoot.appendChild(instance);
                  console.log('connected');
                  this.component.connected();
              }
          },
          attributeChangedCallback: {
              value: function attributeChangedCallback() {
                  console.log('attributeChangedCallback');
                  this.component.change();
              }
          },
          disconnectedCallback: {
              value: function disconnectedCallback() {
                  console.log('disconnectedCallback');
                  this.component.disconnected();
              }
          },
          adoptedCallback: {
              value: function adoptedCallback() {
                  console.log('adoptedCallback');
                  this.component.adopted();
              }
          }
      });
      return customElements.define("" + component.is, DiliElement);
  };

  var components = [];
  function Component(component) {
      var diliComponent = DiliComponent(component);
      components.push({
          is: component.is,
          component: diliComponent
      });
      App.components = components;
  }
  //# sourceMappingURL=oan.js.map

  exports.App = App;
  exports.Component = Component;
  exports.DiliComponent = DiliComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
