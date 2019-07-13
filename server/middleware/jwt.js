import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const tokenBearer = req.headers.authorization;
  const token = tokenBearer.slice(7, tokenBearer.length);
  if (!token) {
    return res.status(402).json({
      status: 402,
      error: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        error: 'Failed to Authenticate token',
      });
    }
    req.user = decoded;
  });
  if (req.user.is_admin != Boolean(true)) {
    return res.status(401).json({
      status: 401,
      error: 'Not authorized to perform this operation',
    });
  }
  return next();
};

export const verifyUser = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        error: 'Failed to Authenticate token',
      });
    }   
    req.user = decoded;
  });
  if (req.user.is_admin == Boolean(true)) {
    return res.status(401).json({
      status: 401,
      error: 'Not authorized to perform this operation',
    });
  }
  return next();
};

export const verifyHelp = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'No token provided.',
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        error: 'Failed to Authenticate token',
      });
    }
    req.user = decoded;
  });
  return next();
};
