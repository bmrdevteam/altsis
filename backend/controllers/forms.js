import { logger } from "../log/logger.js";
import { Form } from "../models/index.js";

export const create = async (req, res) => {
  try {
    const exForm = await Form(req.user.academyId).findOne({
      title: req.body.title,
      type: req.body.type,
    });
    if (exForm)
      return res.status(409).send({
        message: "already existing form title and type",
      });

    const _Form = Form(req.user.academyId);

    if ("copyFrom" in req.body) {
      const formToCopy = await _Form.findById(req.body.copyFrom);
      if (!formToCopy)
        return res.status(404).send({
          message: `form(${req.body.copyFrom}) not found`,
        });

      /* create and save document */
      const form = new _Form({
        type: formToCopy.type,
        title: `${formToCopy.title}의 사본`,
        data: formToCopy.data,
        userId: formToCopy.userId,
        userName: formToCopy.userName,
      });
      await form.save();
      return res.status(200).send(form);
    }

    const form = new _Form({
      type: req.body.type,
      title: req.body.title,
      data: req.body.data,
      userId: req.user.userId,
      userName: req.user.userName,
    });
    await form.save();
    return res.status(200).send(form);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req, res) => {
  try {
    if (req.params._id) {
      const form = await Form(req.user.academyId).findById(req.params._id);
      return res.status(200).send(form);
    }
    const forms = await Form(req.user.academyId)
      .find(req.query)
      .select("-data");
    return res.status(200).send({ forms });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const form = await Form(req.user.academyId).findById(req.params._id);
    if (!form) return res.status(404).send({ message: "form not found" });

    //const fields = ["type", "title", "contents"]; // temp-1.1: form의 data가 object type인 경우
    const fields = ["type", "title", "data", "archived"]; // temp1-2. form의 data가 Array type인 경우

    if (req.params.field) {
      if (fields.includes(req.params.field)) {
        form[req.params.field] = req.body.new;
      } else {
        return res.status(400).send({
          message: `field '${req.params.field}' does not exist or cannot be updated`,
        });
      }
    } else {
      fields.forEach((field) => {
        form[field] = req.body.new[field];
      });
    }

    await form.save();
    return res.status(200).send(form);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const form = await Form(req.user.academyId).findById(req.params._id);
    if (!form) return res.status(404).send();
    await form.remove();
    return res.status(200).send();
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
