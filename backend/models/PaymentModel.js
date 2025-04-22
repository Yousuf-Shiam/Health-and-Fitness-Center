const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Function to generate a receipt PDF
const generateReceipt = (bookingId, clientName, serviceName, amount, res) => {
    const doc = new PDFDocument();

    // Define the file path for the PDF
    const filePath = path.join(__dirname, `receipt-${bookingId}.pdf`);

    // Pipe the PDF to a writable stream
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(20).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${bookingId}`);
    doc.text(`Client Name: ${clientName}`);
    doc.text(`Service Name: ${serviceName}`);
    doc.text(`Amount to Pay: $${amount}`);
    doc.moveDown();
    doc.text('Thank you for your payment!', { align: 'center' });

    // Finalize the PDF
    doc.end();

    // Wait for the file to be written, then send it as a response
    writeStream.on('finish', () => {
        console.log('PDF generated successfully');
        res.download(filePath, `receipt-${bookingId}.pdf`, (err) => {
            if (err) {
                console.error('Error sending the file:', err);
                res.status(500).send('Error generating receipt');
            }
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting the file:', unlinkErr);
            });
        });
    });
};

module.exports = { generateReceipt };