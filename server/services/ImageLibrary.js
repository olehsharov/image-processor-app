const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const defaultSettings = require('./default_settings');
const sharp = require('sharp');
const walk = require('@nodelib/fs.walk');
const uuid = require('uuid');
const _ = require('lodash')
const Queue = require('bee-queue');
const rembgQueue = new Queue("rembg", { isWorker: false });
// function ImageLibrary(libraryFolder, outputFolder) {
//     this.libraryFolder = libraryFolder;
//     this.outputFolder = outputFolder;
// }

// ImageLibrary.prototype.list = function() {
//     var files = fs.readdirSync(this.input)
//         .filter(f => !f.includes("failed") && !f.startsWith(".") && (f.toLowerCase().endsWith('jpg') || f.toLowerCase().endsWith('jpeg')))
//         .sort((a, b) => fs.statSync(`${this.input}/${b}`).mtime.getTime() - fs.statSync(`${this.input}/${a}`).mtime.getTime());

//     var result = [];
//     for (var f in files) {
//         result.push(this.get(files[f]));
//     }
//     return result;
// }

// ImageLibrary.prototype.get = function(file) {
//     var foreground = null;
//     var settings = null;
    
//     var metadataPath = `${this.input}/${file}.background`;
//     if (fs.existsSync(metadataPath)) {
//         original   =  fs.existsSync(`${metadataPath}/original.jpg`) && `original.jpg`;
//         foreground =  fs.existsSync(`${metadataPath}/foreground.png`) && `foreground.png`;
//         settings   = fs.existsSync(`${metadataPath}/settings.json`) && JSON.parse(fs.readFileSync(`${metadataPath}/settings.json`));
//     }

//     return {
//         file: file,
//         foreground: foreground,
//         settings: settings
//     }
// }

// ImageLibrary.prototype.image = async function(file, type, size, format) {
//     var output = null;
//     if (type == 'original') { // should read from /${file}.background/original.jpg
//         output = sharp(`${this.input}/${file}`);
//     }

//     if (type == 'foreground') {
//         output = sharp(`${this.input}/${file}.background/foreground.png`);
//     }

//     if (output) {
//         output = size   ? output.resize(size) : output;
//         output = format ? output.toFormat(format) : output;
//         return output.rotate().toBuffer();
//     }
// }

// ImageLibrary.prototype.saveSettings  = function(image, settings) {
//     var object = JSON.parse(JSON.stringify(settings));
//     object.maskSettings.edit = false;
//     fs.writeFileSync(`${this.input}/${image}.background/settings.json`, JSON.stringify(object, null, 2));
// }

// ImageLibrary.prototype.process = function(image) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             var start = new Date().getTime();
//             var file = image.file;
//             var outputFolder = `${this.input}/${file}.background`;

//             if (!fs.existsSync(outputFolder)) {
//                 fs.mkdirSync(outputFolder);
//             }
        
//             console.log(`${file}: original`);
//             try {
//                 await sharp(`${this.input}/${file}`).rotate().toFile(`${outputFolder}/original.jpg`);
//             } catch (err) {
//                 console.error('Cant read file', file)
//                 console.error(err)
//                 return;
//             }
        
//             console.log(`${file}: background`);
//             var foreground = `${outputFolder}/foreground.png`;
//             var command = `python "server/rembg/remove.py" "${outputFolder}/original.jpg" "${foreground}"`
//             console.log(command);
//             child_process.exec(command, (error, stderr, stdout) => {
//                 if (error) {
//                     fs.rmdirSync(outputFolder, {recursive:true});
//                     fs.renameSync(`${this.input}/${file}`, `${this.input}/${file}.failed`);
//                     console.error(error, stderr);
//                     // reject(error);
//                 } else {
//                     var endTime = new Date().getTime() - start;
//                     console.log(`${file}: done in ${endTime/100}s`);
//                     var settings = JSON.parse(JSON.stringify(defaultSettings));
//                     settings.processedTime = endTime;
//                     fs.writeFileSync(`${outputFolder}/settings.json`, JSON.stringify(settings));
//                     resolve(stdout);
//                 }
//             });
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

// ImageLibrary.prototype.export = async function(image) {
//     var filename = path.basename(image, path.extname(image))
//     var exportFile = `${this.output}/${filename}_export.png`;
//     const browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox'], 
//         headless: true
//     });
//     const page = await browser.newPage();
//     page.setViewport({width:3000, height: 3000});
//     await page.goto(`http://localhost:8899/export/${image}`, {
//         waitUntil: "networkidle0",
//         timeout: 0
//     });
//     await page.screenshot({path: exportFile,  type: "png"});
//     await browser.close();
// }

