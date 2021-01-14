const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const defaultSettings = require('./default_settings');
const sharp = require('sharp');

function ImageLibrary(folder) {
    this.root = folder;
}

ImageLibrary.prototype.list = function() {
    var files = fs.readdirSync(this.root)
        .filter(f => !f.includes("failed") && !f.startsWith(".") && (f.toLowerCase().endsWith('jpg') || f.toLowerCase().endsWith('jpeg')))
        .sort((a, b) => fs.statSync(`${this.root}/${b}`).mtime.getTime() - fs.statSync(`${this.root}/${a}`).mtime.getTime());

    var result = [];
    for (var f in files) {
        result.push(this.get(files[f]));
    }
    return result;
}

ImageLibrary.prototype.get = function(file) {
    var foreground = null;
    var settings = null;
    
    var metadataPath = `${this.root}/${file}.background`;
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
        output = sharp(`${this.root}/${file}`);
    }

    if (type == 'foreground') {
        output = sharp(`${this.root}/${file}.background/foreground.png`);
    }

    if (output) {
        output = size   ? output.resize(size) : output;
        output = format ? output.toFormat(format) : output;
        return output.rotate().toBuffer();
    }
}

ImageLibrary.prototype.saveSettings  = function(imagePath, settings) {
    var object = JSON.parse(JSON.stringify(settings));
    object.maskSettings.edit = false;
    fs.writeFileSync(`${imagePath}.background/settings.json`, JSON.stringify(object, null, 2));
}

ImageLibrary.prototype.process = function(image) {
    return new Promise(async (resolve, reject) => {
        try {
            var start = new Date().getTime();
            var file = image.file;
            var outputFolder = `${this.root}/${file}.background`;

            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }
        
            console.log(`${file}: original`);
            try {
                await sharp(`${this.root}/${file}`).rotate().toFile(`${outputFolder}/original.jpg`);
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
                    fs.renameSync(`${this.root}/${file}`, `${this.root}/${file}.failed`);
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

ImageLibrary.prototype.exportImage = async function(element, imagePath) {
    var htmlFile = `${path.dirname(imagePath)}/.${path.basename(imagePath)}.html`;
    var filename = path.basename(imagePath).split('.')[0];
    var exportFile = `${path.dirname(imagePath)}/${filename}_export.png`;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: true
    });
    const page = await browser.newPage();
    page.setViewport({width:3000, height: 3000});
    const css = [...document.styleSheets]
        .map(styleSheet => [...styleSheet.cssRules].map(rule => rule.cssText).join('\n'))
        .filter(Boolean)
        .join('\n');
    const html = `<style>${css}
    img { image-orientation: none }
    </style><body class="w-full h-full">${element.innerHTML}</body>`;
    fs.writeFileSync(htmlFile, html);
    await page.goto(`file://${htmlFile}`);
    await page.screenshot({path: exportFile,  type: "png"});
    await browser.close();

    shell.showItemInFolder(exportFile);
}


module.exports = ImageLibrary;