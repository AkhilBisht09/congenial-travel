var express = require("express");
var router = express.Router();
var passport = require("passport");
var request = require("request");

router.get("/", function(req, res) {
    res.render('prefform');
})

router.get("/getAuthToken", function(req, res) {
    var options = { method: 'POST',
    url: 'https://outpost.mapmyindia.com/api/security/oauth/token',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' },
    form: { 
        grant_type: 'client_credentials',
        client_id: 'ssjo__xshqWdTMxSDZ3UU9ESGm-5HYccLI_SLUE8nbd0LdTwwXV5Mw==',
        client_secret: 'TemcsCSHrfSfxsmN6vPAoCMOy4MTvYe5ssnakIL5MK3NaLxQCGVPeQ2NTCNj6CEB' } 
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
    });
});

router.get("/nearby/lat/:lng", function(req, res) {
    var request = require("request");
    var lat = req.params.lat

    var options = { 
        method: 'GET',
        url: 'https://atlas.mapmyindia.com/api/places/nearby/json',
        qs: { keywords: 'shoes', refLocation: '28.454,77.435', page: '2' },
    headers: {
        authorization: 'bearerf253152e-35ee-4fde-bdc1-b973ccb4540b' } 
    };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
})

module.exports = router;