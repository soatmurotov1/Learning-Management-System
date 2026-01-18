# 🔐 JWT Token Authentication - Tugallandi!

## 📋 O'zgarishlar

### ✅ Qo'shilgan JWT Autentifikatsiya

- ✅ Register, verify, login **PUBLIC** (token talab qilmaydi)
- ✅ Mentor profile **PROTECTED** (token kerak)
- ✅ Homework **PROTECTED** (token kerak)
- ✅ JWT token 24 soat muddatli
- ✅ Bearer token orqali olib borish

### ✅ Yangi Fayllar Yaratildi

```
src/common/decorator/is-public.decorator.ts - Public endpointlar uchun
src/common/guards/jwt-auth.guard.ts        - JWT autentifikatsiya tekshiruvi
src/common/strategies/jwt.strategy.ts      - Passport JWT strategiyasi
src/types/express.d.ts                     - Express Request type kengaytirmasi
```

### ✅ O'zgartirilgan Fayllar

```
src/modules/users/users.service.ts              - Token qaytarish
src/modules/users/users.controller.ts           - @IsPublic() dekorator
src/modules/users/users.module.ts               - JwtModule qo'shildi
src/modules/mentor_profile/mentor_profile.controller.ts  - JwtAuthGuard
src/modules/homework/homework.controller.ts     - JwtAuthGuard va @ApiBearerAuth
src/modules/homework/homework.service.ts        - userId parametri
src/modules/modules.module.ts                   - JwtStrategy provider
src/app.module.ts                               - APP_GUARD JwtAuthGuard
```

---

## 🔑 Token Olaish Jarayoni

### 1️⃣ Ro'yxatdan O'tish (TOKEN KERAK EMAS)

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "password123",
    "fullName": "John Doe",
    "role": "STUDENT"
  }'
```

**Javob:**

```json
{
  "message": "Foydalanuvchi ro'yxatdan o'tdi. OTP SMS orqali yuborildi",
  "userId": 1,
  "success": true
}
```

### 2️⃣ OTP Tasdiqlash (TOKEN KERAK EMAS)

```bash
curl -X POST http://localhost:3000/users/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "otp": "123456"
  }'
```

### 3️⃣ Login va Token Olish (TOKEN KERAK EMAS)

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "password123"
  }'
```

**Javob:**

```json
{
  "message": "Muvaffaqiyatli kirish",
  "user": {
    "id": 1,
    "phone": "+998901234567",
    "fullName": "John Doe",
    "role": "STUDENT",
    "image": null,
    "isVerified": true,
    "createdAt": "2026-01-18T12:34:56.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true
}
```

### 4️⃣ Token Orqali Protected Endpoint Qo'ng'iroq (TOKEN KERAK!)

```bash
curl -X GET http://localhost:3000/users/profile/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📊 Endpoint Status Matritsa

| Endpoint                       | Method | Public? | Token  | Roli                     |
| ------------------------------ | ------ | ------- | ------ | ------------------------ |
| `/users/register`              | POST   | ✅ YES  | ❌ NO  | -                        |
| `/users/verify`                | POST   | ✅ YES  | ❌ NO  | -                        |
| `/users/login`                 | POST   | ✅ YES  | ❌ NO  | -                        |
| `/users/profile/:id`           | GET    | ❌ NO   | ✅ YES | -                        |
| `/homework`                    | POST   | ❌ NO   | ✅ YES | Any                      |
| `/homework`                    | GET    | ❌ NO   | ✅ YES | Any                      |
| `/homework/:id`                | GET    | ❌ NO   | ✅ YES | Any                      |
| `/homework/:id`                | PATCH  | ❌ NO   | ✅ YES | Any                      |
| `/homework/:id`                | DELETE | ❌ NO   | ✅ YES | Any                      |
| `/mentor_profile`              | POST   | ❌ NO   | ✅ YES | ADMIN, MENTOR            |
| `/mentor_profile`              | GET    | ❌ NO   | ✅ YES | ADMIN, MENTOR, ASSISTANT |
| `/mentor_profile/:id`          | GET    | ✅ YES  | ❌ NO  | -                        |
| `/mentor_profile/user/:userId` | GET    | ✅ YES  | ❌ NO  | -                        |
| `/mentor_profile/me`           | GET    | ❌ NO   | ✅ YES | MENTOR                   |
| `/mentor_profile/:id`          | PATCH  | ❌ NO   | ✅ YES | ADMIN, MENTOR            |
| `/mentor_profile/:id`          | DELETE | ❌ NO   | ✅ YES | ADMIN, MENTOR            |

---

## 🧪 Test Scenariyolar

### Test 1: Login qilib Token Olish

```bash
# 1. Register
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"+998901111111","password":"pass123","fullName":"Test","role":"MENTOR"}'

# 2. Verify (OTP ni copy-paste qiling)
curl -X POST http://localhost:3000/users/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"+998901111111","otp":"123456"}'

# 3. Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+998901111111","password":"pass123"}'

