export default function router(app : any) {
    // router admin
    app.get('/admin' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/list' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/data' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    // plus
    // app.get('/admin/plus' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // app.get('/admin/plus/confirm' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });
    // // plus
    // app.get('/admin/doctor' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    // });

    // router doctor
    app.get('/doctor' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/list' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/push' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // farmer
    app.get('/doctor/farmer' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/ap/:id_farmer' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/farmer/wt/:id_farmer' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // farmer

    // form
    app.get('/doctor/form' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    // app.get('/doctor/form/ap' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/ap/:id_form' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // app.get('/doctor/form/wt/:id_form' , function(req:any, res:any) {
    //     res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    // });
    // form

    app.get('/doctor/export' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    app.get('/doctor/listformfarm/approve' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/listformfarm/wait' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
    app.get('/doctor/logout' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });

    // Farmer
    app.get('/farmer/signup' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    
    app.get('/farmer/house' , function(req:any, res:any) {
        // console.log(req)
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    app.get('/farmer/form' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/form/:id_farm/:page/:id_form_plant' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    // page error 404
    app.get('/' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });
}