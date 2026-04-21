const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().trim().min(12, 'id is required')
});

module.exports = {
  idParamSchema
};
