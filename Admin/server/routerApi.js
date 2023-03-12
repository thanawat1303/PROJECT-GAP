module.exports = router = (app) => {
    app.get('/' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    app.get('/test' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
}