import fs from "fs";
import path from "path";
import { fromPath } from "pdf2pic";
import { Options } from "pdf2pic/dist/types/options";
const pdf = require("pdf-page-counter");

type PdfInfo = {
  numpages: number;
  version: number;
};

const pdfToImage = async (folder: string) => {
  const inputPath = path.resolve(
    path.join("bucket", "done", folder, "journal.pdf")
  );

  const outputFolder = path.resolve(path.join("bucket", "website-journal", folder));
  const outputPath = path.resolve(path.join(outputFolder, "journal"));

  if (fs.existsSync(outputFolder)) {
    console.log("Already exist folder. Removing...");
    fs.rmSync(outputFolder, { recursive: true, force: true });
    console.log("Folder removed");
  }

  fs.mkdirSync(outputFolder);
  fs.mkdirSync(outputPath);

  const dataBuffer = fs.readFileSync(inputPath);

  const pdfInfo = (await pdf(dataBuffer)) as PdfInfo;

  const options: Options = {
    quality: 100,
    density: 100,
    saveFilename: "page",
    savePath: outputPath,
    format: "jpeg",
    width: 600,
    height: 600,
  };

  const storeAsImage = fromPath(inputPath, options);

  for (let page = 1; page <= pdfInfo.numpages; page++) {
    const saved = await storeAsImage(page);

    console.log(`${outputPath} - Page ${saved.page} saved`);
  }
};

pdfToImage("copa-do-mundo-estreia-no-brasil-amanha");