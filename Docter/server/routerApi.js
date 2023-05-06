module.exports = router = (app) => {
    app.get('/' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    // app.get('/list' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    // });

    // // plus
    // app.get('/plus' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    // });

    // app.get('/plus/confirm' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    // });
    // // plus

    // app.get('/docter' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    // });
}