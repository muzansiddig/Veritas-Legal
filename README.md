
# 🌐 Veritas Legal Intelligence

**Official Enterprise Legal Intelligence Platform**  
A **modular monolith** designed for **judicial-grade precision, security, and traceability**, targeted at law firms and legal consultants.  

---

## 📌 Table of Contents
- [🌍 Language](#-language)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start-complete-integrated-system)
- [🏗️ Architecture](#-integrated-architecture-enterprise-version-20)
- [🧩 System Components](#-system-components)
- [🧪 Verification](#-verification--testing)
- [🔐 Configuration](#-configuration)
- [📈 Features](#-features)
- [🐳 Docker Deployment](#-docker-deployment)
- [💡 Next Steps for Production](#-next-steps-for-production)
- [📚 Conclusion](#-conclusion)

---

## 🌍 Language
English only, fully documented.

---

## 📋 Prerequisites
Ensure the following software is installed:

- **Docker Desktop** (essential)  
- **Node.js 18+** (optional, for frontend development)  
- **Python 3.9+** (optional, for backend development)  

---

## 🚀 Quick Start (Complete Integrated System)
> Recommended method: **Docker Compose**

<details>
<summary>Steps to Run the Full System</summary>

1. Clone or open the project folder:

```text
c:\Users\muzanali\OneDrive\Desktop\leagalplus
````

2. Open Terminal (PowerShell or Git Bash) in project directory.

3. Build and run all services:

```bash
docker-compose up --build
```

4. Access the platform:

* **Frontend UI:** [http://localhost](http://localhost)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

</details>

---

## 🏗️ Integrated Architecture (Enterprise Version 2.0)

<details>
<summary>Click to expand architecture details</summary>

**Backend:** FastAPI (Python) with `/api/v1/` versioning, handling authentication, AI, case logic, and RBAC.

**Database:** PostgreSQL (production-grade, SSL-enabled, persistent).

**Frontend:** React + TypeScript + Vite, PWA-ready for offline & mobile.

**AI Engine:** Asynchronous pipeline with reasoning paths (XAI), OCR, entity extraction, risk evaluation.

**Enterprise Security:**

* Multi-Tenant Architecture (Full firm isolation)
* Role-Based Access Control (RBAC)
* Cryptographic Audit Logs

**Reporting:** Professional HTML dossier export.

</details>

---

## 🧩 System Components

<details>
<summary>Click to expand components</summary>

| Component     | Description                                                |
| ------------- | ---------------------------------------------------------- |
| **Database**  | PostgreSQL, containerized, persistent storage, SSL-enabled |
| **Backend**   | FastAPI, manages authentication, AI, cases, RBAC, audit    |
| **Frontend**  | React + TypeScript, judicial-grade design                  |
| **AI Engine** | Async jobs, evidence analysis, XAI reasoning paths         |
| **PWA**       | Offline support, mobile installable, IndexedDB storage     |
| **Reporting** | Export case dossiers in HTML                               |

</details>

---

## 🧪 Verification / Testing

<details>
<summary>Click to see testing instructions</summary>

Run backend tests to verify integrity:

```bash
cd backend
python -m pytest tests/test_api.py -v
```

</details>

---

## 🔐 Configuration

<details>
<summary>Click to expand configuration</summary>

* Environment variables managed via `.env` files in `backend/` and `frontend/`.
* Configure: database connection, JWT secrets, Firebase credentials, AI model paths.

</details>

---

## 📈 Features

<details>
<summary>Click to expand features</summary>

**For Law Firms:**

* Centralized case management
* AI-powered evidence analysis
* Secure multi-tenant environment
* RBAC and audit logging
* Billing and task management
* Offline PWA support

**For Developers:**

* Modular Monolith architecture
* Domain-Driven Design
* Testable and maintainable code
* Clear documentation
* Horizontal scalability

</details>

---

## 🐳 Docker Deployment

<details>
<summary>Click to see deployment instructions</summary>

**Services (docker-compose.yml):**

* `db` → PostgreSQL
* `backend` → FastAPI
* `frontend` → React + Nginx

**Features:**

* Multi-stage builds for smaller images
* Health checks
* Auto restart
* Persistent volumes
* Integrated logging & monitoring

Run system:

```bash
docker-compose up --build
```

</details>

---

## 💡 Next Steps for Production

* Stripe integration (subscription billing)
* Custom domains (e.g., firm1.veritas.com)
* Email notifications via SendGrid/Mailgun
* Cloud deployment: AWS, Azure, Railway
* SSL certificates (Let's Encrypt)
* Monitoring with Sentry / Prometheus
* Automated database backups

---

## 📚 Conclusion

**Veritas Legal Intelligence** is a **production-ready SaaS platform** that combines:

* Enterprise-grade **security & auditing**
* AI-powered **evidence analysis**
* Multi-Tenant architecture
* Modular, testable, scalable code
* Modern stack: FastAPI + React + TypeScript + PostgreSQL + Docker

Ready for **real-world law firms and enterprise deployment**.
