const fs = require('fs/promises');

const deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log('user image was deleted');
    } catch (error) {
        console.error('user image does not exist or could not be deleted');
    }
};

module.exports = deleteImage;

/* const deleteImage = (userImagePath) => {
    fs.access(userImagePath)
        .then(() => fs.unlink(userImagePath))
        .then(() => console.error('user image does not exist'))
        .catch((err) => console.log('user image was deleted'));
}; */
