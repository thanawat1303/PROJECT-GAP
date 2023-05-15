process.stdin.on('data', (data) => {
    const input = data.toString().trim(); // แปลงข้อมูลที่รับเข้ามาให้อยู่ในรูปแบบสตริงและตัดช่องว่างที่ต้นท้าย
  
    console.log('คุณป้อน:', input);
});

let username = "dev1303"
let password = "1660500178936Ff"

if(true) {
    const app = require('./configExpress')(username , password)
    app.listen(process.env.PORT , "0.0.0.0" , function () {
        console.log('Start on port '+process.env.PORT+'!\n');
    });
} else {
    console.log("Found Problem Run Server")
    // exit
}