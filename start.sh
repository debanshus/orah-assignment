#!/bin/bash
echo "Cleaning up old volumes and closing existing containers..."
docker-compose down -v --remove-orphans

echo "Starting all services..."
docker-compose up -d

echo "Waiting for services to initialize (30 seconds)..."
sleep 30

echo "----------------------------------------"
echo "Service Status Report:"
echo "----------------------------------------"
docker-compose ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}"

echo ""
echo "Checking for failed services..."
# Find all exited containers
EXITED_SERVICES=$(docker-compose ps -a --filter "status=exited" --format "{{.Service}}")
REAL_FAILURES=""

for service in $EXITED_SERVICES; do
  # Get the exit code of the service container
  EXIT_CODE=$(docker inspect $(docker-compose ps -q $service) --format='{{.State.ExitCode}}' 2>/dev/null)
  
  if [ "$EXIT_CODE" != "0" ] && [ ! -z "$EXIT_CODE" ]; then
    REAL_FAILURES="$REAL_FAILURES $service"
  fi
done

if [ -z "$REAL_FAILURES" ]; then
  echo "✅ All services started and initialized successfully!"
else
  echo "❌ The following services failed to start (Exit Code != 0):"
  for service in $REAL_FAILURES; do
    echo "- $service"
  done
  echo "--- Logs for failed services ---"
  for service in $REAL_FAILURES; do
    echo "Logs for $service:"
    docker-compose logs --tail=10 $service
    echo "--------------------------"
  done
fi
