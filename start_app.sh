#!/bin/bash

# Kill any existing processes on port 3000 (server) and 5173/5174 (frontend)
echo "Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null

# Start the WebSocket Server
echo "Starting WebSocket Server..."
python3 server.py &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Start the Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to initialize
sleep 5

# Start the Test Client (Simulation)
echo "Starting Test Client (Mock Data)..."
python3 test_client/client.py &
CLIENT_PID=$!

echo "------------------------------------------------"
echo "BLIM System Running!"
echo "Server PID: $SERVER_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Client PID: $CLIENT_PID"
echo "------------------------------------------------"
echo "Press Ctrl+C to stop all services."

# Handle shutdown
trap "kill $SERVER_PID $FRONTEND_PID $CLIENT_PID; exit" SIGINT SIGTERM

# Keep script running
wait
