const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Look for the token in the request headers
  const token = req.header('Authorization');
  
  // If there is no token, reject the request immediately
  if (!token) {
    return res.status(401).json({ error: 'Access Denied. Please log in.' });
  }

  try {
    // Remove 'Bearer ' prefix if it exists and verify the token
    const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'swiftcourier_super_secret_key');
    
    // Attach the verified user details to the request
    req.user = verified; 
    
    // Move on to the actual route function
    next(); 
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};