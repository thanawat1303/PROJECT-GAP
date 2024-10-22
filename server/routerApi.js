module.exports = function router(app) {
    // router admin
    app.get('/admin' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/list' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/data' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    // plus
    // app.get('/admin/plus' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // app.get('/admin/plus/confirm' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // // plus
    // app.get('/admin/doctor' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });

    // router doctor
    app.get('/doctor' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/list' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/push' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // farmer
    app.get('/doctor/farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap/:id_farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt/:id_farmer' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // farmer

    // form
    app.get('/doctor/form' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    app.get('/doctor/data' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // app.get('/doctor/form/ap' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/ap/:id_form' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt/:id_form' , (req, res) => {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // form

    app.get('/doctor/export' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    app.get('/doctor/listformfarm/approve' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/listformfarm/wait' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/logout' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // Farmer
    app.get('/farmer/signup' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    
    app.get('/farmer/house' , (req, res) => {
        // console.log(req)
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    app.get('/farmer/form' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant/:sub_page' , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
}