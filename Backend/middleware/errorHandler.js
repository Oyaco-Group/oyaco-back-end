const errorHandler = async (error, req, res, next) => {

  console.log(error);

  if (error.name === 'notFound') {
    res.status(404).json({ message: error.message });
  }else if (error.name === 'exist'){
    res.status(400).json({ message: error.message });
  }else if (error.name === 'invalidCredentials'){
    res.status(401).json({ message: error.message });
  }else if (error.name === 'unAuthenticated'){
    res.status(401).json({ message: error.message });
  }else if (error.name === 'unAuthorized'){
    res.status(403).json({ message: error.message });
  }else if (error.name === 'invalidInput'){
    res.status(400).json({ message: error.message });
  }else if (error.name === 'failedToCreate'){
    res.status(400).json({ message: error.message });
  }else if (error.name === 'failedToUpdate'){
    res.status(400).json({ message: error.message });
  }else if (error.name === 'failedToDelete'){
    res.status(400).json({ message: error.message });
  }else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = errorHandler;
