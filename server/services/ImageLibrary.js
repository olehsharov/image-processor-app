const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const defaultSettings = require('./default_settings');
const sharp = require('sharp');

function ImageLibrary(input, output) {
    this.input = input;
    this.output = output;
}

ImageLibrary.prototype.list = function() {
    var files = fs.readdirSync(this.input)
        .filter(f => !f.includes("failed") && !f.startsWith(".") && (f.toLowerCase().endsWith('jpg') || f.toLowerCase().endsWith('jpeg')))
        .sort((a, b) => fs.statSync(`${this.input}/${b}`).mtime.getTime() - fs.statSync(`${this.input}/${a}`).mtime.getTime());

    var result = [];
    for (var f in files) {
        result.push(this.get(files[f]));
    }
    return result;
}

ImageLibrary.prototype.get = function(file) {
    var foreground = null;
    var settings = null;
    
    var metadataPath = `${this.input}/${file}.background`;
    if (fs.existsSync(metadataPath)) {
        original   =  fs.existsSync(`${metadataPath}/original.jpg`) && `original.jpg`;
        foreground =  fs.existsSync(`${metadataPath}/foreground.png`) && `foreground.png`;
        settings   = fs.existsSync(`${metadataPath}/settings.json`) && JSON.parse(fs.readFileSync(`${metadataPath}/settings.json`));
    }

    return {
        file: file,
        foreground: foreground,
        settings: settings
    }
}

ImageLibrary.prototype.image = async function(file, type, size, format) {
    var output = null;
    if (type == 'original') { // should read from /${file}.background/original.jpg
        output = sharp(`${this.input}/${file}`);
    }

    if (type == 'foreground') {
        output = sharp(`${this.input}/${file}.background/foreground.png`);
    }

    if (output) {
        output = size   ? output.resize(size) : output;
        output = format ? output.toFormat(format) : output;
        return output.rotate().toBuffer();
    }
}

ImageLibrary.prototype.saveSettings  = function(image, settings) {
    var object = JSON.parse(JSON.stringify(settings));
    object.maskSettings.edit = false;
    fs.writeFileSync(`${this.input}/${image}.background/settings.json`, JSON.stringify(object, null, 2));
}

ImageLibrary.prototype.process = function(image) {
    return new Promise(async (resolve, reject) => {
        try {
            var start = new Date().getTime();
            var file = image.file;
            var outputFolder = `${this.input}/${file}.background`;

            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }
        
            console.log(`${file}: original`);
            try {
                await sharp(`${this.input}/${file}`).rotate().toFile(`${outputFolder}/original.jpg`);
            } catch (err) {
                console.error('Cant read file', file)
                console.error(err)
                return;
            }
        
            console.log(`${file}: background`);
            var foreground = `${outputFolder}/foreground.png`;
            var command = `python "server/rembg/remove.py" "${outputFolder}/original.jpg" "${foreground}"`
            console.log(command);
            child_process.exec(command, (error, stderr, stdout) => {
                if (error) {
                    fs.rmdirSync(outputFolder, {recursive:true});
                    fs.renameSync(`${this.input}/${file}`, `${this.input}/${file}.failed`);
                    console.error(error, stderr);
                    // reject(error);
                } else {
                    var endTime = new Date().getTime() - start;
                    console.log(`${file}: done in ${endTime/100}s`);
                    var settings = JSON.parse(JSON.stringify(defaultSettings));
                    settings.processedTime = endTime;
                    fs.writeFileSync(`${outputFolder}/settings.json`, JSON.stringify(settings));
                    resolve(stdout);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

ImageLibrary.prototype.export = async function(image) {
    var filename = path.basename(image, path.extname(image))
    var exportFile = `${this.output}/${filename}_export.png`;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: true
    });
    const page = await browser.newPage();
    page.setViewport({width:3000, height: 3000});
    await page.goto(`http://localhost:8899/export/${image}`, {
        waitUntil: "networkidle0",
        timeout: 0
    });
    await page.screenshot({path: exportFile,  type: "png"});
    await browser.close();
}


module.exports = ImageLibrary;