import * as XLSX from 'xlsx';
import { ToolController, createDownload } from './uploader.js';

export default function setupExcelToCsv() {
  return new ToolController({
    uid: 'excel2csv',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      status('Parsing workbook…');
      progress(25);
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      progress(60);
      const outputs = [];
      for (const sheetName of wb.SheetNames) {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
        const safe = sheetName.replace(/[^\w-]+/g, '_') || 'sheet';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        outputs.push(createDownload(blob, `${file.name.replace(/\.(xlsx|xls)$/i, '')}-${safe}.csv`));
      }
      progress(100);
      return outputs;
    },
  });
}