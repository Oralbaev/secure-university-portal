/**
 * @param {Record<string, any>} filter
 * @returns {Record<string, any>} validFilter
 */
const extractValidSorter = (filter) => {
  const validFilter = Object.entries(filter).reduce((acc, [key, v]) => {
    const value = Number(v)
    if (value !== 1 && value !== -1) return acc
    acc[key] = value
    return acc
  }, {})

  return validFilter
}

module.exports = extractValidSorter
