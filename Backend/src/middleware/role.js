/**
 * Authorize route access based on user roles.
 * @param {...string} roles - Permitted roles (e.g. 'delivery_partner', 'technician', 'executive')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { authorize };
