const app = require('./apiAdmin')

app.listen(process.env.PORT , "0.0.0.0" , function () {
    console.log('Example app listening on port '+process.env.PORT+'!\n');
});