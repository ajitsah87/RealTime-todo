// src/utils/socketService.js
import { io } from 'socket.io-client';
import { baseURL } from './constant';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(baseURL);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  onTodoUpdate(callback) {
    this.socket.on('todoUpdate', callback);
  }

  emitTodoChange(action, data) {
    this.socket.emit('todoChange', { action, data });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();