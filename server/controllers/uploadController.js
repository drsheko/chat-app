const multer = require("multer");
const {
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} = require("firebase/storage");
const storage = require("../firebase");

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

exports.uploadPhotoMsg = [
    upload.single("photoMsg"),
    async(req,res) => {
        var uploadedFileURL
        const file = req.file;
        const fileName = file.originalname+new Date()
      const imageRef = ref(storage, fileName);
      const metatype = { contentType: file.mimetype, name: file.originalname };
      await uploadBytes(imageRef, file.buffer, metatype)
        .then((snapshot) => {
         uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
            return res.status(200).json({URL:uploadedFileURL})
        })
        .catch((error) => console.log(error.message));
    }
]

