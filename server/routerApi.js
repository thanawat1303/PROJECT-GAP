module.exports = function router(app) {
    // router admin
    app.get('/admin' , function(req, res) {
        console.log("admin")
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/data' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    // plus
    // app.get('/admin/plus' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // app.get('/admin/plus/confirm' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // // plus
    // app.get('/admin/doctor' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });

    // router doctor
    app.get('/doctor' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/list' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/push' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // farmer
    app.get('/doctor/farmer' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap/:id_farmer' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt/:id_farmer' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // farmer

    // form
    app.get('/doctor/form' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // app.get('/doctor/form/ap' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/ap/:id_form' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt/:id_form' , function(req, res) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // form

    app.get('/doctor/export' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    app.get('/doctor/listformfarm/approve' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/listformfarm/wait' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/logout' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // Farmer
    app.get('/farmer/signup' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    
    app.get('/farmer/house' , function(req, res) {
        // console.log(req)
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    app.get('/farmer/form' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    // page error 404
    app.get('/' , function(req, res) {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });
}