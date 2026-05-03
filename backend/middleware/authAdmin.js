const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// authAdmin middleware
// Currently a STUB — passes all requests through.
// Once Group 17 shares their JWT secret, uncomment the block below and
// replace process.env.JWT_SECRET with the agreed value.
// ─────────────────────────────────────────────────────────────────────────────

const authAdmin = (req, res, next) => {
  // ── STUB MODE (no JWT validation yet) ──────────────────────────────────────
  next();

  // ── ACTIVATE THIS when Group 17 shares the JWT secret ─────────────────────
  // const authHeader = req.headers['authorization'];
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: 'No token provided' });
  // }
  // const token = authHeader.split(' ')[1];
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   if (decoded.role !== 'admin') {
  //     return res.status(403).json({ message: 'Access denied: Admins only' });
  //   }
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ message: 'Invalid or expired token' });
  // }
};

module.exports = authAdmin;
