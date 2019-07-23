import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      error: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to Authenticate token',
      });
    }
    req.user = decoded;
  });
  if (req.user.is_admin != Boolean(true)) {
    return res.status(401).json({
      status: 'error',
      error: 'Not authorized to perform this operation',
    });
  }
  return next();
};

export const verifyUser = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      error: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to Authenticate token',
      });
    }   
    req.user = decoded;
  });
  if (req.user.is_admin == Boolean(true)) {
    return res.status(401).json({
      status: 'error',
      error: 'Not authorized to perform this operation',
    });
  }
  return next();
};

export const verifyHelp = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      status: 'error',
      error: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        error: 'Failed to Authenticate token',
      });
    }
    req.user = decoded;
  });
  return next();
};
