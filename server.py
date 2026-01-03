import asyncio
import websockets
import json
from datetime import datetime

# Configuration
HOST = "0.0.0.0"  # Listen on all available interfaces
PORT = 3000

# Store connected clients
connected_clients = set()

async def handler(websocket):
    """
    Handles incoming WebSocket connections.
    """
    client_info = websocket.remote_address
    print(f"[{datetime.now()}] New client connected: {client_info}")
    connected_clients.add(websocket)

    try:
        async for message in websocket:
            # Broadcast the received message to all other connected clients
            # We want to send it to frontend clients. 
            # In this simple model, we just broadcast to everyone else.
            for client in connected_clients:
                if client != websocket:
                    try:
                        await client.send(message)
                    except websockets.exceptions.ConnectionClosed:
                        pass # Will be handled by the finally block of that client

            try:
                # Try to parse as JSON for logging purposes
                data = json.loads(message)
                
                # Extract sensor values
                water_level = data.get("w")
                wph = data.get("wph")
                tilt_x = data.get("tx")
                tilt_y = data.get("ty")
                soil_moisture = data.get("s")
                
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                # Check if we have valid data for at least one sensor
                if any(v is not None for v in [water_level, wph, tilt_x, tilt_y, soil_moisture]):
                     print(f"[{timestamp}] Water: {water_level} cm | Rise: {wph} cm/h | Tilt X: {tilt_x}° | Tilt Y: {tilt_y}° | Soil: {soil_moisture}%")
                else:
                    print(f"[{timestamp}] Received unknown JSON: {data}")

            except json.JSONDecodeError:
                # Treat as plain text or log error
                print(f"[{datetime.now()}] Received non-JSON message: {message.strip()}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"[{datetime.now()}] Client {client_info} disconnected. Code: {e.code}, Reason: {e.reason}")
    except Exception as e:
        print(f"[{datetime.now()}] Error with client {client_info}: {e}")
    finally:
        connected_clients.remove(websocket)
        print(f"[{datetime.now()}] Connection closed for {client_info}")

async def main():
    print(f"Starting WebSocket server on {HOST}:{PORT}...")
    print("Press Ctrl+C to stop.")
    
    # instructions
    print("\n--- Instructions ---")
    print(f"1. Ensure your ESP32 is on the same network.")
    print(f"2. Configure your ESP32 to connect to: ws://<YOUR_LAPTOP_IP>:{PORT}")
    print(f"3. Find your laptop's IP using `ifconfig` (Mac/Linux) or `ipconfig` (Windows).")
    print("--------------------\n")

    async with websockets.serve(handler, HOST, PORT):
        await asyncio.get_running_loop().create_future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped by user.")
