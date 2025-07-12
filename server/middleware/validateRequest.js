const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body
            if (schema.body) {
                const { error } = schema.body.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        status: 400,
                        message: 'Invalid request body',
                        errors: error.details.map(err => ({
                            field: err.context.key,
                            message: err.message
                        }))
                    });
                }
            }

            // Validate request params
            if (schema.params) {
                const { error } = schema.params.validate(req.params);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        status: 400,
                        message: 'Invalid request parameters',
                        errors: error.details.map(err => ({
                            field: err.context.key,
                            message: err.message
                        }))
                    });
                }
            }

            // Validate request query
            if (schema.query) {
                const { error } = schema.query.validate(req.query);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        status: 400,
                        message: 'Invalid request query',
                        errors: error.details.map(err => ({
                            field: err.context.key,
                            message: err.message
                        }))
                    });
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validateRequest;
