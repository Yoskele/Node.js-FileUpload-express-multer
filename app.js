const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        //cb is callback
        // fieldname comes from the <input name="myImage" type="file"> myImage /// file.originalname gives the Jpg or png looks whats end of the file.
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    // the value comes from the import diskStorage.
    storage:storage,
    limits : {fileSize:100000}, // The file cant be bigger then 10 bits.
    fileFilter: function(req, file, cb){
        // function we call checkFileTyp come from belove.
        checkFileType(file,cb);
    }
}).single('myImage'); // this is due to that we upload a singel file.

// Check File Type.
function checkFileType(file, cb){
    // allow ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    // check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true)
    } else {
        cb('Error: Images Only')
    }
}

// Init app
const app = express();

app.set('view engine', 'ejs');

//Public folder for images.
app.use(express.static('./public'));

app.get('/', (req,res) => res.render('index'));

app.post('/upload', (req,res) => {
    // call the upload const from above.
    upload(req,res, (err) =>{
        if(err){
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file == undefined ){
                res.render('index', {
                    msg: 'No file selected'
                });
            } else {
                res.render('index', {
                    msg : 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`'Server started on port ${port}`)
})