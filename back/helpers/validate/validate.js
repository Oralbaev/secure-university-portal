const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    })

    return next()
  } catch (error) {
    // Send the issue list explicitly: zod 4 no longer serializes ZodError
    // through JSON.stringify with the structured `issues` field.
    return res.status(400).json({ name: error.name, issues: error.issues })
  }
}

module.exports = validate
