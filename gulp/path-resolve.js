module.exports = getPathSettings();

function getPathSettings() {

  var paths = require('./path-settings');

  // replace 'modules/*/' with 'modules/{list of modules}/
  // regarding current configuration

  var config = require('../config');
  resolveModules(paths, config.modules);

  return paths;
}

function resolveModules(paths, modules) {
  return resolveObject(paths);

  function resolveObject(paths) {
    Object.keys(paths).forEach(function (key) {
      var val = paths[key];
      if (Array.isArray(val)) {
        paths[key] = val.map(resolvePath);
      } else if (typeof val === 'string') {
        paths[key] = resolvePath(val);
      } else if (typeof val === 'object') {
        resolveObject(val);
      }
    });
  }

  function resolvePath(path) {
    var searchString = 'modules/*/';
    if (path.indexOf(searchString) === 0) {
      return ['modules/{',
        modules.join(),
        '}/',
        path.substr(searchString.length)].join('');
    }
    return path;
  }
}