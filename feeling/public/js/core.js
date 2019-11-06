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


var startProgressBar = function() {
    $("#progressbar-label").show()
    var messages = ["Finding out if Keke loves me...", "Harassing Frank Ocean for a new album...", "Anxiously awaiting Kanye\'s next masterpiece...", "Letting the bodies hit the floor...", "Waking up inside...", "Bathing while listening to Kid Cudi hum....", "Listening to Despacito 2 feat. Lil Pump, Mozart,  Tyler The Creator, Jaden Smith, Morrinsoney, Kurt Cobain, Kanye West, Odd Future, David Bowie...", "Taking a selfie...", "Walking 1000 miles just to see you...", ],
        step_1, step_2, step_3, step_4, complete = false,
        bar = new ProgressBar.Line(progressbar, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 3000, //44000
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
               $("#enjoy").show('slide', {}, 1000)
           })
       })
    })
}
var runspotifyAlgorithm = function(){
    socket.emit('run-algorithm', function(response){
        var results = response;
        console.log(results)
        console.log(results);
    })
}
var startSpotifyResults = function() {
    $("#progressbar-container").hide();
    runspotifyAlgorithm();
    $("#spotifydata-container").show();
    animateContainers();
}
app.controller('findieCtrl', function($scope, $http) {

    $scope.login = function() {
        socket.emit('login', function(response) {
            window.location.replace(response.data)
        })
    }
    socket.emit('get-current-playing', function(data) {
        $scope.Currently_listening = data.result;
    })

    $scope.start = function() {
        $("#startbutton").hide();
        $('#logo').animate({
            'margin-top': '-150px'
        }, 1000, "swing", function() {
            $(this).after(function() {
                $("#progressbar").show()
                startProgressBar();
            })
        });



    }


});

socket.on('is-logged-in', function() {
    $('#loginbutton').hide()
    $('#startbutton').show()
})