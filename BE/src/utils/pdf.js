import htmlToPdf from "html-pdf-node";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const convertHtmlToPdf = async (content) => {
    let options = { format: 'A4' };
    let file = { content };

    // Lấy đường dẫn tuyệt đối của file hiện tại
    const __filename = fileURLToPath(import.meta.url);

    // Lấy đường dẫn của thư mục chứa file hiện tại
    const __dirname = path.dirname(__filename);
    const rootPath = path.resolve(__dirname, '../../');

    const pdfBuffer = await htmlToPdf.generatePdf(file, options);

    const outputFile = `${rootPath}/files/output.pdf`;
    fs.writeFileSync(outputFile, pdfBuffer);

    return outputFile;
}

export default convertHtmlToPdf;