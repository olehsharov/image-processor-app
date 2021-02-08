// ImageLibrary.prototype.orientation = async function(file) {
// }

import { collection } from "../../server/services/default_settings";

// ImageLibrary.prototype.get = async function(imageId) {
//     return await (await fetch(`/images/${imageId}`)).json();
// }

// ImageLibrary.prototype.saveSettings  = async function(imageId, settings) {
//     await fetch(`/images/${imageId}`, { 
//         method: "post", 
//         headers: { "Content-type" : "application/json" },
//         body: JSON.stringify(settings)
//     });
// }

// ImageLibrary.prototype.exportImage = async function(imageId) {
//     return await fetch(`/images/export/${imageId}`);
// }


export default new class ImageLibrary {
    constructor() {
        this.url = "/";
    }
    async listLibraries() {
        return await (await fetch("/api/libraries")).json();
    }
    async listDir(location, path) {
        return await (await fetch(`/api/${location}/${path}`)).json();
    }
    async listImages(library) {
        return await (await fetch(`/api/libraries/${library}/images`)).json();
    }
    async progress(library) {
        return await (await fetch(`/api/libraries/${library}/importprogress`)).json();
    }
    async isEmpty(library) {
        return await (await fetch(`/api/libraries/${library}/images/isempty`)).json();
    }
    async saveCollection(library, collection, files) {
        await (await fetch(`/api/libraries/${library}/collections`, {
            method: 'post',
            headers: { "Content-type" : "application/json" },
            body: JSON.stringify({ 
                collection: collection, 
                files: files
            })
        }));
    }
    async importFolder(library, path) {
        return await (await fetch(`/api/import/${path}`, {
            method: 'post',
            headers: { "Content-type" : "application/json" },
            body: JSON.stringify({ library: library })
        })).json();
    }
    async createLibrary(name) {
        return await (await fetch("/api/libraries", {
            method: 'post',
            headers: { "Content-type" : "application/json" },
            body: JSON.stringify({ name: name })
        })).json();
    }
};