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
  user_email,
  resiNumber
) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hehebimbi009@gmail.com', // Ganti dengan email pengirim
        pass: 'kjdd kvps yfve wely', // Ganti dengan password email pengirim
      },
    });

    // Konten email
    let mailOptions = {
      from: 'hehebimbi009@gmail.com',
      to: user_email,
      subject: "Your Order has been Shipped",
      text: `Dear Customer,\n\nYour order is being prepared. Tracking number: ${resiNumber}\n\nBest Regards, Oyaco`,
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

