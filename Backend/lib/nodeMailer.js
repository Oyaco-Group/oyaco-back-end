const nodeMailer = require('nodemailer')

// admin generate nomor resi
const generateResiNumber = (order) => {
  const orderId = order.id;
  const userId = order.user_id;
  const createdAt = order.created_at;

  const formattedDate = `${createdAt.getFullYear()}${padNumber(
    createdAt.getMonth() + 1
  )}${padNumber(createdAt.getDate())}`;

  const resiNumber = `R-${orderId}-${userId}-${formattedDate}`;

  return resiNumber;
};

const padNumber = (num) => {
  return num.toString().padStart(2, "0");
};

// user get email and no resi
// Fungsi untuk mengirim email kepada pembeli
const sendEmailToBuyer = async (emailAdmin, emailUser, resi) => {
  try {
    // Konfigurasi transporter untuk mengirim email menggunakan SMTP
    let transporter = nodeMailer.createTransport({
      host: emailAdmin, // Ganti dengan host SMTP yang sesuai
      port: 587,
      secure: false, // true untuk menggunakan TLS; false untuk plain SMTP
      auth: {
        user: emailAdmin, // Ganti dengan email pengirim
        pass: emailAdmin, // Ganti dengan password email pengirim
      },
    });

    // Konten email
    let mailOptions = {
      from: emailAdmin,
      to: emailUser,
      subject: "Your Order has been Shipped",
      text: `Dear Customer,\n\nYour order has been shipped. Tracking number: ${resi}\n\nBest Regards,\n${emailAdmin}`,
    };

    // Kirim email
    let info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = {generateResiNumber, sendEmailToBuyer};

// Contoh penggunaan:
// const order = {
//   id: 1001,
//   user_id: 123,
//   created_at: new Date("2024-07-13T10:00:00Z"),
// };

// const resiNumber = generateResiNumber(order);
// const emailAdmin = "admin@example.com";
// const emailUser = "user@example.com";

// // Mengirim email kepada pembeli
// sendEmailToBuyer(emailAdmin, emailUser, resiNumber);
