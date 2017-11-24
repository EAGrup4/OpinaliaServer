'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        profileImage: user.profileImage,
        iat: moment().unix(),
        exp: moment().add(30, 'days'.unix)

    }

    return jwt.encode(payload, secret);
}