# User Accounts Documentation

## Admin Account

| Email            | Password  |
| ---------------- | --------- |
| admin1@gmail.com | admin1123 |

## Engineering Department

### Manager

| Name     | Email          | Password | Role    | Department  |
| -------- | -------------- | -------- | ------- | ----------- |
| Rudi Har | rudi@gmail.com | rudirudi | MANAGER | Engineering |

### Supervisors

| Name     | Email           | Password   | Role       | Department  |
| -------- | --------------- | ---------- | ---------- | ----------- |
| Dimas Fi | dimas@gmail.com | dimasDimas | SUPERVISOR | Engineering |
| Mirza    | mirza@gmail.com | mirza      | SUPERVISOR | Engineering |

### Employees

| Name                | Email               | Password  | Role     | Department  |
| ------------------- | ------------------- | --------- | -------- | ----------- |
| Engineer employee 1 | employee1@gmail.com | employee1 | EMPLOYEE | Engineering |
| Engineer employee 2 | employee2@gmail.com | employee2 | EMPLOYEE | Engineering |

## Marketing Department

### Manager

| Name | Email          | Password | Role    | Department |
| ---- | -------------- | -------- | ------- | ---------- |
| bayu | bayu@gmail.com | bayu  | MANAGER | Marketing  |

### Supervisor

| Name | Email          | Password | Role       | Department |
| ---- | -------------- | -------- | ---------- | ---------- |
| Rafa | rafa@gmail.com | rafa1234 | SUPERVISOR | Marketing  |

### Employees

| Name                | Email               | Password  | Role     | Department |
| ------------------- | ------------------- | --------- | -------- | ---------- |
| Engineer employee 3 | employee3@gmail.com | employee3 | EMPLOYEE | Marketing  |
| Engineer employee 4 | employee4@gmail.com | employee4 | EMPLOYEE | Marketing  |

## User privilages

### 1. Admin

-   mengajukan pemesanan / reservasi peminjaman kendaraan
-   generate laporan tahunan logbook excel
-   melihat setiap aktivitas akun
-   melihat grafik, daftar kendaraan, booking
-   input data bbm, service kendaaraan (API's only, not implement in web yet)

### 2. user as manager

-   reject / approve pengajuan level 2 setelah pengajuan level 1 diterima
-   melihat grafik, daftar kendaraan, booking
-   input data bbm, service kendaaraan (API's only, not implement in web yet)

### 3. user as supervisor

-   reject / approve pengajuan level 1
-   melihat grafik, daftar kendaraan, booking
-   input data bbm, service kendaaraan (API's only, not implement in web yet)

### 4. user as employee

-   melihat grafik, daftar kendaraan, booking
-   input data bbm, service kendaaraan (API's only, not implement in web yet)
