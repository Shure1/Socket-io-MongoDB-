import { Router } from "express";
import { messageModel } from "../models/messages.models.js";

const messageRouter = Router();

messageRouter.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const messages = await messageModel.find().limit(limit);
    res.status(200).send({ respuesta: "ok", mensaje: messages });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "error al consultar mensajes", mensaje: error });
  }
});

messageRouter.post("/", async (req, res) => {
  const { email, message, postTime } = req.body;
  try {
    const messageDb = await messageModel.create({
      email,
      message,
      postTime,
    });
    res.status(200).send({
      respuesta: "OK",
      mensaje: messageDb,
    });
  } catch (error) {}
});

export default messageRouter;
