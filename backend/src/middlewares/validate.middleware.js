import { ZodError } from 'zod';

/**
 * Middleware factory for validating request data using Zod schemas
 * @param {Object} schema - Zod schema object
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const validated = await schema.parseAsync(dataToValidate);
      
      if (source === 'query') {
        req.validatedQuery = validated;
      } else if (source === 'params') {
        req.validatedParams = validated;
      } else {
        req[source] = validated;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages
        });
      }
      
      next(error);
    }
  };
};

/**
 * Middleware for validating multiple sources (body, query, params)
 * @param {Object} schemas - Object with keys: body, query, params and Zod schemas as values
 * @returns {Function} Express middleware function
 */
export const validateMultiple = (schemas) => {
  return async (req, res, next) => {
    try {
      const errors = [];
      
      for (const [source, schema] of Object.entries(schemas)) {
        if (schema) {
          try {
            const validated = await schema.parseAsync(req[source]);
            req[source] = validated;
          } catch (error) {
            if (error instanceof ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  source,
                  field: err.path.join('.'),
                  message: err.message
                });
              });
            }
          }
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