# Javobdan `accessToken` copy qiling
```

### Test 2: Token bilan Protected Endpoint

```bash
# Token bilan
curl -X GET http://localhost:3000/users/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Token siz (xato)
curl -X GET http://localhost:3000/users/profile/1
# => 401 Unauthorized: "Token taqdim etilmadi yoki noto'g'ri"
```

### Test 3: Mentor Profile bilan Role-Based Access

```bash
# Token bilan mentor profil yaratish
curl -X POST http://localhost:3000/mentor_profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "about": "10+ years experience",
    "job": "Senior Developer",
    "telegram": "@myhandle"
  }'
```

### Test 4: Homework bilan Token

```bash
# Token kerak
curl -X POST http://localhost:3000/homework \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task 1",
    "description": "Complete chapter 1",
    "dueDate": "2026-02-01T10:00:00Z"
  }'
```

### Test 5: Public Mentor Profile

```bash
# Token KERAK EMAS (public)
curl -X GET http://localhost:3000/mentor_profile/1

# Token KERAK EMAS (public)
curl -X GET http://localhost:3000/mentor_profile/user/1
```

---

## 🔐 Security Features

### 1. JWT Token Struktura

```json
{
  "sub": 1, // User ID
  "phone": "+998901234567",
  "role": "MENTOR",
  "fullName": "John Doe",
  "iat": 1705592400, // Issued at
  "exp": 1705678800 // Expires in 24 hours
}
```

### 2. Bearer Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. @IsPublic() Dekorator

```typescript
@IsPublic()
@Post('register')
async register(@Body() dto: RegisterDto) {
  // Token talab qilmaydi
}
```

### 4. JwtAuthGuard

- Avtomatik JWT tekshiradi
- @IsPublic() ni qayd qiladi
- `req.user` ga payload joylashtirydi

---

## 📝 Token Environment Variables

`.env` faylida:

```env
JWT_SECRET=your-secret-key-here
```

Default: `your-secret-key` (production uchun o'zgartiring!)

---

## 🧠 Qanday Ishlaydi?

### 1. Login Jarayoni

```
User login qiladi
    ↓
Service bcrypt bilan parolni tekshiradi
    ↓
Service JWT token yaratadi (24 soat)
    ↓
Token client ga qaytariladi
```

### 2. Protected Request Jarayoni

```
Client: Bearer token bilan request jo'natadi
    ↓
JwtAuthGuard: Token tekshiradi
    ↓
JwtStrategy: Token decode qiladi
    ↓
Request.user ga payload joylashtiriladi
    ↓
Controller: Roli tekshiradi (@Roles)
    ↓
Service: Amaliy logika bajariladi
```

### 3. Public Endpoint Jarayoni

```
Client: Token BEZ request jo'natadi
    ↓
JwtAuthGuard: @IsPublic() ni ko'radi
    ↓
Guard skip qiladi (token kerak emas)
    ↓
Controller: To'g'ri muddini bajaradi
```

---

## ✅ Tekshiruv Ro'yxati

- ✅ Register - public (token kerak emas)
- ✅ Verify - public (token kerak emas)
- ✅ Login - public, token qaytaradi
- ✅ Profile - protected (token kerak)
- ✅ Mentor Profile - protected (token kerak)
- ✅ Homework - protected (token kerak)
- ✅ Public mentor profile o'qish - public
- ✅ Role-based access control ishlamoqda
- ✅ JWT token 24 soat vaqt tugashiga ega
- ✅ Token siz request 401 qaytaradi

---

## 🚀 Swagger UI da Test Qilish

1. http://localhost:3000/api ga boring
2. "Authorize" tugmasini bosing
3. "Bearer " dan keyin token qo'ying
4. Authorize bosing
5. Protected endpoint bo'ng'iroq qiling (token avtomatik qo'shiladi)

---

## 📞 Foydalanuvchi Almashinuvi

### Register -> Verify -> Login -> Token -> Protected Endpoints

```
Step 1: /users/register          [PUBLIC] -> userId
         ↓
Step 2: /users/verify            [PUBLIC] -> success
         ↓
Step 3: /users/login             [PUBLIC] -> accessToken
         ↓
Step 4: /mentor_profile/*        [PROTECTED] + Token
Step 5: /homework/*              [PROTECTED] + Token
```

---

## 🎯 Saralab Olish

- ✅ **Register/Verify/Login** - Hech qaysi token kerak emas (PUBLIC)
- ✅ **Mentor Profile** - Token kerak (PROTECTED) + Role-based
- ✅ **Homework** - Token kerak (PROTECTED)
- ✅ **Public Mentor Views** - Token kerak emas (PUBLIC READ)
- ✅ **JWT Token** - 24 soat amal qiladi
- ✅ **Error Handling** - 401 Unauthorized token siz

---

**Status:** ✅ Complete va Ready to Use
**Version:** 2.0.0 (JWT Authentication Added)
**Last Updated:** 2026-01-18
