/*import express from "express";
import http from "http";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
*/

//replace all the code above from import to require
const express = require("express");
const http = require("http");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

class UI {
  constructor(m) {
    const express_app = require("express")();
    const server = http.createServer(express_app);
    this.io = require("socket.io")(server, {
      cors: {
        origin: "http://127.0.0.1:3000", // Replace with your Electron app's origin
        methods: ["GET", "POST"],
      },
      cookie: {
        // I want  sameSite = None
        sameSite: "None",
        secure: true,
      },
    });

    this.io.on("connection", (socket) => {
      console.log("a user connected");
      this.socket = socket;
      console.log(socket.id);

      this.socket.on("test", (data) => {
        console.log("test received");
        console.log(data);
      });

      this.addDeviceUI("leapmotion", "nono", 1, "capte le signal des mains");

      this.socket.on("devices/refresh", () => {
        //this.updateDeviceUIState();
        console.log("UI ash for refresh devices");
      });

      this.socket.on("analyzers/refresh", () => {
        //this.updateAnalyzersUIState();
      });

      this.socket.on("analyzers/add", (data) => {
        //call deviceManager addDevice with the name of the device
        // console.log("User ask to add analyzer " + data.name);
        // this.am.addAnalyzer(data.type, data.name, {});
        // this.updateAnalyzersUIState();
      });

      this.socket.on("analyzers/delete", (data) => {
        // this.am.removeAnalyzer(data.index);
        // this.updateAnalyzersUIState();
      });

      this.socket.on("analyzers/restart", (data) => {
        // console.log("User ask to restart analyzer " + data.index);
        // this.am.restartSpecificAnalyzer(data.index);
      });

      //On message received from UI /devices/delete
      this.socket.on("devices/delete", (data) => {
        //call deviceManager deleteDevice with the index of the device
        // console.log("User ask to delete device " + data.index);
        // this.dm.deleteDevice(data.index);
        // this.updateDeviceUIState();
      });

      //On message received from UI /devices/add
      this.socket.on("devices/add", (data) => {
        //call deviceManager addDevice with the name of the device
        // console.log("User ask to add device " + data.name);
        // this.dm.addDevice(data.type, data.name);
        // this.updateDeviceUIState();
      });
    });

    server.listen(3000);

    //singleton, return the instance of UI
    if (!UI.instance) {
      UI.instance = this;
    }
    return UI.instance;

    //add all manager instance
    this.dm = null;
    this.am = null;
    this.gsm = null;
  }

  updateDeviceUIState() {
    if (this.socket) {
      this.socket.emit("devices/reset", {});

      //read the actual state of all the devices, and send it to the UI
      this.dm.devicesList.forEach((device) => {
        this.addDeviceUI(
          device.constructor.name,
          device.name,
          device.indexDevice,
          device.description
        );
      });
      this.socket.emit("devices/typelist", this.dm.devicesAvailable);
    }
  }

  /********************
   *  Devices
   ********************/

  addDeviceUI(deviceType, n, index, d) {
    //check if socket is defined
    if (this.socket) {
      //emit a socket event with the deviceType, name and index
      this.socket.emit("devices/add", {
        name: n,
        index: index,
        description: d,
      });
      console.log("addDeviceUI : " + deviceType + " " + n + " " + index);
    } else {
      //emit socket message when socket is defined, and ready to operate.

      console.log("UI socket is not defined");
    }
  }

  updateDeviceRawDataEventUI(data, indexDevice) {
    // Data is juste the data part of the RawDataEvent
    //check is socket is defined
    if (this.socket) {
      let url = "devices/" + indexDevice + "/rawdataevent";
      //console.log("updateRawDataEventUI : " + url);
      this.socket.emit(url, data);
    } else {
      //emit socket message when socket is defined, and ready to operate.
      console.log("UI socket is not defined");
    }
  }

  //create new methode call updateChartUI
  updateDeviceChartUI(data, channel, indexDevice) {
    //check is socket is defined
    if (this.socket) {
      let url = "devices/" + indexDevice + "/chart";
      //console.log("updateChartUI : " + data + " " + url);
      this.socket.emit(url, { channel: channel, value: data });
    }
  }

  updateDeviceConsoleUI(data, index) {
    //check is socket is defined
    if (this.socket) {
      //console.log("updateConsoleUI : " + data);
      let url = "devices/" + index + "/console";
      this.socket.emit(url, data);
    }
  }

  /********************
   *  ANALYZERS
   ********************/

  // emit analyzerS means to all analyzers
  // emit analyzer means to a specific analyzer

  updateAnalyzersUIState() {
    if (this.socket) {
      this.socket.emit("analyzers/reset", {});

      //read the actual state of all the analyzers, and send it to the UI
      this.am.analyzersList.forEach((analyzer) => {
        this.addAnalyzersUI(
          analyzer.name,
          analyzer.index,
          analyzer.microgesture
        );
      });
      this.socket.emit("analyzers/typelist", this.am.analyzersAvailable);
      this.am.analyzersList.forEach((analyzer) => {
        analyzer.refreshUI();
      });

      //repeat this for anaylyzers and subscribers.
    }
  }

  updateSingleAnalyzerState(index, state) {
    if (this.socket) {
      this.socket.emit("analyzer/" + index + "/active", state);
    }
  }

  addAnalyzersUI(name, index, micro) {
    //check if socket is defined
    if (this.socket) {
      //emit a socket event with the deviceType, name and index
      this.socket.emit("analyzers/add", {
        name: name,
        index: index,
        microgesture: micro,
      });
      console.log("addAnalyzerUI : " + name + " " + index);
    } else {
      //emit socket message when socket is defined, and ready to operate.
      console.log("UI socket is not defined");
    }
  }

  updateAnalyzersConsoleUI(data, index) {
    //check is socket is defined
    if (this.socket) {
      console.log("updateAnalysersUI : " + data);
      let url = "analyzers/" + index + "/console";
      this.socket.emit(url, data);
    }
  }

  updateAnalyzerGlyphActiveState(index, indextree, state) {
    //index is index of the analyzer
    //indextree is the position of the analyzer inside the tree. It is a string "1-2-3", not an array
    //state 0:inactive  1:listening  2:activated ( a match has been found)

    if (this.socket) {
      //replace any - in indextree into / and finish the string with a /
      let endofurl = indextree.replaceAll("-", "/");
      endofurl = endofurl + "/";

      let url = "analyzers/" + index + "/" + endofurl + "active";
      this.socket.emit(url, state);
      console.log("updateAnalyzerActiveState : " + url + " " + state);
    }
  }

  /***********
   *  SINGLETON
   **********/

  //singleton, getInstance method
  static getInstance() {
    if (!UI.instance) {
      UI.instance = new UI();
    }
    return UI.instance;
  }
}

//export default UI; //don't use export in nodejs, use module.exports
module.exports = UI;
