require('dotenv').config();
const express = require('express');
const app = express();
const ImageLibrary = require('./services/ImageLibrary');
const bodyParser = require('body-parser');

const PORT = 8899;

app.use(bodyParser.json())
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(express.static('build'));

var imageLibrary = new ImageLibrary(process.env.DATA_FOLDER);

app.get('/images', (req, res) => {
    res.send(imageLibrary.list());
})

app.get('/images/:image', (req, res) => {
    res.send(imageLibrary.get(req.params.image));
})

app.get('/images/:image/:type', async (req, res) => {
    var size = parseInt(req.query.size);
    var format = req.query.format;
    res.contentType('image/jpg').send(await imageLibrary.image(req.params.image, req.params.type, size, format));
})

module.exports = { app }