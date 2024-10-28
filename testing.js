const express = require('express');
const fs = require('fs');
const ImageKit = require('imagekit');

const app = express();
const port = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: 'public_MWTuIIHTk37LZ4YLi+nVIIotqFE=',
    privateKey: 'private_adX4fzWuppMAB1CluzJR7DxM4qE=',
    urlEndpoint: 'https://ik.imagekit.io/apabila'
});

// Route to upload image from local path
app.post('/upload', (req, res) => {
    const filePath = req.body.filePath;

    if (!filePath) {
        return res.status(400).json({ message: 'No file path provided' });
    }

    // Read the file from the local filesystem
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file', error: err.message });
        }

        // Upload to ImageKit
        imagekit.upload({
            file: data, // Use the file data read from the filesystem
            fileName: filePath.split('/').pop() // Extract the file name from the path
        }, (error, result) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.status(200).json({ message: 'File uploaded successfully', url: result.url });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
