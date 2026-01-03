import asyncio
import websockets
import json
import random
import math

HOST = "0.0.0.0"
PORT = 3000

async def mock_esp32():
    uri = f"ws://localhost:{PORT}"
    print(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected! Sending mock data stream...")
            
            t = 0
            while True:
                # Simulate sensor data
                # Water/Distance: Sine wave + noise
                w = 100 + 50 * math.sin(t * 0.1) + random.uniform(-2, 2)
                
                # Tilt X/Y: Slight wobble
                tx = 5 * math.sin(t * 0.2) + random.uniform(-0.5, 0.5)
                ty = 5 * math.cos(t * 0.2) + random.uniform(-0.5, 0.5)
                
                # Soil: Slow drift
                s = 50 + 30 * math.sin(t * 0.05) + random.uniform(-1, 1)
                
                data = {
                    "w": round(w, 1),
                    "tx": round(tx, 1),
                    "ty": round(ty, 1),
                    "s": round(s, 1)
                }
                
                await websocket.send(json.dumps(data))
                # print(f"Sent: {data}")
                
                t += 1
                await asyncio.sleep(0.1) # 10 Hz
                
    except Exception as e:
        print(f"Connection failed: {e}")
        print("Make sure the server.py is running first!")

if __name__ == "__main__":
    asyncio.run(mock_esp32())
