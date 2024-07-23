const nodeMailer = require("nodemailer");

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

const sendEmailToBuyer = async (user_email, resiNumber) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "hehebimbi009@gmail.com",
        pass: "kjdd kvps yfve wely",
      },
    });

    let mailOptions = {
      from: "hehebimbi009@gmail.com",
      to: user_email,
      subject: "Your Order has been Shipped",
      text: `Dear Customer,\n\nYour order is being prepared. Tracking number: ${resiNumber}\n\nBest Regards, Oyaco`,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    console.log("Email sent successfully");
    return info.messageId;
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const sendEmailToAdmin = async (products) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "hehebimbi009@gmail.com",
        pass: "kjdd kvps yfve wely",
      },
    });

    let mailOptions = {
      from: "hehebimbi009@gmail.com",
      to: "ydbimbi1@gmail.com",
      subject: "List of expired product",
      html: `
  <h2>List of Expired Product</h2>
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th style="padding: 8px; text-align: left;">Product Movement ID</th>
        <th style="padding: 8px; text-align: left;">Master Product ID</th>
        <th style="padding: 8px; text-align: left;">Inventory ID</th>
        <th style="padding: 8px; text-align: left;">Quantity</th>
        <th style="padding: 8px; text-align: left;">Expiration Date</th>
      </tr>
    </thead>
    <tbody>
      ${products
        .map(
          (product) => `
        <tr>
          <td style="padding: 8px; text-align: left;">${product.id}</td>
          <td style="padding: 8px; text-align: left;">${
            product.master_product_id
          }</td>
          <td style="padding: 8px; text-align: left;">${
            product.inventory_id
          }</td>
          <td style="padding: 8px; text-align: left;">${product.quantity}</td>
          <td style="padding: 8px; text-align: left;">${new Date(
            product.expiration_date
          ).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    console.log("Email sent successfully");
    console.log(info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = { generateResiNumber, sendEmailToBuyer, sendEmailToAdmin };
