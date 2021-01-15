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
    ///res.send(imageLibrary.get(req.params.image));
});

app.post('/images/:image', (req, res) => {
    res.send(200);
    ///res.send(imageLibrary.get(req.params.image));
})

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