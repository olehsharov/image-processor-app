function ImageLibrary() {
    this.url = "/";
}

ImageLibrary.prototype.list = async function(folder) {
    return await (await fetch("/images")).json();
}

ImageLibrary.prototype.orientation = async function(file) {
}

ImageLibrary.prototype.get = async function(imageId) {
    return await (await fetch(`/images/${imageId}`)).json();
}

ImageLibrary.prototype.saveSettings  = function(imagePath, settings) {
}

ImageLibrary.prototype.exportImage = async function(imageId) {
    return await fetch(`/images/export/${imageId}`);
}


export default new ImageLibrary();