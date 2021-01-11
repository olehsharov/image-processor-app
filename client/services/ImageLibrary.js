function ImageLibrary() {
    this.url = "/";
}

ImageLibrary.prototype.list = async function(folder) {
    return await (await fetch("/images")).json();
}

ImageLibrary.prototype.orientation = async function(file) {
}

ImageLibrary.prototype.get = async function(imagePath) {
}

ImageLibrary.prototype.saveSettings  = function(imagePath, settings) {
}

ImageLibrary.prototype.exportImage = async function(element, imagePath) {
}


export default new ImageLibrary();