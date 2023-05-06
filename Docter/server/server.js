const app = require('./api')

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port '+process.env.PORT+'!\n');
});