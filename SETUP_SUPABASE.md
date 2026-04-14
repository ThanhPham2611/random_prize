# Supabase + Vercel Setup

## 1. Tao project Supabase

Tao mot project moi trong Supabase va mo `SQL Editor`.

## 2. Chay SQL khoi tao

Copy noi dung trong [supabase-setup.sql](/d:/random/supabase-setup.sql) vao SQL Editor roi chay.

Bang `app_config` se luu mot dong cau hinh duy nhat:

- `id = 1`
- `win_rate = 0.4000` tuong ung 40%

## 3. Lay cac gia tri environment

Trong Supabase project, ban can:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Trong Vercel project, them them:

- `ADMIN_PASSWORD`

`ADMIN_PASSWORD` la mat khau ban se nhap trong `admin.html` de cap nhat ti le.

## 4. Them env vao Vercel

Tai Vercel Project Settings -> Environment Variables, them:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Sau do redeploy 1 lan de deployment moi doc duoc cac env nay.

## 5. Duong dan su dung

- Trang quay thuong: `/`
- Trang admin: `/admin.html`
- API quay thuong: `/api/spin`
- API admin: `/api/admin/rate`

## 6. Luong hoat dong

- Nguoi dung bam quay o trang chu
- Frontend goi `/api/spin`
- API doc `win_rate` tu Supabase
- Server tu random ket qua trúng / khong trung
- `admin.html` cho phep tai va cap nhat `win_rate` ma khong can deploy lai

## 7. Luu y bao mat

- Khong dua `SUPABASE_SERVICE_ROLE_KEY` vao frontend
- Chi API Vercel duoc dung secret nay
- `admin.html` gui mat khau admin len API de xac thuc
- Neu can an toan hon nua, sau nay co the doi sang Supabase Auth hoac Vercel Authentication
