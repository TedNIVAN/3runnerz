// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/serial.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serial = void 0;
var serial = {};
exports.serial = serial;

function serialComponent() {
  'use strict';

  serial.getPorts = function () {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function () {
    const filters = [{
      'vendorId': 0x2341,
      'productId': 0x8036
    }, // Arduino Leonardo
    {
      'vendorId': 0x2341,
      'productId': 0x8037
    }, // Arduino Micro
    {
      'vendorId': 0x2341,
      'productId': 0x804d
    }, // Arduino/Genuino Zero
    {
      'vendorId': 0x2341,
      'productId': 0x804e
    }, // Arduino/Genuino MKR1000
    {
      'vendorId': 0x2341,
      'productId': 0x804f
    }, // Arduino MKRZERO
    {
      'vendorId': 0x2341,
      'productId': 0x8050
    }, // Arduino MKR FOX 1200
    {
      'vendorId': 0x2341,
      'productId': 0x8052
    }, // Arduino MKR GSM 1400
    {
      'vendorId': 0x2341,
      'productId': 0x8053
    }, // Arduino MKR WAN 1300
    {
      'vendorId': 0x2341,
      'productId': 0x8054
    }, // Arduino MKR WiFi 1010
    {
      'vendorId': 0x2341,
      'productId': 0x8055
    }, // Arduino MKR NB 1500
    {
      'vendorId': 0x2341,
      'productId': 0x8056
    }, // Arduino MKR Vidor 4000
    {
      'vendorId': 0x2341,
      'productId': 0x8057
    }, // Arduino NANO 33 IoT
    {
      'vendorId': 0x239A
    } // Adafruit Boards!
    ];
    return navigator.usb.requestDevice({
      'filters': filters
    }).then(device => new serial.Port(device));
  };

  serial.Port = function (device) {
    this.device_ = device;
    this.interfaceNumber_ = 2; // original interface number of WebUSB Arduino demo

    this.endpointIn_ = 5; // original in endpoint ID of WebUSB Arduino demo

    this.endpointOut_ = 4; // original out endpoint ID of WebUSB Arduino demo
  };

  serial.Port.prototype.connect = function () {
    let readLoop = () => {
      this.device_.transferIn(this.endpointIn_, 64).then(result => {
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device_.open().then(() => {
      if (this.device_.configuration === null) {
        return this.device_.selectConfiguration(1);
      }
    }).then(() => {
      var configurationInterfaces = this.device_.configuration.interfaces;
      configurationInterfaces.forEach(element => {
        element.alternates.forEach(elementalt => {
          if (elementalt.interfaceClass == 0xff) {
            this.interfaceNumber_ = element.interfaceNumber;
            elementalt.endpoints.forEach(elementendpoint => {
              if (elementendpoint.direction == "out") {
                this.endpointOut_ = elementendpoint.endpointNumber;
              }

              if (elementendpoint.direction == "in") {
                this.endpointIn_ = elementendpoint.endpointNumber;
              }
            });
          }
        });
      });
    }).then(() => this.device_.claimInterface(this.interfaceNumber_)).then(() => this.device_.selectAlternateInterface(this.interfaceNumber_, 0)).then(() => this.device_.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x01,
      'index': this.interfaceNumber_
    })).then(() => {
      readLoop();
    });
  };

  serial.Port.prototype.disconnect = function () {
    return this.device_.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00,
      'index': this.interfaceNumber_
    }).then(() => this.device_.close());
  };

  serial.Port.prototype.send = function (data) {
    return this.device_.transferOut(this.endpointOut_, data);
  };
}

serialComponent();
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58912" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/serial.js"], null)
//# sourceMappingURL=/serial.42dec2f1.js.map