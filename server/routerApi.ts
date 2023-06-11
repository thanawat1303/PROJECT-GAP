export default function router(app : any) {
    // router admin
    app.get('/admin' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_admin.html'));
    });
    app.get('/admin/list' , function(req:any, res:any) {
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
    app.get('/doctor/form' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_doctor.html'));
    });
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
    app.get('/farmer' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });
    app.get('/farmer/house' , function(req:any, res:any) {
        // console.log(req)
        res.sendFile(__dirname.replace('\server' , '/public/index_farmer.html'));
    });

    // page error 404
    app.get('/' , function(req:any, res:any) {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });
}