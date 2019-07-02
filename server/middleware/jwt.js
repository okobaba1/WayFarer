import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
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
    if (decoded.is_admin != true) {
      return res.status(401).json({
        status: 401,
        error: 'Not authorized to perform this operation',
      });
    }
  });
  next();
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
    if (decoded.is_admin == Boolean(true)) {
      return res.status(401).json({
        status: 401,
        error: 'Not authorized to perform this operation',
      });
    }
    req.user = decoded;
  });
  return next();
};

export const verifySuperAdmin = (req, res, next) => {
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
    if (decoded.email !== 'victoradmin@wayfarer.com') {
      return res.status(401).json({
        status: 401,
        error: 'Not authorized to perform this operation',
      });
    }
  });
  next();
};
