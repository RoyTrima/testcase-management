import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const user = jwt.verify(token, 'secretkey');
    req.user = user; // contains {id, username}
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
