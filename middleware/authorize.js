const authorize = () => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
      }
  
      const requestedUserId = req.params.userId;
      const tokenUserId = req.user.userId; // Assuming user ID is stored in the 'userId' field of the token payload
  
      if (requestedUserId !== tokenUserId.toString()) { // Convert to string for strict comparison
        return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
      }
      
      next();
    };
  };
  
  module.exports = authorize;
  