import { Server } from "socket.io";

const initialSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // listen socket connect
  io.on("connection", (socket) => {
    // console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      // console.log("A user disconnected", socket.id);
    });

    // listen admin hide product
    socket.on("hidden product", (productId) => {
      io.emit("hidden product", productId);
    });

    // listen admin update product: size
    socket.on('update product', productId => {
      io.emit('update product', productId);
    })
  });

  io.listen(4000);
};

export default initialSocket;
