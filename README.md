# SecureAI – AI-Powered Application Security & Code Review Platform

**Intelligent Code Analysis | Automated Vulnerability Detection | AI-Assisted Remediation**

SecureAI is an AI-powered application security platform designed to help developers identify, analyze, and remediate security vulnerabilities in their source code.

The platform combines automated security analysis, AI-assisted code reviews, vulnerability management, and remediation workflows to improve application security throughout the software development lifecycle.

SecureAI aims to make application security more accessible, efficient, and developer-friendly by integrating security analysis into the code review process.

---

## 1. Project Overview

Modern software applications frequently contain security vulnerabilities that can expose sensitive information, compromise application integrity, and create opportunities for unauthorized access.

Traditional security testing often requires specialized knowledge, multiple tools, and significant manual effort.

SecureAI addresses these challenges by providing an integrated platform that supports:

- Automated source code security analysis.
- AI-powered code review.
- Vulnerability identification and classification.
- Security findings management.
- AI-assisted remediation recommendations.
- GitHub repository integration.
- Centralized security scan management.

The platform is designed to support developers and security professionals in identifying potential security weaknesses earlier in the development lifecycle.

## 2. Key Features

### AI-Powered Code Review
- AI-assisted source code analysis.
- Identification of potentially insecure coding patterns.
- Security-focused code review.
- Context-aware vulnerability analysis.
- Actionable security recommendations.

### Automated Vulnerability Detection
- Detection and classification of security issues.
- Identification of potentially vulnerable code.
- Centralized vulnerability reporting.
- Security findings tracking.
- Scan-based vulnerability management.

### Intelligent Remediation
- AI-assisted remediation recommendations.
- Suggested approaches to fix identified vulnerabilities.
- Security improvement guidance.
- Developer-focused remediation workflows.

### GitHub Integration
- GitHub repository connectivity.
- Repository management.
- Repository-based security scanning.
- Centralized management of connected repositories.

### Authentication and Access Management
- User authentication.
- Secure API access.
- Authentication-related security controls.
- Protected application endpoints.

### Security Dashboard
- Centralized security management.
- Scan monitoring.
- Vulnerability tracking.
- Security analysis results.

---

## 3. Technology Stack

### Frontend
- React.js
- JavaScript / TypeScript
- Vite
- HTML5
- CSS3
- npm

### Backend
- Python
- FastAPI
- Uvicorn
- RESTful APIs
- Database integration

### Security & Analysis
- Application Security Testing
- Static Application Security Analysis
- Vulnerability Assessment
- AI-Assisted Security Analysis
- Secure Code Review

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Postman

---

## 4. System Architecture

SecureAI follows a modular architecture that separates the user interface, backend API, AI analysis, and security analysis components.

```text
                  SECUREAI PLATFORM
                         |
             +-----------+-----------+
             |                       |
         FRONTEND                 BACKEND
         React + Vite             FastAPI
             |                       |
             |                +------+------+
             |                |             |
             |             REST APIs     Authentication
             |                |
             |        +-------+-------+
             |        |       |       |
             |      Scans  Repos  Vulnerabilities
             |        |       |       |
             |        +-------+-------+
             |                |
             |       AI & Security Analysis
             |                |
             +----------------+
                      |
               Security Results
                      |
              User Dashboard
```

The frontend communicates with the backend through REST APIs. The backend manages authentication, repositories, scanning operations, vulnerabilities, and remediation workflows.

---

## 5. Project Directory Structure

```text
SecureAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── ai_review.py
│   │   │       ├── auth.py
│   │   │       ├── remediation.py
│   │   │       ├── repositories.py
│   │   │       ├── scans.py
│   │   │       └── vulnerabilities.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── schemas/
│   │   │
│   │   └── main.py
│   │
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── security_engine/       # Source code available on request
│
├── ai_engine/             # Source code available on request
│
├── tests/
│
├── workers/
│
├── .gitignore
│
├── Dockerfile
│
├── docker-compose
│
└── README.md
```

**Note:** Certain internal source-code components are maintained separately and are not included in this repository. Refer to the Contact section for access requests.

---

# 6. Installation and Setup

This section explains how to install and run the SecureAI frontend and backend locally.

## Prerequisites

Install the following before starting:

| Requirement | Purpose |
|---|---|
| Python 3.10+ | Backend development |
| Node.js 18+ | Frontend development |
| npm | Frontend dependencies |
| Git | Version control |
| VS Code | Development environment |

Verify the installations:

```bash
python --version
```

```bash
node --version
```

```bash
npm --version
```

---

## 7. Clone the Repository

