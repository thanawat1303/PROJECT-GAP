module.exports = router = (app) => {
    app.get('/admin' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/indexAdmin.html'));
    });

    app.get('/admin/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/indexAdmin.html'));
    });

    // plus
    app.get('/admin/plus' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/indexAdmin.html'));
    });

    app.get('/admin/plus/confirm' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/indexAdmin.html'));
    });
    // plus

    app.get('/admin/docter' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/indexAdmin.html'));
    });
}