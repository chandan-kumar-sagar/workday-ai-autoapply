const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: dataBuffer,
  });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};

module.exports = parsePDF;