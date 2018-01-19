'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';
var request = require('request');

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petition has not an authentication header'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp >= moment().unix){
            return res.status(401).send({
                message: 'Token expired'
            })
        }
    }catch(ex){
        return res.status(404).send({
            message: 'Token not valid'
        })
    }
    req.user = payload;

    next();
};
exports.ensureAuthFB = function (req, res,next) {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petition has not an authentication header'});
    }
    var access_token = req.headers.authorization.replace(/['"]+/g,'');
    console.log(access_token);
    request.get(
        'https://graph.facebook.com/me?access_token='+access_token,
        function (error, response, body) {
            var resFB = JSON.parse(response.body);
            if (error) {
                return res.status(404).send({message: 'Token not valid'});
            }else {
                console.log(response);
                if ((response) && (resFB.id === req.body.id)) {
                    next();
                }else res.status(405).send({message: 'Token not valid'});
            }
        }
    );
};