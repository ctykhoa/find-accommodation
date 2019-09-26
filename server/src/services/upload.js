/*
 * @Author: Khoayenn 
 * @Date: 2019-08-13 00:00:12 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-24 01:48:25
 */
const multer = require("multer");
const isImage = require("is-image")
const fs = require("fs");
const Boom = require("@hapi/boom")
const CustomResponse = require("../commons/response");
const CustomError = require("../commons/error")
const message = require("../constant").message;

async function getPhotoPath(req) {
    try {
        if ((!req.file && !req.files)) {
            return null;
        }
        const processedFile = req.file || req.files || {};
        if (Array.isArray(processedFile)) {
            const path = []
            for (var i = 0; i < processedFile.length; i++) {
                let originalName = processedFile[i].originalname || '';
                originalName = originalName.trim().replace(/ /g, "-")
                let fullPathInServ = processedFile[i].path;
                let newFullPath = `${fullPathInServ}-${originalName}`;
                fs.renameSync(fullPathInServ, newFullPath);
                // Kiem tra format cua file up len
                if (!isImage(newFullPath)) {
                    const wrongImageFormat = Boom.badData(message.wrongImageFormat).output;
                    throw new CustomError({
                        statusCode: wrongImageFormat.statusCode,
                        error: wrongImageFormat.payload
                    });
                }
                path.push(newFullPath.slice(7));
            }

            return path;
        } else {
            let originalName = processedFile.originalname || '';
            originalName = originalName.trim().replace(/ /g, "-")
            let fullPathInServ = processedFile.path;
            let newFullPath = `${fullPathInServ}-${originalName}`;

            // Kiem tra format cua file up len
            if (!isImage(newFullPath)) {
                const wrongImageFormat = Boom.badData(message.wrongImageFormat).output;
                throw new CustomError({
                    statusCode: wrongImageFormat.statusCode,
                    error: wrongImageFormat.payload
                });
            }

            fs.renameSync(fullPathInServ, newFullPath);
            let path =newFullPath.slice(7);
            return path;
        }

    } catch (error) {
        throw error;
    }
}
//tham khao
/*https://medium.com/@superjunior.dev/nodejs-expressjs-multer-reactjs-upload-file-t%E1%BB%AB-reactjs-app-l%C3%AAn-api-t%E1%BA%A1o-b%E1%BB%9Fi-expressjs-dd0a4fb2b32c */

const upload = function(des){
    return multer({dest: des});
}

const uploadAvatar = upload("images/avatar").single("avatar");
const uploadPhotos = upload("images/room").array("images");

module.exports = {
    getPhotoPath,
    uploadPhotos,
    uploadAvatar
}