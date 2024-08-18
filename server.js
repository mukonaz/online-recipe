const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/upload', upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

 
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});


// json-server --watch db.json --port 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
