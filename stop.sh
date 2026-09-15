#!/bin/bash
echo "🛑 Stopping and removing all Docker containers..."
docker-compose down -v
echo "✅ All containers stopped and removed successfully!"
