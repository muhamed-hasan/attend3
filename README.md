This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# attend2
# attend3
# attend3

---

## 📚 Database Tables Documentation

### Attendance Table (`table3`)

| Column       | Type                        | Description (EN)                                  | الوصف (AR)                                 |
|--------------|-----------------------------|---------------------------------------------------|---------------------------------------------|
| id           | character varying           | Employee ID (unique for each employee)            | رقم الموظف (معرّف فريد لكل موظف)           |
| time         | timestamp without time zone | Full date and time of record                      | التاريخ والوقت الكامل للتسجيل               |
| date         | date                        | Date only                                         | التاريخ فقط                                 |
| time2        | time without time zone      | Time only                                         | الوقت فقط                                   |
| fname        | character varying           | Employee's first name                             | الاسم الأول للموظف                          |
| lname        | character varying           | Employee's last name                              | اسم العائلة للموظف                          |
| name         | character varying           | Full name (fname + lname)                         | الاسم الكامل للموظف (fname + lname)         |
| rname        | character varying           | Device/reader name                                | اسم الجهاز أو القارئ                        |
| group        | character varying           | Department/group                                  | القسم أو المجموعة                           |
| card_number  | character varying           | Card or smart card number                         | رقم الكارت أو البطاقة الذكية                |
| pic          | character varying           | Photo file/link                                   | رابط أو اسم صورة الموظف (إن وجد)            |
| dev          | character varying           | Device type/source (e.g., Att)                    | نوع الجهاز أو مصدر التسجيل                  |

**Sample Data:**

| id | time                | date       | time2    | fname | lname | name        | rname          | group           | card_number           | pic | dev |
|----|---------------------|------------|----------|-------|-------|-------------|----------------|------------------|-----------------------|-----|-----|
| 5  | 2025-04-14 17:00:32 | 2025-04-14 | 17:00:32 | Ahmed | Hosny | Ahmed Hosny | Cardreader 01  | All Departments  | 18446744073609551917  |     | Att |
| 5  | 2025-04-14 17:00:40 | 2025-04-14 | 17:00:40 | Ahmed | Hosny | Ahmed Hosny | Cardreader 01  | All Departments  | 18446744073609551917  |     | Att |

---

### Employee Details Table (`details`)

| Column      | Type              | Description (EN)                                  | الوصف (AR)                                 |
|-------------|-------------------|---------------------------------------------------|---------------------------------------------|
| id          | INTEGER PRIMARY KEY| Employee ID (same as in table3)                   | رقم الموظف (معرّف فريد، نفس المستخدم في table3) |
| first_name  | VARCHAR(100)      | Employee's first name                             | الاسم الأول للموظف                          |
| last_name   | VARCHAR(100)      | Employee's last name                              | اسم العائلة للموظف                          |
| department  | VARCHAR(100)      | Department/group                                  | القسم أو المجموعة                           |
| shift       | VARCHAR(50)       | Shift (Day/Night), may be empty                   | الشيفت (صباحي/مسائي) - قد يكون فارغاً       |

**Sample Data:**

| id | first_name | last_name | department | shift |
|----|------------|-----------|------------|-------|
| 1  | Mahmoud    | Saad1     | SDS        |       |
| 2  | Mahmoud    | Abdeltwab | Heidelberg |       |
| 3  | Mohamed    | Salah     | Heidelberg |       |
| 5  | Ahmed      | Hosny     | SDS        |       |
| 7  | Hassan     | Mohammed Rashed | Naser | Day   |
| 22 | Sayed      | Mohammmed Hussein | Naser | Night |

---

> **Note:**
> - The `id` field is the link between `table3` and `details` (employee attendance and employee info).
> - Make sure your SQL queries join on `a.id = e.id`.
> - All text fields are stored as `character varying` or `VARCHAR` unless otherwise noted.
> - All timestamps are in UTC unless otherwise specified.

---
