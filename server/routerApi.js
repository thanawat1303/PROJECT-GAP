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
    app.get('/admin/doctor' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    // router doctor
    app.get('/doctor' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/doctor/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });
    app.get('/doctor/push' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index.html'));
    });

    // page error 404
    app.get('/' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });
}