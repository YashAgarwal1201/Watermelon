#!/usr/bin/env bash

PORTS=(5150 5251 5252 5253 5254 5161 5162 4201)

echo "🔍 Checking for processes listening on Watermelon ports: ${PORTS[*]}..."

KILLED=0
for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo "🛑 Killing process $PID listening on port $PORT..."
        kill -9 $PID 2>/dev/null || true
        KILLED=$((KILLED + 1))
    fi
done

if [ "$KILLED" -eq 0 ]; then
    echo "✅ All ports are already free."
else
    echo "✅ Successfully freed all Watermelon ports."
fi
