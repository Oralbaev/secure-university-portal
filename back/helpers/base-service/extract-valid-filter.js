/**
 * @param {Record<string, any>} filter
 * @returns {Record<string, any>} validFilter
 */
const extractValidFilter = (filter) => {
  const validFilter = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value === undefined) return acc
    acc[key] = value
    return acc
  }, {})

  return validFilter
}

module.exports = extractValidFilter
