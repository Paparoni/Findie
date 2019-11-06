
app.get('/data', function(req, res) {
    /*
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    */
    res.send(JSON.stringify("pee"));
});

app.get('/spotify_login', function(req, res) {
    /*
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    */
    
    res.send(authorizeURL)
    
});

app.get('/callback', function(req, res) {
    if (req.query.code) {
        res.redirect(config.hostname + 'login_success')
    } else {

    }
})

app.get('/login_success', function(req, res) {
    io.emit('test', 'test')
})