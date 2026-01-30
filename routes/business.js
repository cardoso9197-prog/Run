// Backend: Business Accounts & Invoice Routes
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'info@runrungb.com',
    pass: process.env.EMAIL_PASS || 'your-email-password'
  }
});

// Create business account
router.post('/business-accounts', authenticateToken, async (req, res) => {
  try {
    const passengerId = req.user.id;
    const {
      company_name,
      tax_id,
      company_address,
      company_phone,
      company_email,
      business_type,
      invoice_email
    } = req.body;

    const result = await db.query(
      `INSERT INTO business_accounts 
       (passenger_id, company_name, tax_id, company_address, company_phone, company_email, business_type, invoice_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [passengerId, company_name, tax_id, company_address, company_phone, company_email, business_type, invoice_email]
    );

    res.json({
      success: true,
      message: 'Business account created successfully',
      businessAccount: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating business account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create business account',
      error: error.message
    });
  }
});

// Get business account by passenger ID
router.get('/business-accounts/my-account', authenticateToken, async (req, res) => {
  try {
    const passengerId = req.user.id;
    
    const result = await db.query(
      'SELECT * FROM business_accounts WHERE passenger_id = $1',
      [passengerId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        hasBusinessAccount: false,
        businessAccount: null
      });
    }

    res.json({
      success: true,
      hasBusinessAccount: true,
      businessAccount: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching business account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business account'
    });
  }
});

// Update business account
router.put('/business-accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const passengerId = req.user.id;
    const {
      company_name,
      tax_id,
      company_address,
      company_phone,
      company_email,
      business_type,
      invoice_email
    } = req.body;

    const result = await db.query(
      `UPDATE business_accounts 
       SET company_name = $1, tax_id = $2, company_address = $3, 
           company_phone = $4, company_email = $5, business_type = $6, invoice_email = $7
       WHERE id = $8 AND passenger_id = $9
       RETURNING *`,
      [company_name, tax_id, company_address, company_phone, company_email, business_type, invoice_email, id, passengerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business account not found'
      });
    }

    res.json({
      success: true,
      message: 'Business account updated successfully',
      businessAccount: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating business account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business account'
    });
  }
});

// Generate invoice for completed ride
router.post('/invoices/generate/:rideId', authenticateToken, async (req, res) => {
  try {
    const { rideId } = req.params;
    const passengerId = req.user.id;

    // Get ride details
    const rideResult = await db.query(
      `SELECT r.*, p.name as passenger_name, p.email as passenger_email,
              d.name as driver_name, d.phone as driver_phone
       FROM rides r
       JOIN passengers p ON r.passenger_id = p.id
       JOIN drivers d ON r.driver_id = d.id
       WHERE r.id = $1 AND r.passenger_id = $2 AND r.status = 'completed'`,
      [rideId, passengerId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Completed ride not found'
      });
    }

    const ride = rideResult.rows[0];

    // Get business account
    const businessResult = await db.query(
      'SELECT * FROM business_accounts WHERE passenger_id = $1 AND is_active = true',
      [passengerId]
    );

    if (businessResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active business account found. Please create a business account first.'
      });
    }

    const businessAccount = businessResult.rows[0];

    // Check if invoice already exists
    const existingInvoice = await db.query(
      'SELECT * FROM invoices WHERE ride_id = $1',
      [rideId]
    );

    if (existingInvoice.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Invoice already exists',
        invoice: existingInvoice.rows[0]
      });
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${rideId}`;

    // Calculate totals
    const subtotal = parseFloat(ride.final_fare || ride.fare_estimate);
    const taxRate = 0.00; // Update if you have tax
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const invoiceResult = await db.query(
      `INSERT INTO invoices 
       (invoice_number, business_account_id, ride_id, passenger_id, driver_id,
        pickup_address, dropoff_address, trip_date, distance_km,
        subtotal, tax_rate, tax_amount, total_amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'issued')
       RETURNING *`,
      [
        invoiceNumber,
        businessAccount.id,
        rideId,
        passengerId,
        ride.driver_id,
        ride.pickup_address,
        ride.dropoff_address,
        ride.created_at,
        5.0, // You can calculate actual distance
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        ride.payment_method || 'card'
      ]
    );

    const invoice = invoiceResult.rows[0];

    // Add invoice items
    await db.query(
      `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        invoice.id,
        `Ride from ${ride.pickup_address} to ${ride.dropoff_address}`,
        1,
        subtotal,
        subtotal
      ]
    );

    // Generate PDF (returns Base64 string)
    const pdfBase64 = await generateInvoicePDF(invoice, businessAccount, ride);
    
    // Update invoice with PDF Base64 in database
    await db.query(
      'UPDATE invoices SET pdf_url = $1, pdf_generated = true WHERE id = $2',
      [pdfBase64, invoice.id]
    );

    // Send email with PDF
    await sendInvoiceEmail(businessAccount.invoice_email, pdfBase64, invoice);

    // Update sent status
    await db.query(
      'UPDATE invoices SET sent_to_email = true, email_sent_at = CURRENT_TIMESTAMP WHERE id = $1',
      [invoice.id]
    );

    res.json({
      success: true,
      message: 'Invoice generated and sent successfully',
      invoice: {
        ...invoice,
        pdf_available: true
      }
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    });
  }
});

// Get all invoices for business account
router.get('/invoices/my-invoices', authenticateToken, async (req, res) => {
  try {
    const passengerId = req.user.id;

    const result = await db.query(
      `SELECT i.*, ba.company_name, r.pickup_address, r.dropoff_address
       FROM invoices i
       JOIN business_accounts ba ON i.business_account_id = ba.id
       JOIN rides r ON i.ride_id = r.id
       WHERE i.passenger_id = $1
       ORDER BY i.issue_date DESC`,
      [passengerId]
    );

    res.json({
      success: true,
      invoices: result.rows
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
});

// Download invoice PDF
router.get('/invoices/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const passengerId = req.user.id;

    const result = await db.query(
      'SELECT * FROM invoices WHERE id = $1 AND passenger_id = $2',
      [id, passengerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const invoice = result.rows[0];

    if (!invoice.pdf_url || !invoice.pdf_generated) {
      return res.status(404).json({
        success: false,
        message: 'PDF not generated yet'
      });
    }

    // Convert Base64 back to PDF buffer
    const pdfBuffer = Buffer.from(invoice.pdf_url, 'base64');

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoice.invoice_number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download invoice'
    });
  }
});

// Helper: Generate PDF and return Base64 string (for database storage)
async function generateInvoicePDF(invoice, businessAccount, ride) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      // Collect PDF data in memory
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const base64PDF = pdfBuffer.toString('base64');
        resolve(base64PDF);
      });
      doc.on('error', (error) => reject(error));

      // Header
      doc.fontSize(20).text('RUN-RUN GUINÉ-BISSAU', { align: 'center' });
      doc.fontSize(10).text('Fatura Eletrónica / Electronic Invoice', { align: 'center' });
      doc.moveDown();

      // Invoice details
      doc.fontSize(12).text(`Fatura Nº: ${invoice.invoice_number}`);
      doc.text(`Data de Emissão: ${new Date(invoice.issue_date).toLocaleDateString('pt-PT')}`);
      doc.moveDown();

      // Company details
      doc.fontSize(14).text('Dados da Empresa / Company Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Empresa: ${businessAccount.company_name}`);
      if (businessAccount.tax_id) doc.text(`NIF/Tax ID: ${businessAccount.tax_id}`);
      if (businessAccount.company_address) doc.text(`Morada: ${businessAccount.company_address}`);
      if (businessAccount.company_phone) doc.text(`Telefone: ${businessAccount.company_phone}`);
      if (businessAccount.company_email) doc.text(`Email: ${businessAccount.company_email}`);
      doc.moveDown();

      // Trip details
      doc.fontSize(14).text('Detalhes da Viagem / Trip Details:', { underline: true });
      doc.fontSize(10);
      doc.text(`Data da Viagem: ${new Date(invoice.trip_date).toLocaleString('pt-PT')}`);
      doc.text(`Origem: ${invoice.pickup_address}`);
      doc.text(`Destino: ${invoice.dropoff_address}`);
      doc.text(`Motorista: ${ride.driver_name}`);
      doc.text(`Método de Pagamento: ${invoice.payment_method}`);
      doc.moveDown();

      // Items table
      doc.fontSize(14).text('Itens / Items:', { underline: true });
      doc.fontSize(10);
      doc.text('─'.repeat(70));
      doc.text(`Descrição: Viagem de transporte`);
      doc.text(`Valor Base: ${invoice.subtotal} XOF`);
      if (invoice.tax_amount > 0) {
        doc.text(`Taxa (${invoice.tax_rate}%): ${invoice.tax_amount} XOF`);
      }
      doc.text('─'.repeat(70));
      doc.fontSize(12).text(`TOTAL: ${invoice.total_amount} XOF`, { bold: true });
      doc.moveDown();

      // Footer
      doc.fontSize(8).text('Run-Run Guiné-Bissau | info@runrungb.com | +245 955 981 398', { align: 'center' });
      doc.text('© 2026 KCDIGITALS. Todos os Direitos Reservados.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper: Send invoice email (pdfBase64 is Base64 string)
async function sendInvoiceEmail(email, pdfBase64, invoice) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'info@runrungb.com',
    to: email,
    subject: `Fatura Run-Run Nº ${invoice.invoice_number}`,
    html: `
      <h2>Fatura Eletrónica Run-Run</h2>
      <p>Estimado Cliente,</p>
      <p>Segue em anexo a fatura da sua viagem:</p>
      <ul>
        <li><strong>Fatura Nº:</strong> ${invoice.invoice_number}</li>
        <li><strong>Data:</strong> ${new Date(invoice.issue_date).toLocaleDateString('pt-PT')}</li>
        <li><strong>Valor Total:</strong> ${invoice.total_amount} XOF</li>
      </ul>
      <p>Obrigado por utilizar Run-Run!</p>
      <br>
      <p>Run-Run Guiné-Bissau<br>
      Email: info@runrungb.com<br>
      Telefone: +245 955 981 398</p>
    `,
    attachments: [
      {
        filename: `Invoice-${invoice.invoice_number}.pdf`,
        content: Buffer.from(pdfBase64, 'base64'),
        contentType: 'application/pdf'
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

module.exports = router;
