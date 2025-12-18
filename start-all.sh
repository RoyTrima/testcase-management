#!/bin/bash
echo "Memulai project Testcase-Management..."

# 1. Start Docker (PostgreSQL + PGAdmin) jika ada infra/docker-compose.yml
echo "Menjalankan Docker container..."
if [ -f infra/docker-compose.yml ]; then
  docker compose -f infra/docker-compose.yml up -d
  echo "Docker container up."
else
  echo "docker-compose.yml tidak ditemukan di infra/. Lewati Docker."
fi

# 2. Start backend
echo "Menjalankan backend..."
cd backend || { echo "Folder backend tidak ditemukan!"; exit 1; }
npm install
npm run dev &
BACKEND_PID=$!
cd ..

# 3. Start frontend
echo "Menjalankan frontend..."
cd frontend || { echo "Folder frontend tidak ditemukan!"; exit 1; }
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# 4. Tunggu service ready
sleep 5

# 5. Tampilkan URL akses
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")
echo "Semua service dijalankan!"
echo "Frontend: http://$LOCAL_IP:5173"
echo "Backend:  http://$LOCAL_IP:4000"

# 6. Tunggu proses supaya terminal tetap hidup
wait $BACKEND_PID $FRONTEND_PID
