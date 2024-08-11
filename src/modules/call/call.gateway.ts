import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class CallGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Socket[] = [];

  afterInit(server: Server) {
    console.log("WebSocket server initialized");
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter((c) => c !== client);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("disable_prescriber")
  handleMessage(client: Socket, data: any) {
    console.log(`Received data from ${client.id}:`, data);
    this.server.emit("disable_prescriber", data);
  }

  @SubscribeMessage("enable_prescriber")
  handleEnablePrescriber(client: Socket, data: any) {
    console.log(`Received data from ${client.id}:`, data);
    this.server.emit("enable_prescriber", data);
  }
}
