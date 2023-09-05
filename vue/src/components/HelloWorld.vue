<template>
  <div>
    <h1>Hello World Component</h1>
    <button @click="connectWebSocket">Connect to WebSocket</button>
    <button @click="sayHello"> say hello</button>
  </div>
</template>

<script>
export default {
  methods: {
    connectWebSocket() {
      this.socket = new WebSocket("ws://localhost:3000"); // WebSocket connection to your server

      this.socket.onopen = () => {
        console.log("WebSocket connected");
      };

      this.socket.onmessage = (event) => {
        console.log("Message received:", event.data);
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },
    sayHello() {
      this.socket.send("Hello");
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
