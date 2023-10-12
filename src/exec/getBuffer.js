const Jimp = require("jimp");
const sizeOf = require("image-size");
const fetch = require("node-fetch"); // Import the 'node-fetch' module

async function getBuffer(imgUrl) {
  try {
    // Fetch the image from the URL
    const response = await fetch(imgUrl);

    if (!response.ok) {
      return 400; // Handle the error accordingly
    }

    // Read the response body as an ArrayBuffer
    const buffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a Buffer (Node.js Buffer)
    const nodeBuffer = Buffer.from(buffer);

    // Determine the image's file type
    const dimensions = sizeOf(nodeBuffer);
    const fileType = dimensions.type.toLowerCase();

    // Check if the file type is one of the allowed types
    const allowedTypes = ["gif", "bmp", "png", "tiff", "jpeg"];
    if (!allowedTypes.includes(fileType)) {
      return 401; // Handle the unsupported file type accordingly
    }

    const image = await Jimp.read(nodeBuffer);

    let convertedBuffer;
    switch (fileType) {
      //   case "gif":
      //     convertedBuffer = await image.getBufferAsync(Jimp.MIME_GIF);
      //     break;
      //   case "bmp":
      //     convertedBuffer = await image.getBufferAsync(Jimp.MIME_BMP);
      //     break;
      //   case "tiff":
      //     convertedBuffer = await image.getBufferAsync(Jimp.MIME_TIFF);
      //     break;

      case "png":
        convertedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        break;
      case "jpeg":
        convertedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        break;
    }

    return {
      buffer: convertedBuffer.toString("base64"),
      fileType: fileType,
    };
  } catch (error) {
    console.error(error.message);
    return 500; // Handle other errors accordingly
  }
}

module.exports = {
  getBuffer: getBuffer,
};
