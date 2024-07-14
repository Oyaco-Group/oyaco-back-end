const nodeMailer = require("nodemailer");

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

const sendEmailToBuyer = async (
  admin_email,
  admin_email_password,
  user_email,
  resiNumber
) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: admin_email, // Ganti dengan email pengirim
        pass: admin_email_password, // Ganti dengan password email pengirim
      },
    });

    // Konten email
    let mailOptions = {
      from: admin_email,
      to: user_email,
      subject: "Your Order has been Shipped",
      text: `Dear Customer,\n\nYour order has been shipped. Tracking number: ${resiNumber}\n\nBest Regards,\n${admin_email}`,
    };

    // Kirim email
    let info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    console.log("Email sent successfully");
    return info.messageId
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = { generateResiNumber, sendEmailToBuyer };

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
