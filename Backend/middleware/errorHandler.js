const errorHandler = async (error, req, res, next) => {
  let errorMassage = "";

  console.log(error);

  switch (error.name) {
    // Auth Error Handler
    case "Unauthicated":
      errorMassage = "User Not Authenticated";
      res.status(402).json({ error: errorMassage });
      break;

    case "InvalidCredentials":
      errorMassage = "Invalid Credentials";
      res.status(402).json({ error: errorMassage });
      break;
    
    // User Error Handler
    // Admin Eror Handler
    
    default:
      errorMassage = "Internal Server Error";
      res.status(500).json({ error: errorMassage });
      break;
  }
};

module.exports = errorHandler;
