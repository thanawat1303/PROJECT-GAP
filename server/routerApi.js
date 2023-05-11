module.exports = router = (app) => {
    // router admin
    app.get('/admin' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/admin/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    // plus
    app.get('/admin/plus' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/admin/plus/confirm' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    // plus
    app.get('/admin/docter' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    // router docter
    app.get('/docter' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/docter/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/docter/push' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    // page error 404
    app.get('/' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });
}