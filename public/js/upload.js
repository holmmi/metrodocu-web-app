'use strict';

 const getBase64EncodedString = (file) => {
    return new Promise((resolve, reject) => {
           const fileReader = new FileReader();
           fileReader.readAsDataURL(file);
           fileReader.addEventListener("load", () => {
               resolve(fileReader.result.split(",")[1]);
           });
           fileReader.addEventListener("error", () => {
               reject(fileReader.error);
           });
    });
}

class FileUpload {
    constructor(allowedFileTypes, maxFiles) {
        this.allowedFileTypes = allowedFileTypes;
        this.maxFiles = maxFiles;
        this.files = [];
    }

    async addFiles(items) {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                    const file = items[i].getAsFile();
                    const allowed = this.allowedFileTypes.some(allowedFileType => allowedFileType === file.type)
                    if (allowed && this.files.length < this.maxFiles) {
                        try {
                            this.files.push({name: file.name, type: file.type, content: await getBase64EncodedString(file)});
                            if (typeof addFileToSection === "function") {
                                addFileToSection(file);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        }
    }

    async addFilesFromSelection(items) {
        for (let i = 0; i < items.length; i++) {
            const file = items[i];
            const allowed = this.allowedFileTypes.some(allowedFileType => allowedFileType === file.type)
            if (allowed && this.files.length < this.maxFiles) {
                try {
                    this.files.push({name: file.name, type: file.type, content: await getBase64EncodedString(file)});
                    if (typeof addFileToSection === "function") {
                        addFileToSection(file);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    removeFile(index) {
        this.files.splice(index, 1);
    }

    getFiles() {
        return [...this.files];
    }
}