const { app, BrowserWindow } = require("electron");
// import UI from "./UI.js"; // don't use import in nodejs, use require
const path = require("path");
const WebSocket = require("ws"); // Add WebSocket module
const { Server } = require("socket.io");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // Change here, between dev mode and production mode
  //win.loadFile("vue/dist/index.html");
  win.loadURL("http://localhost:8080/index.html");

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self' 'unsafe-eval';"],
      },
    });
  });
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  //main.js;
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:8080", // be careful : 127.0.0.1 is reporting error
  },
});


console.log("Server started on port 3000");
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
  });
});