class ImageLibrary {
    constructor(libraryFolder, outputFolder) {
        this.libraryFolder = libraryFolder;
        this.outputFolder = outputFolder;
    }
    listLibraries() {
        return fs.readdirSync(this.libraryFolder)
            .filter(f => !f.startsWith('.'))
            .map(f => {
                return this.getLibrary(f)
            });
    }
    libFolder(folder) {
        return path.join(this.libraryFolder, folder);
    }
    createLibrary(name) {
        var folder = uuid.v1();
        fs.mkdirSync(this.libFolder(folder));
        var metadata = this.libraryMetadata(folder);
        metadata.name = name;
        fs.writeFileSync(this.libraryMetadataFile(folder), JSON.stringify(metadata));
        return this.getLibrary(folder);
    }
    getLibrary(folder) {
        return {
            folder: folder,
            metadata: this.libraryMetadata(folder),
            ...fs.statSync(this.libFolder(folder))
        }
    }
    libraryMetadataFile(folder) {
        return path.join(this.libraryFolder, folder, 'library.json');
    }
    libraryMetadata(folder) {
        var metadata = { name: "Без имени" }
        if (fs.existsSync(this.libraryMetadataFile(folder))) {
            metadata = JSON.parse(fs.readFileSync(this.libraryMetadataFile(folder)))
        }
        return metadata;
    }
    setLibraryName(folder, name) {
        var metadata = this.libraryMetadata(folder);
        metadata.name = name;
        fs.writeFileSync(this.libraryMetadataFile(folder), JSON.stringify(metadata, null, 2))
    }
    listFiles(folder) {
        return fs.readdirSync(path.join(this.libraryFolder, folder))
            .filter(f => f.endsWith('jpg') && !f.includes('small'))
            .map(f => f.replace('.jpg', ''));
    }
    thumbnail(name, image) {
        return path.join(this.libraryFolder, name, `${image}.small.jpg`)
    }
    foreground(name, image) {
        return path.join(this.libraryFolder, name, `${image}.background/foreground.png`)
    }
    image(name, image) {
        return path.join(this.libraryFolder, name, `${image}.jpg`)
    }
    saveCollection(name, collection, files) {
        files.forEach(f => {
            var metadata = this.imageMetadata(name, f);
            metadata.collection = collection;
            this.writeImageMetadata(name, f, metadata);
        })
    }
    listImages(name) {
        return this.populateName(name, this.listFiles(name));
    }
    async starImages(folder, files, starred) {
        if (starred) {
            await Promise.all(files.map(f => rembgQueue.createJob({ library: folder,  file: f }).save()))
        }
        files.forEach(f => {
            var metadata = this.imageMetadata(folder, f);
            metadata.starred = starred;
            this.writeImageMetadata(folder, f, metadata);
        })
    }
    async saveForegroundSettings(folder, files, settings) {
        files.forEach(f => {
            var metadata = this.imageMetadata(folder, f);
            metadata.sharpness = settings.sharpness;
            metadata.foregroundSettings = settings.foregroundSettings;
            this.writeImageMetadata(folder, f, metadata);
        })
    }
    importProgress(name) {
        var total = fs.readdirSync(path.join(this.libraryFolder, name))
            .filter(f => f.startsWith('import'))
            .map(f => JSON.parse(fs.readFileSync(path.join(this.libraryFolder, name, f))))
            .reduce((a,b) => a + b.files, 0);
        var imported = this.listFiles(name).length;
        return {
            total: total,
            imported: imported
        };
    }
    imageMetadataFile(name, img) {
        return path.join(this.libraryFolder, name, `${img}.json`)
    }
    imageMetadata(name, img) {
        return JSON.parse(fs.readFileSync(this.imageMetadataFile(name, img)))
    }
    writeImageMetadata(name, img, metadata) {
        fs.writeFileSync(this.imageMetadataFile(name, img), JSON.stringify(metadata))
    }
    populateName(name, images) {
        return images.map(img => {
            return {
                image: img,
                ...fs.statSync(this.imageMetadataFile(name, img)),
                metadata: {
                    starred: this.imageMetadata(name, img).starred,
                    name: this.imageMetadata(name, img).name,
                    collection: this.imageMetadata(name, img).collection
                }
            }
        });
    }
    populateMetadata(name, images) {
        return images.map(img => {
            return {
                image: img,
                metadata: this.imageMetadata(name, img)
            }
        });
    }
    async importFolder(folder, library) {
        try {
            if (!fs.existsSync(folder)) {
                throw new Error(`Error: ${folder} does not exist`);
            }

            var entries = walk.walkSync(folder, { 
                entryFilter: e => e.name.toLocaleLowerCase().endsWith('jpg') || e.name.toLocaleLowerCase().endsWith('jpeg'),
                stats: true
            })
            console.log(`[${folder}]: importing ${entries.length} files`);
            
            var importInfoFile   = path.join(this.libraryFolder, library, `import_${uuid.v1()}.json`);
            fs.writeFileSync(importInfoFile, JSON.stringify(
                {
                    folder: folder,
                    files: entries.length
                }
            ));

            entries = entries.sort((a, b) => {
                if (a.stats.ctimeMs > b.stats.ctimeMs) return 1;
                if (b.stats.ctimeMs > a.stats.ctimeMs) return -1;
                return 0;
            })

            for (var e in entries) {
                var file = entries[e];
                var fileTo   = path.join(this.libraryFolder, library);
                console.log(file.name)
                var newFilename = uuid.v1();
                var input = sharp(file.path).rotate();
                await Promise.all([
                    fs.promises.writeFile(path.join(fileTo, `${newFilename}.json`), JSON.stringify(Object.assign({name: file.name}, defaultSettings), null, 2)),
                    input.jpeg({ quality: 100 }).toFile(path.join(fileTo, `${newFilename}.jpg`)),
                    input.resize(380).jpeg({ quality: 70 }).toFile(path.join(fileTo, `${newFilename}.small.jpg`))
                ])
            }
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    removeBackground(library, image) {
        return new Promise(async (resolve, reject) => {
            try {
                var start = new Date().getTime();
                var folder = path.join(this.libraryFolder, library);
                var outputFolder = `${folder}/${image}.background`;

                if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
            
                console.log(`${image}: background`);
                var command = `python "server/rembg/remove.py" "${folder}/${image}.jpg" "${outputFolder}/foreground.png"`
                console.log(command);
                child_process.exec(command, (error, stderr, stdout) => {
                    if (error) {
                        console.error(error, stderr);
                    } else {
                        var endTime = new Date().getTime() - start;
                        console.log(`${image}: done in ${endTime/100}s`);
                        var metadata = this.imageMetadata(library, image);
                        metadata.processed = true;
                        this.writeImageMetadata(library, image, metadata);
                        resolve(stdout);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ImageLibrary;