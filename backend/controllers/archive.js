const _ = require("lodash");
const { Archive, School, User } = require("../models/models");

/* create */
module.exports.create = async (req, res) => {
  try {
    const user = await User(req.user.dbName).findOne({
      userId: req.body.userId,
    });
    if (!user) return res.status(404).send();

    const school = await School(req.user.dbName).findById(req.body.school);
    if (!school) return res.status(404).send();

    const _Archive = Archive(req.user.dbName);

    /* check duplication */
    const exArchive = await _Archive.findOne({
      school: req.body.school,
      userId: req.body.userId,
    });

    if (exArchive)
      return res.status(409).send({ message: `archive already exists` });

    /* create and save document */
    const archive = new _Archive({
      userId: user.userId,
      userName: user.userName,
      school: school._id,
      schoolId: school.schoolId,
      schoolName: school.schoolName,
      data: req.body.data,
    });
    await archive.save();
    return res.status(200).send(archive);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.find = async (req, res) => {
  try {
    const { userId, school } = req.query;
    if (!userId || !school) {
      return res.status(400).send();
    }
    const archive = await Archive(req.user.dbName).findOne({
      userId,
      school,
    });
    if (!archive) return res.status(404).send({ message: "archive not found" });
    return res.status(200).send(archive);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.findById = async (req, res) => {
  try {
    const archive = await Archive(req.user.dbName).findById(req.params._id);
    if (!archive) return res.status(404).send({ message: "archive not found" });

    return res.status(200).send(archive);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.updateDataField = async (req, res) => {
  try {
    const archive = await Archive(req.user.dbName).findById(req.params._id);
    if (!archive) return res.status(404).send({ message: "archive not found" });

    const field = req.params.field;
    archive.data[field] = req.body.new;
    await archive.save();
    return res.status(200).send(archive);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/* delete */

exports.remove = async (req, res) => {
  try {
    const archive = await Archive(req.user.dbName).findById(req.params._id);
    if (!archive) return res.status(404).send({ message: "archive not found" });
    await archive.delete();
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
};
