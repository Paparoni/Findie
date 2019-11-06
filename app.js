/* Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 */
//require('newrelic');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const io = require("socket.io")(server);
const spotifyapi = require('spotify-web-api-node');
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



var credentials = {
    clientId: "",
    clientSecret: '',
};
const spotify = new spotifyapi(credentials);



io.on('connection', function(socket) {
    spotify.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotify.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);
    socket.on('login', function() {});

    socket.on('search', function(content, fn) {
        console.log(content)
        let base_artist = {
            name: '',
            id: '',
            featured: {
                name: '',
                id: ''
            }
        };
        let related_artist = {
            id: '',
            id_2: '',
            id_3: ''
        }
        if (content.searchType == 'song') {
            let song_box = []
            spotify.searchTracks(`track:${content.query[0]} artist:${content.query[1]}`)
                .then(function(data) {
                    let song = data.body.tracks.items[0];
                    base_artist.name = song.artists[0].name
                    base_artist.id = song.artists[0].id
                    if (song.artists.length > 1) {
                        base_artist.featured.name = song.artists[1].name
                        base_artist.featured.id = song.artists[1].id
                    }
                    console.log(base_artist)
                    spotify.getArtistRelatedArtists(base_artist.id)
                        .then(function(data) {
                            let artists = data.body.artists;
                            related_artist.id = artists[Math.floor(Math.random() * artists.length)].name
                            related_artist.id_2 = artists[Math.floor(Math.random() * artists.length)].name
                            related_artist.id_3 = artists[Math.floor(Math.random() * artists.length)].name
                            let related_artists = [related_artist.id, related_artist.id_2, related_artist.id_3];
                            related_artists.forEach(function(artist) {
                                spotify.searchTracks(`artist:${artist}`)
                                    .then(function(data) {
                                        song_box.push(data.body.tracks.items[Math.floor(Math.random() * data.body.tracks.items.length)].id);
                                        console.log(data.body)
                                        if (song_box.length == 3) {
                                            fn({
                                                data: song_box
                                            });

                                        }

                                    }, function(err) {
                                        console.log('Something went wrong!', err);
                                    });
                            })


                        }, function(err) {
                            done(err);
                        });
                }, function(err) {
                    console.log('Something went wrong!', err);
                });

        }
    })

});


server.listen(eval(config.port.toString()));
