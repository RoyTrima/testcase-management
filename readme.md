1. Pastikan run sebelum jalan
cd backend
npm install
npm run dev
status harus
Server running on port 4000
test api di browser
http://localhost:4000/api/testcases

2. Pastikan Database Berjalan (Docker PostgreSQL + PgAdmin)
cd infra
docker compose up -d

setelah healty dan started
docker ps
http://localhost:5050

Login pakai credential yang sudah dibuat (pgadmin).
Pastikan ada DB tcm dan tabel testcases.

Kalau tabel sudah ada → database OK.

3. Pastikan Frontend Berjalan (React + Vite)
cd frontend
npm install
npm run dev

cek browser
http://localhost:5173/

VITE vX.X.X  ready in 300ms
Local: http://localhost:5173/



kill port
lsof -i :5173
ytang muncul kill 
kill -9 PID
atau ulangi
lsof -i :5174
kill -9 PID

team bisa clone dari 
git checkout master
git pull

yang belum clone
git clone <repo-url>
git checkout master


update table dari root project
psql -h localhost -p 5433 -U app -d tcm -f infra/db-init/01_create_tables.sql
