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

module.exports = generateResiNumber;

// user get email and no resi
