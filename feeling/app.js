/* Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const io = require("socket.io")(server);
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('./public/js/config.js').config;

app.use(express.static(__dirname + '/public')).use(cors());

var randomStringGenerate = function(length) {
    var poss = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let final = "";
    for (let i = 0; i < length; i++) {
        final += poss[Math.floor(Math.random() * poss.length)];
    }
    return final;
};
var scopes = ['user-read-private', 'user-read-email', 'user-library-read', 'user-read-recently-played', 'user-top-read', 'user-read-currently-playing', 'user-read-playback-state', 'user-follow-read'],
    state = randomStringGenerate(16);



var currentSocket;
var credentials = {
    clientId: "5401e30d339b449583cc8c5d8dd00507",
    clientSecret: '2dfe8528bd654617a36fabbeff3494a0',
    redirectUri: config.hostname + 'callback'
};
const spotify = new SpotifyWebApi(credentials);

io.on('connection', function(socket) {
    spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);
});


server.listen(eval(config.port.toString()));