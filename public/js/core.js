/*/* Copyright © - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Antwaun Tune <aj.yaboy@outlook.com>, August 2018
 */
var app = angular.module('Findie', []);
var socket = io(config.hostname);

// disable scrolling https://stackoverflow.com/questions/3034390/deactivate-or-remove-the-scrollbar-on-html
function keydownHandler(e) {
var evt = e ? e:event;
  var keyCode = evt.keyCode;

  if (keyCode==38 || keyCode==39 || keyCode==40 || keyCode==37){ //arrow keys
e.preventDefault()
scrollTo(0,0);
}
}

document.onkeydown=keydownHandler;

var specialCharacterFilter = function(string){
    let exp = /[\\'!]/g;
    let res = string.replace(exp, '');
    return res;
}
var startProgressBar = function() {
    $("#progressbar-label").show()
    var messages = ["Finding out if Keke loves me...", "Harassing Frank Ocean for a new album...", "Anxiously awaiting Kanye\'s next masterpiece...", "Letting the bodies hit the floor...", "Waking up inside...", "Bathing while listening to Kid Cudi hum....", "Listening to Despacito 2 feat. Lil Pump, Mozart,  Tyler The Creator, Jaden Smith, Morrinsoney, Kurt Cobain, Kanye West, Odd Future, David Bowie...", "Taking a selfie...", "Walking 1000 miles just to see you...", "Dropping Astroworld..." ],
        step_1, step_2, step_3, step_4, complete = false,
        bar = new ProgressBar.Line(progressbar, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 10400, //44000
            color: 'green',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {
                width: '100%',
                height: '100%'
            },
            text: {
                style: {
                    color: '#999',
                    position: 'absolute',
                    right: '10px',
                    left: '50',
                    bottom: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    align: 'center',
                    transform: null
                },
                autoStyleContainer: false
            },
            from: {
                color: '#FFEA82'
            },
            to: {
                color: '#ED6A5A'
            },
            step: (state, bar) => {
                var val = Math.round(bar.value() * 100),
                    msg;
                switch (val) {
                    case 1:
                        if (step_1) {

                        } else {
                            msg = messages[Math.floor(Math.random() * messages.length)];
                            $("#progressbar-label").text(msg)
                            step_1 = true;
                        }
                        break;
                    case 30:
                        if (step_2) {

                        } else {
                            msg = messages[Math.floor(Math.random() * messages.length)];
                            $("#progressbar-label").text(msg)
                            step_2 = true;
                        }
                        break;
                    case 60:
                        if (step_3) {

                        } else {
                            msg = messages[Math.floor(Math.random() * messages.length)];
                            $("#progressbar-label").text(msg)
                            step_3 = true;
                        }
                        break;
                    case 90:
                        if (step_4) {

                        } else {
                            msg = messages[Math.floor(Math.random() * messages.length)];
                            $("#progressbar-label").text(msg)
                            step_4 = true;
                        }
                        break;

                    case 100:
                        if (complete) {

                        } else {
                            complete = true;
                            startSpotifyResults();
                        }
                        break;


                }

            }
        });

    bar.animate(1.0);
}
var animateContainers = function() {
    $("#spotifydata-container").show()
    $("#spotifydata-1").show('bounce', {}, 1000, function(){
       $("#spotifydata-2").show('bounce', {}, 1000, function() {
           $("#spotifydata-3").show('bounce', {}, 1000, function(){
               $("#tryagain").show('slide', {}, 1000);
           })
       })
    })
}
var runspotifyAlgorithm = function(type, content){
    let data = {
        searchType: type,
        query: content
    }
    socket.emit('search', data, function(response){
        var results = response.data;
        $("#spot1").attr('src', `http://open.spotify.com/embed?uri=spotify:track:${results[0]}`);
        $("#spot2").attr('src', `http://open.spotify.com/embed?uri=spotify:track:${results[1]}`);
        $("#spot3").attr('src', `http://open.spotify.com/embed?uri=spotify:track:${results[2]}`);

    })
}
var startSpotifyResults = function() {
    $("#progressbar-container").hide();
    runspotifyAlgorithm(search.type, search.content);
    $("#spotifydata-container").show();
    animateContainers();
}
var search = {

    type: null,

    setType: function(value) {
        search.type = value;
    },

    content: [],

    setContent: function(val) {
        search.content.push(val)
    },
}
app.controller('findieCtrl', function($scope, $http) {

    socket.emit('get-current-playing', function(data) {
        $scope.Currently_listening = data.result;
    })
    $scope.artist = function(){
        $("#dropdown").text("By Artist");
        $("#box2").hide()
        $("#box1").attr("placeholder", "Artist");
        search.setType("artist")

    }
    $scope.song = function(){
        $("#dropdown").text('By Song');
        $("#box1").attr("placeholder", "Song Title");
        $("#box2").show()
        search.setType('song')
    }
    $scope.url = function(){
        $("#dropdown").text('By URL');
        $("#box1").attr("placeholder", "URL");
        $("#box2").hide()
        search.setType('url')
    }
    $scope.tryAgain = function(){
        window.location.reload(false);
    }
    $scope.getStarted = function() {
        if(search.type !== null){
        switch(search.type){
            case 'artist':
                search.setContent(specialCharacterFilter($("#box1").val()))
                break;
            case 'song':
                search.setContent(specialCharacterFilter($("#box1").val()))
                search.setContent(specialCharacterFilter($("#box2").val()))
                break;
            case 'url':
                search.setContent(specialCharacterFilter($("#box1").val()))
                break;
        }
        console.log(search.content);
        $("#startbutton").hide();
        var animateLogo = function(){
         $('#logo').animate({
            'margin-top': '-150px'
        }, 1000, "swing", function() {
            $(this).after(function() {
                console.log("called")
                $("#progressbar").show()
                startProgressBar();
            })
        });
        }
        $("#input-box").animate({
            opacity: 0
        }, 1000, "", function(){
            $(this).after(function(){
              animateLogo();
            })
        })
    } else {
        toastr.error("Please select a search method");
    }
    }

});

socket.on('is-logged-in', function() {
    $('#loginbutton').hide()
    $('#startbutton').show()
})
