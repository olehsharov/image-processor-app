require('dotenv').config();
const express = require('express');
const app = express();
const ImageLibrary = require('./services/ImageLibrary');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = 8899;

app.use(bodyParser.json())
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use((req, res, next) => {
    res.header('Content-Security-Policy', "default-src *  data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval' 'unsafe-dynamic'; object-src  * data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src * data: blob: 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: 'unsafe-inline'; style-src * data: blob: 'unsafe-inline';font-src * data: blob: 'unsafe-inline';");
    next();
})

app.use(express.static('build'));

var imageLibrary = new ImageLibrary(process.env.DATA_FOLDER, process.env.EXPORT_FOLDER);

app.get('/images', (req, res) => {
    res.send(imageLibrary.list());
})

app.get('/images/export/:image', async (req, res) => {
    await imageLibrary.export(req.params.image)
    res.status(200).send();
})

app.get('/images/:image', (req, res) => {
    res.send(imageLibrary.get(req.params.image));
})

app.post('/images/:image', (req, res) => {
    imageLibrary.saveSettings(req.params.image, req.body)
    res.status(200).send();
});

app.get('/images/:image/:type', async (req, res) => {
    var size = parseInt(req.query.size);
    var format = req.query.format;
    res.contentType('image/jpg').send(await imageLibrary.image(req.params.image, req.params.type, size, format));
})



app.get('/*', (req, res) => {
    res.contentType("html");
    res.send(fs.readFileSync(`${__dirname}/../build/index.html`));
})


module.exports = { app }