import express from "express"
import crypto from "node:crypto"
import path from "node:path"
import fs from "node:fs"
import multer from "multer"

const app = express()
const PORT = 3000

app.use(express.static("./public"));
app.use(express.static("./uploads"))
app.use(express.static("./public", {
    extensions: ["html"]
}))

const uploadDir = "./uploads"
fs.mkdirSync(uploadDir, { recursive: true })


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const picId = crypto.randomUUID()
        const ext = path.extname(file.originalname).toLowerCase()

        cb(null, `${Date.now()}-${picId}${ext}`)
    }
})


/* const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
}); */

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype);

        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            cb(new Error("Nur JPEG und PNG Dateien sind erlaubt!"), false);
        } else {
            cb(null, true);
        }
    }
});

app.post("/upload", upload.single("pic"), (req, res) => {
    if (!req.file) {
        res.sendStatus(400).json({ error: "Keine Datei empfangen!" })
    }
    res.json({
        message: "Upload in deine Gallerie erfolgreich!",
        titel: req.body.titel,
        fotoname: req.file.originalname,
        gespeichertals: req.file.filename,
        groesse: req.file.size,
        typ: req.file.mimetype
    })
})

app.get("/uploads", (req, res) => {
    const bilder = fs.readdirSync(uploadDir)
    res.json(bilder)
})
app.listen(PORT, () => console.log(`Server läuft auf Post: ${PORT}`))

