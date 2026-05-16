const fs = require('fs');
const path = require('path');

async function testPdfParse() {
  try {
    const { PDFParse } = require('pdf-parse');
    const filePath = path.join(__dirname, '../src/uploads/1778857724382.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    console.log('Parsed text length:', result.text.length);
    console.log('Sample text:', result.text.substring(0, 100));
    await parser.destroy();
    console.log('PDF parsed successfully');
  } catch (err) {
    console.error('Error loading pdf-parse:', err.message);
  }
}

testPdfParse();
