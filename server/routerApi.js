module.exports = function router(app) {
    // router admin
    app.get('/admin' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/admin/index.html'));
    });
    app.get('/admin/list' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/admin/index.html'));
    });
    app.get('/admin/data' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/admin/index.html'));
    });

    // router doctor
    app.get('/doctor' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/list' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/push' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });

    // farmer
    app.get('/doctor/farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/farmer/ap' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/farmer/wt' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/farmer/ap/:id_farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/farmer/wt/:id_farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    // farmer

    // form
    app.get('/doctor/form' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/data' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    // form

    app.get('/doctor/export' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/listformfarm/approve' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/listformfarm/wait' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });
    app.get('/doctor/logout' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/doctor/index.html'));
    });

    // router farmer
    app.get('/farmer/signup' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
    app.get('/farmer/house' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
    app.get('/farmer/form' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
    app.get('/farmer/form/:id_farm' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant/:sub_page' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/build/farmer/index.html'));
    });
}