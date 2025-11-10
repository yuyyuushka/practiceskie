const roles = {
  user: ['read_own_data'],
  admin: ['read_any_data', 'write_any_data', 'delete_any_data']
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = roles[userRole];
    
    if (!userPermissions || !userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied for your role' });
    }
    next();
  };
};

module.exports = { checkPermission, checkRole, roles };