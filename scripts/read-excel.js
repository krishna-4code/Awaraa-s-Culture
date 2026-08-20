const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();
const filePath = path.join(__dirname, '..', 'awaraas-culture-inventory-filled.xlsx');

workbook.xlsx.readFile(filePath).then(() => {
  workbook.eachSheet((sheet) => {
    console.log('=== Sheet:', sheet.name, '===');
    sheet.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`, JSON.stringify(row.values));
    });
  });
}).catch(err => console.error('Error reading excel:', err));
