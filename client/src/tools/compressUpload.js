const resizePhoto= async(file) => {
    if (!file.type.startsWith('image')) {
        return file
    }
    const compressedFile = await compressImage(file, {
        quality: 0.5,
        type: 'image/jpeg',
    });
    compressedFile.name=file.name;
   
    return compressedFile
}

const compressImage = async (file, { quality = 1, type = file.type }) => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);

    return await new Promise((resolve) =>
        canvas.toBlob(resolve, type, quality)
    );
};

export default resizePhoto;