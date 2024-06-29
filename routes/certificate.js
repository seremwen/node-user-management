const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Member = require('../models/Member');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * @swagger
 * /certificates/{certificateNumber}:
 *   get:
 *     summary: Generate and retrieve a PDF certificate
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The certificate number
 *     responses:
 *       200:
 *         description: The PDF certificate
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request
 *       404:
 *         description: Certificate not found
 */
router.get('/:certificateNumber', async (req, res) => {
    try {
        // Find the certificate by certificate number and include associated member details
        const certificate = await Certificate.findOne({
            where: { certificateNumber: req.params.certificateNumber },
            include: [{ model: Member, as: 'member' }],
        });

        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        const { member } = certificate;

        // Create PDF document with A4 size (595.28 points wide x 841.89 points high)
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filePath = path.resolve(`./certificates/${certificate.certificateNumber}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Add content to PDF
        doc.fontSize(20).text('Certificate of Approval', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Name: ${member.name} ${member.surname}`, { align: 'left' });
        doc.text(`Email: ${member.email}`, { align: 'left' });
        doc.text(`Department: ${member.department}`, { align: 'left' });
        doc.text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'left' });

        // Add signature and issue date at bottom left
        const signature = 'Your Signature'; // Replace with actual signature image or text
        const issueDate = new Date().toLocaleDateString(); // Example: Today's date

        // Calculate positions
        const bottomMargin = 50;
        const signatureX = 50;
        const signatureY = doc.page.height - bottomMargin - 70; // Move signature up by 40 points
        const issueDateX = 50; // Adjust based on your layout
        const issueDateY = doc.page.height - bottomMargin - 50; // Move signature up by 40 points
        const qrX = doc.page.width - 150; // Adjust based on your layout
        const rowY = doc.page.height - bottomMargin;

        // Position elements
        doc.fontSize(12).text(`Signature: ${signature}`, signatureX, signatureY, { align: 'left' });
        doc.fontSize(12).text(`Issue Date: ${certificate.issueDate}`, issueDateX, issueDateY, { align: 'left' });

        // Generate QR code at bottom right
        const qrData = certificate.certificateNumber; // Example: Use certificate number as QR data
        const qrOptions = { errorCorrectionLevel: 'H', type: 'image/png', margin: 2, width: 80, height: 80 };
        const qrCodeBuffer = await QRCode.toBuffer(qrData, qrOptions);

        // Position QR code
        doc.image(qrCodeBuffer, qrX, rowY - 80, { width: 80, height: 80 });

        doc.end(); // Close the PDF document

        // Stream the PDF for download
        res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateNumber}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        stream.on('finish', () => {
            res.status(200).download(filePath, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).json({ error: 'Error downloading file' });
                }
                // Delete the file after download if needed
                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Error generating certificate' });
    }
});
module.exports = router;