Clone the SecureAI repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd SecureAI
```

---

## 8. Frontend Setup

The frontend is developed using React and Vite.

### Step 1: Navigate to Frontend

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs the dependencies specified in `package.json` and `package-lock.json`.

### Step 3: Configure Environment Variables

If your frontend requires environment variables, create a `.env` file inside the frontend directory.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Make sure the variable names match the frontend configuration.

### Step 4: Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in your terminal.

Typically:

```text
http://localhost:5173
```

Open this URL in your browser to access the SecureAI frontend.

---

## 9. Backend Setup

The backend is developed using Python and FastAPI.

### Step 1: Open a New Terminal

Navigate to the backend directory from the project root:

```bash
cd backend
```

### Step 2: Create a Virtual Environment

Windows:

```bash
python -m venv venv
```

Linux / macOS:

```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Windows CMD:

```cmd
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

### Step 4: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables

Create a `.env` file inside the backend directory.

Add the environment variables required by the backend configuration.

For example:

```env
DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
```

If GitHub integration or AI services require credentials, configure the corresponding variables according to the backend configuration.

**Important:** Never commit API keys, database credentials, access tokens, or other sensitive information to GitHub.

### Step 6: Start the FastAPI Server

From the backend directory, execute:

```bash
uvicorn app.main:app --reload
```

The backend server should start at:

```text
http://localhost:8000
```

### Step 7: Access API Documentation

FastAPI automatically provides interactive API documentation.

Swagger UI:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

Use Swagger UI to explore and test the available API endpoints.

---

## 10. Running SecureAI Locally

To run the complete application, start both servers independently.

**Terminal 1 – Backend**

```bash
cd SecureAI/backend

# Activate virtual environment
.\venv\Scripts\activate

# Start backend
uvicorn app.main:app --reload
```

**Terminal 2 – Frontend**

```bash
cd SecureAI/frontend

# Install dependencies if not already installed
npm install

# Start frontend
npm run dev
```

Access the application through:

| Component | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Swagger API Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

Ensure the frontend API configuration points to the running backend server.

---

## 11. API Modules

The backend organizes its functionality into modular API routes.

| Module | File | Responsibility |
|---|---|---|
| Authentication | auth.py | User authentication |
| AI Review | ai_review.py | AI-assisted code review |
| Remediation | remediation.py | Vulnerability remediation |
| Repositories | repositories.py | Repository management |
| Scans | scans.py | Security scan management |
| Vulnerabilities | vulnerabilities.py | Vulnerability management |

The API structure helps maintain separation of concerns and makes the backend easier to maintain and extend.

---

## 12. Security Considerations

SecureAI follows security-conscious development practices.

Important considerations include:

- Protect sensitive environment variables.
- Avoid exposing API credentials in frontend code.
- Implement appropriate authentication and authorization.
- Validate incoming API requests.
- Handle exceptions without exposing sensitive internal information.
- Follow secure coding practices.
- Protect repository access tokens.
- Apply appropriate input validation and sanitization.
- Review AI-generated remediation recommendations before applying them.

Security testing should only be performed on systems and repositories for which appropriate authorization has been obtained.

---

## 13. Current Development Scope

SecureAI is designed as a modular application security platform.

Its development focuses on:

1. Frontend application and dashboard.
2. Backend API and application logic.
3. AI-assisted code review.
4. Automated security analysis.
5. Vulnerability identification and management.
6. Intelligent remediation workflows.
7. GitHub repository integration.

The architecture is designed to support additional security capabilities and integrations as development progresses.

---

## 14. Source Code Access

Some internal components are intentionally excluded from this public repository.

The following folders are maintained separately:

- `backend/app/models/`
- `backend/app/services/`
- `ai_engine/`
- `security_engine/`

For access to the source code of these components, please contact:

**Email:** tusharkaushik0705@gmail.com

**Subject:** SecureAI – Request for Models, AI Engine & Security Engine Source Code

Please include your name, purpose of access, and relevant project details in your email.

---

## 15. Contribution Guidelines

Contributions and suggestions that improve SecureAI are welcome.

If you wish to contribute:

1. Fork the repository.
2. Create a separate feature branch.
3. Implement your changes.
4. Test the changes locally.
5. Submit a Pull Request with a clear description.

Please avoid committing sensitive information, credentials, or excluded internal components.

---

## 16. License

The licensing and distribution terms of SecureAI should be confirmed by the project owner before redistribution, modification, or commercial use.

---

## 17. Contact

**Project:** SecureAI  
**Email:** tusharkaushik0705@gmail.com

For questions, technical discussions, collaboration, or requests for excluded source-code components, please get in touch through email.

---

**SecureAI – Making Application Security Smarter, More Accessible, and Developer-Friendly.**
