<template>
  <div>
    <h1>Hello World Component</h1>
    <button @click="connectWebSocket">Connect to WebSocket</button>
    <button @click="sayHello"> say hello</button>
  </div>
</template>

<script>

import { io } from "socket.io-client";
export default {
  methods: {
    connectWebSocket() {

      this.socket = io("ws://localhost:3000"); // Socket.io connection to your server

    },
    sayHello() {

      this.socket.emit("message", "Hello");
    },
  },
  data() {
    return {
      socket: null,
    };
  },
};
</script>

<style scoped>
/* Add your component styles here */
</style>
