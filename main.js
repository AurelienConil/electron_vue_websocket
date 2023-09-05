const { app, BrowserWindow } = require("electron");
// import UI from "./UI.js"; // don't use import in nodejs, use require
const path = require("path");
const WebSocket = require("ws"); // Add WebSocket module

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
  win.loadFile("vue/dist/index.html");
  //win.loadURL("http://localhost:8080/index.html");

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

// WebSocket server setup
wsServer = new WebSocket.Server({ port: 3000 });

// Handle WebSocket connections
wsServer.on("connection", (socket) => {
  console.log("WebSocket connected");

  // Handle incoming messages from clients
  socket.on("message", (message) => {
    console.log("Message received:", message);

    // You can broadcast this message to all connected clients here if needed
    // Example: wsServer.clients.forEach((client) => client.send(message));
  });

  // Handle WebSocket disconnections
  socket.on("close", () => {
    console.log("WebSocket closed");
  });

  // Handle WebSocket errors
  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
