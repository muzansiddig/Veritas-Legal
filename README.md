# Veritas Legal Intelligence - Veritas للذكاء القانوني التحليلي

Official Enterprise Legal Intelligence Platform. A modular monolith built for judicial-grade precision, security, and traceability.

---

## 🌍 Language / اللغة

[English](#english-guide) | [العربية](#دليل-التشغيل-باللغة-العربية)

---

## English Guide

### 📋 Prerequisites
To run the complete integrated system (Frontend + Backend + Database), ensure you have the following installed:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Essential for full integration).
2. **[Node.js 18+](https://nodejs.org/)** (Optional, for local frontend dev).
3. **[Python 3.9+](https://www.python.org/)** (Optional, for local backend dev).

### 🚀 Quick Start (Complete System)
The recommended way to run the entire stack is using **Docker Compose**. This automatically sets up the PostgreSQL database, the FastAPI backend, and the React frontend.

1. **Clone/Open the Project Folder**: `c:\Users\muzanali\OneDrive\Desktop\leagalplus`
2. **Launch Terminal** (PowerShell or Bash).
3. **Execute the Build Command**:
   ```powershell
   docker-compose up --build
   ```
4. **Access the Platform**:
   - **User Interface (Frontend)**: [http://localhost](http://localhost)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 🏗️ Integrated Architecture (Version 2.0 - Enterprise)
- **Modular Monolith**: Organized into domain-driven packages (`app/core`, `app/auth`, `app/cases`, `app/analysis`).
- **Database**: PostgreSQL (Production-grade persistent storage with SSL support).
- **Backend API (v1)**: FastAPI (Python) - Professional `/api/v1/` versioning.
- **Enterprise Security**: Strict **Firm Isolation**, Zero-Trust **RBAC**, and Cryptographic **Audit Logs**.
- **AI Engine (Async)**: High-performance asynchronous pipeline with structural job tracking and reasoning paths.
- **Frontend**: Vite + React (TypeScript) - Judicial-grade redesign.
- **Reporting**: Professional HTML dossier exporter for legal review.
- **PWA**: Ready for offline access and mobile installation.

---

## دليل التشغيل باللغة العربية

### 🛠️ التحميلات والمتطلبات الأساسية
لتشغيل النظام بالكامل كبيئة متكاملة، يجب توفر البرامج التالية:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: (أساسي ومطلوب) لإدارة قاعدة البيانات والواجهات الخلفية والأمامية معاً.
2. **[Node.js](https://nodejs.org/)**: (اختياري) إذا كنت ترغب في تشغيل الواجهة الأمامية بشكل منفصل للتطوير.
3. **[Python 3.9+](https://www.python.org/)**: (اختياري) إذا كنت ترغب في تشغيل الخادم الخلفي بشكل منفصل.

### 🚀 خطوات التشغيل (النظام المتكامل)
أفضل طريقة لضمان عمل "قاعدة البيانات + الواجهة الخلفية + الواجهة الأمامية" كنظام واحد هي استخدام **Docker Compose**:

1. **افتح مجلد المشروع**: `c:\Users\muzanali\OneDrive\Desktop\leagalplus`
2. **افتح واجهة الأوامر (Terminal/PowerShell)** بموقع المشروع.
3. **قم بتنفيذ أمر البناء والتشغيل**:
   ```powershell
   docker-compose up --build
   ```
4. **الوصول للنظام**:
   - **واجهة المستخدم الرئيسية**: [http://localhost](http://localhost)
   - **توثيق البرمجية الخلفية (API)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 🧩 مكونات النظام
*   **قاعدة البيانات**: PostgreSQL (مدارة تلقائياً بواسطة Docker).
*   **الخادم الخلفي (Backend)**: FastAPI (يدير الذكاء الاصطناعي والتشفير والصلاحيات).
*   **الواجهة الأمامية (Frontend)**: React (مصممة بمعايير قضائية احترافية).
*   **تطبيق الويب التقدمي (PWA)**: يدعم العمل بدون إنترنت والتنصيب على أجهزة الموبايل.

---

## 🧪 Verification / التحقق
To verify the backend integrity / للتحقق من سلامة النظام الخلفي:
```powershell
cd backend
python -m pytest tests/test_api.py -v
```

## 🔐 Configuration / الإعدادات
Variables are managed in `.env` files within the `backend/` and `frontend/` directories.
يتم إدارة المتغيرات في ملفات `.env` داخل المجلدات المعنية.
# Veritas-Legal
