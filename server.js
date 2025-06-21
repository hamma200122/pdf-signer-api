const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

const app = express();
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("🖋️ PDF Signer API is running!");
});

app.post("/sign-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText("Signed by Elmehdi", {
      x: 50,
      y: 50,
      size: 18,
      color: rgb(0, 0, 0),
    });

    const signedPdfBytes = await pdfDoc.save();
    fs.unlinkSync(req.file.path);

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(signedPdfBytes));
  } catch (err) {
    console.error("❌ Error signing PDF:", err);
    res.status(500).send("Failed to sign PDF");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
