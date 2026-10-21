const extractValidFilter = require('./extract-valid-filter')
const extractValidSorter = require('./extract-valid-sorter')

/**
 * Abstract Base service for handling common operations for a Mongoose model.
 */
class BaseService {
  /**
   * Constructs the base service with default configuration.
   * @param {Object} config Configuration object for the service.
   * @param {mongoose.Model} config.Model Mongoose model for database operations.
   * @param {Array<string>} config.defaulPopulateOptions Default fields to populate.
   * @param {Array<string>} config.defaultSelectOptions Default fields to select.
   * @param {Object} config.errorsEnum Enumeration of possible error messages.
   */
  constructor({
    Model,
    defaulPopulateOptions = [],
    defaultSelectOptions = [],
    errorsEnum = {}
  }) {
    this.Model = Model
    this.defaultPopulateOptions = defaulPopulateOptions
    this.defaultSelectOptions = defaultSelectOptions
    this.errorsEnum = errorsEnum
  }

  /**
   * Retrieves the base filter for querying items from the database.
   * @param {Object} filter The filter criteria object.
   * @returns {Promise<Object>} The processed filter object.
   */
  async _getBaseFilter(filter = {}) {
    const { isDeleted, ...restFilter } = filter

    if (isDeleted === undefined) {
      restFilter.isDeleted = false
    } else {
      restFilter.isDeleted = isDeleted
    }

    return extractValidFilter(restFilter)
  }

  /**
   * Retrieves the base sorter for querying items from the database.
   * @param {Object} sorter The sorter criteria object.
   * @returns {Promise<Object>} The processed sorter object.
   */
  async _getBaseSorter(sorter = {}) {
    return extractValidSorter(sorter)
  }

  /**
   * Constructs base pagination settings from the provided options.
   * @param {Object} options Pagination and additional options.
   * @param {Object} options.pagination Pagination specific options.
   * @returns {Object} The pagination and processed rest options.
   */
  async _getBasePagination({ pagination = {}, ...rest }) {
    const { page = 1, limit = 10, disabled = false } = pagination
    const enabled = disabled === false || disabled === 'false'
    return {
      page,
      limit: Math.min(limit, 1000),
      pagination: enabled,
      ...rest
    }
  }

  /**
   * Finds an item by its ID.
   * @param {string} id The ID of the item to find.
   * @param {Object} options Options for finding the item.
   * @param {Array<string>} options.select Fields to select.
   * @param {Array<string>} options.populate Fields to populate.
   * @returns {Promise<Object | null>} The found item or null if not found.
   */
  async findById(
    id,
    {
      select = this.defaultSelectOptions,
      populate = this.defaultPopulateOptions
    } = {}
  ) {
    const document = await this.Model.findById(id)
      .select(select)
      .populate(populate)

    return document
  }

  /**
   * Finds an item by its ID or throws an error if not found.
   * @param {string} id The ID of the item to find.
   * @param {Object} options Options for finding the item.
   * @returns {Promise<Object>} The found item.
   * @throws {Error} If the item is not found.
   */
  async findByIdOrFail(id, options) {
    const document = await this.findById(id, options)
    if (!document) {
      throw this.errorsEnum.NOT_FOUND
    }
    return document
  }

  /**
   * Finds a single item based on provided filter criteria.
   * @param {Object} options Options for finding the item.
   * @param {Object} options.filter The filter criteria.
   * @param {Array<string>} options.select Fields to select in the result.
   * @param {Array<string>} options.populate Fields to populate in the result.
   * @returns {Promise<Object | null>} The found item or null.
   */
  async findOne({
    filter,
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions,
    sort = { created_at: -1 }
  } = {}) {
    const queryOptions = await this._getBaseFilter(filter)
    const document = await this.Model.findOne(queryOptions)
      .sort(sort)
      .select(select)
      .populate(populate)

    return document
  }

  /**
   * Finds a single item based on provided filter criteria or throws an error if not found.
   * @param {Object} options Options for finding the item.
   * @returns {Promise<Object>} The found item.
   * @throws {Error} If the item is not found.
   */
  async findOneOrFail({
    filter,
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions
  } = {}) {
    const document = await this.findOne({ filter, select, populate })
    if (!document) {
      throw this.errorsEnum.NOT_FOUND
    }
    return document
  }

  /**
   * Finds items based on provided filters, select options, populate options, and sorter.
   * @param {Object} options Options for finding the items.
   * @param {Object} options.filter The filter criteria.
   * @param {Array<string>} options.select Fields to select in the result.
   * @param {Array<string>} options.populate Fields to populate in the result.
   * @param {Object} options.sorter The sorter criteria.
   * @returns {Promise<Array<Object>>} An array of found items.
   */
  async find({
    filter,
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions,
    sorter
  } = {}) {
    const queryOptions = await this._getBaseFilter(filter)
    const sortOptions = await this._getBaseSorter(sorter)
    const documents = await this.Model.find(queryOptions)
      .select(select)
      .populate(populate)
      .sort(sortOptions)

    return documents
  }

