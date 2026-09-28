const SavedSearch = require("../models/savedSearch.model");

class SavedSearchRepository {
  async create(data) {
    return SavedSearch.create(data);
  }

  async findByUser(userId) {
    return SavedSearch.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async findById(userId, id) {
    return SavedSearch.findOne({ _id: id, userId }).lean();
  }

  async update(userId, id, data) {
    return SavedSearch.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(userId, id) {
    return SavedSearch.findOneAndDelete({ _id: id, userId }).lean();
  }
}

module.exports = new SavedSearchRepository();