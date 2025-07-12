const { authMiddleware } = require('./authMiddleware');

// Admin middleware
const adminMiddleware = async (req, res, next) => {
    try {
        // First authenticate user
        await authMiddleware(req, res, () => {});

        // Check if user is admin
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

// Super admin middleware (for critical operations)
const superAdminMiddleware = async (req, res, next) => {
    try {
        await adminMiddleware(req, res, () => {});
        
        // Check if user has super admin role (e.g., 'super_admin')
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Super admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = {
    adminMiddleware,
    superAdminMiddleware
};