  /**
   * Paginates items based on provided filters, select options, populate options, sorter, and pagination options.
   * This method relies on the `mongoose-paginate-v2` plugin for pagination. It will not work as intended if the underlying
   * model (this.Model) does not utilize `mongoose-paginate-v2`. Ensure that your data model is compatible with
   * `mongoose-paginate-v2` or modify the pagination implementation accordingly.
   *
   * @param {Object} options Options for paginating the items.
   * @param {Object} options.filter The filter criteria.
   * @param {Array<string>} options.select Fields to select.
   * @param {Array<string>} options.populate Fields to populate.
   * @param {Object} options.sorter The sorter criteria.
   * @param {Object} options.pagination The pagination options.
   * @returns {Promise<Array<Object>>} An array of paginated items.
   */
  async paginate({
    filter,
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions,
    sorter,
    pagination
  } = {}) {
    const queryOptions = await this._getBaseFilter(filter)
    const sortOptions = await this._getBaseSorter(sorter)
    const paginationOptions = await this._getBasePagination({
      pagination,
      select,
      populate,
      sort: sortOptions
    })
    const documents = await this.Model.paginate(queryOptions, paginationOptions)
    return documents
  }

  /**
   * Creates a new document using the provided payload.
   * @param {Object} payload - The data to be used for creating the document.
   * @param {Object} session - The session object for the database transaction (optional).
   * @returns {Promise<Object>} - A promise that resolves to the created document.
   */
  async create(payload, session) {
    const createdDocument = new this.Model(payload)
    await createdDocument.save({ session })
    return createdDocument
  }

  /**
   * Updates an item by its ID with provided data.
   * @param {string} id The ID of the item to update.
   * @param {Object} options Options for updating the item.
   * @param {Object} options.data The data to update the item with.
   * @param {Array<string>} options.select Fields to select in the result.
   * @param {Array<string>} options.populate Fields to populate in the result.
   * @returns {Promise<Object | null>} The updated item or null if not found.
   */
  async findByIdAndUpdate(
    id,
    {
      data,
      select = this.defaultSelectOptions,
      populate = this.defaultPopulateOptions
    }
  ) {
    const updatedDocument = await this.Model.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    )
      .select(select)
      .populate(populate)

    return updatedDocument
  }

  /**
   * Updates an item by its ID with provided data or throws an error if not found.
   * @param {string} id The ID of the item to update.
   * @param {Object} options Options for updating the item.
   * @returns {Promise<Object>} The updated item.
   * @throws {Error} If the item is not found.
   */
  async findByIdAndUpdateOrFail(id, options) {
    const updatedDocument = await this.findByIdAndUpdate(id, options)
    if (!updatedDocument) {
      throw this.errorsEnum.NOT_FOUND
    }
    return updatedDocument
  }

  /**
   * Updates a single document in the database based on the provided query and data.
   * @param {Object} query - The query object used to find the document to update.
   * @param {Object} data - The data object containing the updated values.
   * @returns {Promise<boolean>} True if a document matched the query, false otherwise.
   */
  async updateOne(query, data) {
    const status = await this.Model.updateOne(query, data)
    return Boolean(status?.matchedCount)
  }

  async createOneOrUpdateOne(query, data) {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true }
    return this.Model.findOneAndUpdate(query, data, options)
  }

  /**
   * Updates a single document in the database based on the provided query and data.
   * @param {Object} query - The query object used to find the document to update.
   * @param {Object} data - The data object containing the updated values.
   * @throws {Error} NOT_FOUND - If the document is not found.
   * @returns {Promise<void>} - A promise that resolves when the document is successfully updated.
   */
  async updateOneOrFail(query, data) {
    const updated = await this.updateOne(query, data)
    if (!updated) {
      throw this.errorsEnum.NOT_FOUND
    }
  }

  /**
   * Deletes an item by its ID.
   * @param {string} id The ID of the item to delete.
   * @returns {Promise<boolean>} True if the item was deleted, false otherwise.
   */
  async deleteOne(id, hardDelete = false) {
    if (hardDelete) {
      const result = await this.Model.deleteOne({ _id: id })
      return Boolean(result.deletedCount)
    } else {
      const status = await this.Model.updateOne(
        { _id: id, isDeleted: false },
        { isDeleted: true }
      )
      return Boolean(status?.modifiedCount)
    }
  }

  /**
   * Deletes an item by its ID or throws an error if not found.
   * @param {string} id The ID of the item to delete.
   * @returns {Promise<boolean>} True if the item was deleted.
   * @throws {Error} If the item is not found.
   */
  async deleteOneOrFail(id) {
    const deleted = await this.deleteOne(id)
    if (!deleted) {
      throw this.errorsEnum.NOT_FOUND
    }
    return deleted
  }
  /**
   * Retrieves all items from the database with optional selection and population.
   * @param {Object} options Options for retrieving the items.
   * @param {Array<string>} options.select Fields to select in the result.
   * @param {Array<string>} options.populate Fields to populate in the result.
   * @returns {Promise<Array<Object>>} An array of found items.
   */
  async findAll({
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions
  } = {}) {
    const documents = await this.Model.find().select(select).populate(populate)

    return documents
  }
  /**
   * Finds a single item based on provided filter criteria and marks it as deleted.
   * @param {Object} options Options for finding and deleting the item.
   * @param {Object} options.filter The filter criteria for finding the item.
   * @param {Array<string>} options.select Fields to select in the result.
   * @param {Array<string>} options.populate Fields to populate in the result.
   * @returns {Promise<Object | null>} The found and marked deleted item or null.
   */
  async findOneAndDelete({
    filter,
    select = this.defaultSelectOptions,
    populate = this.defaultPopulateOptions
  } = {}) {
    const queryOptions = await this._getBaseFilter(filter)
    const document = await this.Model.findOneAndUpdate(
      queryOptions,
      { isDeleted: true },
      { new: true }
    )
      .select(select)
      .populate(populate)

    return document
  }
}

module.exports = BaseService
