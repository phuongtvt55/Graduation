const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'asset');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory: ' + err);
    }

    let imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    imageFiles.forEach((file, index) => {
        const currentPath = path.join(directoryPath, file);
        const newFileName = `${index + 1}${path.extname(file)}`;
        const newPath = path.join(directoryPath, newFileName);

        fs.rename(currentPath, newPath, err => {
            if (err) {
                console.error(`Error renaming file ${file}: `, err);
            } else {
                console.log(`Renamed ${file} to ${newFileName}`);
            }
        });
    });
});
