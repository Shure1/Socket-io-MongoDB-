import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import messageRouter from "./routes/messages.routes.js";
import { messageModel } from "./models/messages.models.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";

const app = express();
const PORT = 4000;

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});
app.use(express.json());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views")); //indicamos que usaremos todo el handlebars desde views
app.use("/static", express.static(path.join(__dirname, "/public"))); //indicamos que usaremos public para archivos de estilos o funcionales(js)

const io = new Server(serverExpress);

mongoose
  .connect(
    "mongodb+srv://erodriguezp2:Shure200.@cluster0.qhlv3mx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("BDD conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

io.on("connection", (socket) => {
  console.log("Servidor Socket io conectado");
  socket.on("mensaje", async (infoMensaje) => {
    try {
      const resultado = await messageModel.create({
        email: infoMensaje.email,
        message: infoMensaje.mensaje,
      });
      console.log("datos guardados correctamente en la coleccion", resultado);
      socket.emit("mensajeGuardado", {
        success: true,
        mensaje: "Datos guardados correctamente",
      });
    } catch (error) {
      console.log("error al guardar los datos", error);
      socket.emit("mensajeGuardado", {
        success: false,
        mensaje: "error al guardar los datos en la coleccion",
      });
    }
  });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/messages", messageRouter);

app.get("/static", (req, res) => {
  res.render("chat", {
    css: "style.css",
    js: "script.js",
  });
});
