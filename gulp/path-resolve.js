var util = require('gulp-util');
var log = util.log;
module.exports = getPathSettings();

function getPathSettings() {

  var paths = require('./path-settings');

  // replace 'src/*/' with 'src/{list of modules}/
  // regarding current configuration

  var modules = require('../config/defaults/modules');
  resolveModules(paths, modules);

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
    var searchString = 'src/*/';
    if (path.indexOf(searchString) === 0) {
      path = ['src/{',
        modules.join(','),
        '}/',
        path.substr(searchString.length)].join('');
    }
    log(path);
    return path;
  }
}
