'use strict';

var passport = require('passport');

module.exports = route;

function route(router, auth){
  router.post('/', localAuth);

  function localAuth(req, res, next) {
    passport.authenticate('local', onLocalAuth)(req, res, next);

    function onLocalAuth(err, user, info) {
      var error = err || info;
      if (error) {
        return res.status(401).json(error);
      }
      if (!user) {
        return res.status(404).json({
          message: 'Something went wrong, please try again.'
        });
      }

      var token = auth.signToken(user._id, user.role);
      res.json({
        token: token,
        user: user.sanitize()
      });
    }
  }
}
