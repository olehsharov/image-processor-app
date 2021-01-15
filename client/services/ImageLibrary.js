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

ImageLibrary.prototype.saveSettings  = async function(imageId, settings) {
    await fetch(`/images/${imageId}`, { 
        method: "post", 
        headers: { "Content-type" : "application/json" },
        body: JSON.stringify(settings)
    });
}

ImageLibrary.prototype.exportImage = async function(imageId) {
    return await fetch(`/images/export/${imageId}`);
}


export default new ImageLibrary();