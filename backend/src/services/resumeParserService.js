const path = require('path');

const parsePDF = require(
  '../parsers/pdfParser'
);

const parseDOCX = require(
  '../parsers/docxParser'
);

const extractResumeText = async (
  filePath
) => {
  const ext = path.extname(filePath);

  if (ext === '.pdf') {
    return await parsePDF(filePath);
  }

  if (ext === '.docx') {
    return await parseDOCX(filePath);
  }

  throw new Error(
    'Unsupported file type'
  );
};

module.exports = {
  extractResumeText,
};