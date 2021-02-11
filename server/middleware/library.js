const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const Queue = require('bee-queue');
const ImageLibrary = require('../services/ImageLibrary');

var LIBRARY_FOLDER = process.env.LIBRARY_FOLDER;
var INPUT_FOLDER = process.env.INPUT_FOLDER;
var EXPORT_FOLDER = process.env.EXPORT_FOLDER;

const library = new ImageLibrary(LIBRARY_FOLDER, EXPORT_FOLDER);
const importQueue = new Queue("import", { isWorker: false });

router.get("/api/libraries", (req, res) => {
    res.send(library.listLibraries());
})
router.post("/api/libraries", (req, res) => {
    res.send(library.createLibrary(req.body.name));
})
router.put("/api/libraries/:library", (req, res) => {
    res.send(library.setLibraryName(req.params.library, req.body.name));
})
router.get("/api/libraries/:library/images", (req, res) => {
    res.send(library.listImages(req.params.library));
})
router.put("/api/libraries/:library/images/star", (req, res) => {
    library.starImages(req.params.library, req.body.files, req.body.starred)
    res.sendStatus(200);
})
router.put("/api/libraries/:library/images/foreground", (req, res) => {
    library.saveForegroundSettings(req.params.library, req.body.files, req.body.settings)
    res.sendStatus(200);
})
router.put("/api/libraries/:library/images/mask", (req, res) => {
    library.saveMaskSettings(req.params.library, req.body.files, req.body.settings)
    res.sendStatus(200);
})
router.put("/api/libraries/:library/images/export", (req, res) => {
    library.exportImages(req.params.library, req.body.files)
    res.sendStatus(200);
})
router.get("/api/libraries/:library/images/isempty", (req, res) => {
    res.send(library.listImages(req.params.library).length == 0);
})
router.get("/api/libraries/:library/importprogress", (req, res) => {
    res.send(library.importProgress(req.params.library));
})
router.get("/api/libraries/:library/images/:image/metadata", (req, res) => {
    res.send(library.imageMetadata(req.params.library, req.params.image));
})
router.put("/api/libraries/:library/images/:image/metadata", (req, res) => {
    res.send(library.writeImageMetadata(req.params.library, req.params.image, req.body));
})
router.get("/api/libraries/:library/images/:image/thumbnail", (req, res) => {
    res.sendFile(library.thumbnail(req.params.library, req.params.image));
})
router.get("/api/libraries/:library/images/:image/foreground", (req, res) => {
    res.sendFile(library.foreground(req.params.library, req.params.image));
})
router.get("/api/libraries/:library/images/:image/foreground/thumbnail", async (req, res) => {
    res.sendFile(await library.foregroundThumbnail(req.params.library, req.params.image));
})
router.get("/api/libraries/:library/images/:image", (req, res) => {
    res.sendFile(library.image(req.params.library, req.params.image));
})
router.post("/api/libraries/:library/collections", (req, res) => {
    library.saveCollection(req.params.library, req.body.collection, req.body.files)
    res.sendStatus(200);
})

router.get("/api/input/*", (req, res) => {
    var queryPath = req.path.replace('/api/input/', '');
    var fullPath = path.join(INPUT_FOLDER, queryPath)
    if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
            var result = fs.readdirSync(fullPath)
                .filter(f => !f.toLocaleLowerCase().startsWith('.') && fs.statSync(path.join(fullPath, f)).isDirectory())
                .map(f => {
                    var stats = fs.statSync(path.join(fullPath, f));
                    return {
                        name: f,
                        ...stats,
                        isFile: stats.isFile(),
                        isImage: false
                    }
            })
            result = result.sort((a, b) => a.isFile ? 1 : -1);
            res.send(result)
        } else {
            res.sendFile(fullPath)
        }
    } else {
        res.send(404);
    }
})
router.get("/api/export/*", (req, res) => {
    var queryPath = decodeURIComponent(req.path.replace('/api/export/', ''));
    var fullPath = path.join(EXPORT_FOLDER, queryPath)
    if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
            var result = fs.readdirSync(fullPath)
                .filter(f => !f.toLocaleLowerCase().startsWith('.'))
                .map(f => {
                    var stats = fs.statSync(path.join(fullPath, f));
                    return {
                        name: f,
                        ...stats,
                        isFile: stats.isFile(),
                        isImage: f.toLowerCase().endsWith('png')
                    }
            })
            result = result.sort((a, b) => a.isFile ? 1 : -1);
            res.send(result)
        } else {
            res.sendFile(fullPath)
        }
    } else {
        res.send(404);
    }
})

router.post("/api/import/*", async (req, res) => {
    var queryPath = req.path.replace('/api/import/', '');
    var folder = path.join(INPUT_FOLDER, queryPath)
    if (fs.existsSync(folder)) {
        var job = importQueue.createJob({ source: folder,  library: req.body.library }).save()
        res.send(job);
    } else {
        res.send(404);
    }
})

module.exports = router;