# Local + Share + Deploy — Quick commands

## 1) Jalankan infra (Postgres + pgAdmin)
cd infra && docker compose up -d
# (Menjalankan database & pgAdmin di background)

## 2) Jalankan backend (express + api)
cd backend && npm install && npm run dev
# (Jalankan ini di terminal terpisah; backend default di http://localhost:4000)

## 3) Jalankan frontend (Vite)
cd frontend && npm install && npm run dev
# (Jalankan ini di terminal terpisah; buka URL yang muncul, mis. http://localhost:5175)

## 4) Expose frontend sementara via ngrok (public URL)
# Sesuaikan PORT jika vite memilih port lain (5173/5174/5175/...)
npx ngrok http 5173
# (Ngrok akan keluarkan URL publik, share ke tim)

## 5) Serve frontend untuk LAN agar rekan jaringan bisa akses
cd frontend && npm run dev -- --host
# (Vite akan menampilkan http://<your-lan-ip>:5173 — bisa diakses oleh device di jaringan yang sama)

## 6) Commit & push perubahan ke GitHub (untuk team access)
git add . && git commit -m "update: testcase-management UI + api" && git push origin main
# (Pastikan remote sudah diset dan kamu telah login ke GitHub)

## 7) Quick deploy frontend ke Vercel (via CLI, butuh vercel login/link)
# Pastikan sudah `npm i -g vercel` dan `vercel login` sebelumnya
cd frontend && vercel --prod --confirm
# (Vercel otomatis detect Vite, build & beri URL publik — share URL ke tim)

## 8) Deploy backend (pilihan cepat: Render / Railway via GitHub integration)
# (Di dashboard Render / Railway: create new Web Service -> connect GitHub repo -> pilih branch main/master -> set start command `node server.js` atau `npm run start` -> deploy)
# Tidak ada 1-line universal karena butuh web UI auth; gunakan langkah di UI Render/Railway.

