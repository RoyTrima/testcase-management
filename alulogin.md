flowchart TD
    A[User membuka web app] --> B{Sudah login?}
    B -- Tidak --> C[LoginPage.jsx tampil]
    C --> D[User input username & password]
    D --> E[POST /api/auth/login ke backend]
    E --> F{Login valid?}
    F -- Ya --> G[Backend kirim JWT token]
    G --> H[Token disimpan di localStorage & state]
    H --> I[TestcasesPage.jsx tampil, fetch /api/testcases]
    F -- Tidak --> J[Error ditampilkan di LoginPage]

    B -- Ya --> I

    I --> K{User pilih aksi}
    K -- Tambah testcase --> L[AddTestcasePage.jsx]
    L --> M[POST /api/testcases + token header]
    M --> N[Backend verifikasi token, tambah row dengan created_by = user.id]
    N --> I

    K -- Edit testcase --> O[EditTestcasePage.jsx]
    O --> P[PUT /api/testcases/:id + token header]
    P --> Q[Backend verifikasi token, update jika created_by = user.id]
    Q --> I

    K -- Delete testcase --> R[Klik Delete di TestcaseList.jsx]
    R --> S[DELETE /api/testcases/:id + token header]
    S --> T[Backend verifikasi token, delete jika created_by = user.id]
    T --> I

    I --> U[Logout]
    U --> V[Hapus token, redirect ke LoginPage.jsx]


via postman
Register
POST http://localhost:4000/api/auth/register
Headers:
Content-Type: application/json

Body (raw JSON):
{
  "username": "user1",
  "password": "123456"
}


login user
POST http://localhost:4000/api/auth/login
Headers:
Content-Type: application/json

Body (raw JSON):
{
  "username": "user1",
  "password": "123456"
}

sample response
{
  "token": "<JWT_TOKEN>"
}

create testcase via postman
POST http://localhost:4000/api/testcases
Headers:
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

Body (raw JSON):
{
  "title": "Test 1",
  "description": "Desc 1",
  "severity": "high",
  "priority": "urgent",
  "status": "draft",
  "expected_result": "Expected output"
}


update testcase via postman
PUT http://localhost:4000/api/testcases/1
Headers:
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

Body (raw JSON):
{
  "title": "Updated Test",
  "description": "Updated Desc",
  "severity": "medium",
  "priority": "normal",
  "status": "ready",
  "expected_result": "Updated expected output"
}


delete testcase
DELETE http://localhost:4000/api/testcases/1
Headers:
Authorization: Bearer <JWT_TOKEN>
