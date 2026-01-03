import asyncio
import websockets
import json
import random
import time

SERVER_URI = "ws://localhost:3000"

async def simulated_sensor_stream():
    """
    Simulates an ESP32 sending distance measurements.
    """
    print(f"Connecting to {SERVER_URI}...")
    try:
        async with websockets.connect(SERVER_URI) as websocket:
            print("Connected! Sending data stream...")
            
            while True:
                # Simulate sensor readings
                water_level = f"{round(random.uniform(0.0, 10.0), 2)}" # cm/h as string
                wph = f"{round(random.uniform(0.0, 5.0), 2)}"          # cm/h rise
                tilt_x = f"{round(random.uniform(-180.0, 180.0), 2)}"  # degrees as string
                tilt_y = f"{round(random.uniform(-180.0, 180.0), 2)}"  # degrees as string
                soil_moisture = int(random.uniform(0.0, 100.0))        # % as number
                
                # Create a JSON payload matching the new spec
                payload = {
                    "w": water_level,
                    "wph": wph,
                    "tx": tilt_x,
                    "ty": tilt_y,
                    "s": soil_moisture
                }
                
                # Send as JSON string
                await websocket.send(json.dumps(payload))
                print(f"Sent: {payload}")
                
                # Wait a bit before next reading (e.g., 1 second)
                await asyncio.sleep(1)
                
    except ConnectionRefusedError:
        print(f"Could not connect to {SERVER_URI}. Is the server running?")
    except websockets.exceptions.ConnectionClosed:
        print("Connection closed by server.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(simulated_sensor_stream())
    except KeyboardInterrupt:
        print("\nTest client stopped by user.")
