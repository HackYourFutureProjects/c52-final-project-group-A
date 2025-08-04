import { io } from "socket.io-client";

const socket =
  globalThis.__appSocket ||
  io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
  });

globalThis.__appSocket = socket;

export { socket };

export function on(event, handler) {
  socket.on(event, handler);
  return () => socket.off(event, handler);
}
