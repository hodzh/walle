var fs = require('fs');
var path = require('path');
var defaults = require('./defaults');

var config = {};

setEnv(defaults.env);

module.exports = config;

function setEnv(env) {
  update(env);
}

function clear() {
  Object.keys(config).forEach(clearKey);

  function clearKey(key) {
    delete config[key];
  }
}

function tryRequire(mode) {
  try {
    switch (mode) {
      case 'defaults' :
        return require('./defaults');
      case 'development' :
        return require('./development');
      case 'production' :
        return require('./production');
      case 'test' :
        return require('./test');
      default:
        console.error('unknown environment mode', mode);
        return;
    }
  }
  catch (e) {
    console.error(e);
    return {};
  }
}

function update(env) {
  clear();

  updateDir(__dirname);

  config.env = env;
  config.setEnv = setEnv;
  config.getAssets = getAssets;
  config.merge = merge;

  function updateDir(dir) {
    var defaults = tryRequire('defaults');
    var mode = tryRequire(env);
    mergeConfig(config, defaults);
    mergeConfig(config, mode);
  }
}

function mergeConfig(data, dataToMerge) {
  Object.keys(dataToMerge).forEach(mergeKey);

  function mergeKey(key) {
    var value = data[key];
    var valueToMerge = dataToMerge[key];
    if (typeof value === 'object' && !(value instanceof Array)) {
      mergeConfig(value, valueToMerge);
      return;
    }
    data[key] = valueToMerge;
  }
}

function getAssets(ext) {
  var jsFiles = [];
  addAssets(config.assets);
  return jsFiles;

  function addAssets(assets) {
    Object.keys(assets).forEach(
      function (key) {
        var asset = assets[key];
        if (key === ext) {
          Object.keys(asset).forEach(
            function (jsKey) {
              jsFiles = jsFiles.concat(asset[jsKey]);
            }
          );
        }
        else if (key === 'css') {

        }
        else if (!(asset instanceof Array)) {
          addAssets(asset);
        }
      }
    );
  }

}

function merge(obj) {
  mergeConfig(config, obj);
}
