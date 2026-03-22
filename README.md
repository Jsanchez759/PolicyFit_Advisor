# PolicyFit Advisor 🏢📋

**AI-powered insurance policy analysis and coverage recommendation platform**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Project Overview

PolicyFit Advisor is a production-ready full-stack application that leverages advanced AI and LLM technology to analyze commercial insurance policies and identify critical coverage gaps. It provides intelligent, tailored recommendations based on comprehensive business profiles and industry standards (NAICS codes, operations, products).

### 🎯 Core Features

- **🤖 AI-Powered Policy Analysis**: Extracts and analyzes insurance policy information using LLM integration (OpenRouter)
- **📊 Business Profile Matching**: Matches coverage against NAICS industry codes, operations, and product lines
- **🔍 Smart Gap Identification**: Intelligently identifies missing or insufficient coverage areas
- **💡 Tailored Recommendations**: Generates context-aware coverage recommendations with priority scoring
- **📈 Multi-Format Reports**: Export comprehensive analysis in PDF, HTML, or JSON formats
- **📁 Document Management**: Secure upload and processing of policy documents (PDF/DOCX)
- **🔐 Request Tracking**: Full request logging with unique IDs for debugging and auditing
- **⚡ High Performance**: Async/await architecture with efficient caching and optimized processing

## 🏗️ Architecture

The application is built with a modern, scalable architecture:

### Backend Stack (FastAPI)
- **Core Services**: 
  - Document Ingestion & Processing (PDF/DOCX support)
  - Policy Text Extraction via LLM
  - Coverage Gap Analysis Engine
  - Report Generation Pipeline (PDF, HTML, JSON)
  - Intelligent Recommendation Engine
- **Advanced Features**:
  - Structured logging with request tracing
  - LLM Client for OpenRouter/OpenAI integration
  - File Storage Management
  - CORS with regex pattern support
  - Request/Response middleware with latency tracking
  - Error handling and recovery
- **API**: RESTful with automatic Swagger/OpenAPI documentation

### Frontend Stack (React + Vite)
- **7 Feature Pages**: Landing, Upload, Business Form, Dashboard, Recommendations, Export, Workspace
- **State Management**: Zustand for centralized, efficient state
- **API Client**: Axios with interceptors for error handling
- **Custom Hooks**: useForm, useFetch for common patterns
- **Styling**: CSS modules with responsive, modern design
- **Performance**: Code splitting, lazy loading, optimized production builds

## 📂 Detailed Project Structure

```
PolicyFit_Advisor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── router.py                    # Unified API router v1
│   │   ├── core/
│   │   │   ├── config.py                    # Settings management
│   │   │   ├── logging_config.py            # Structured logging setup
│   │   │   ├── llm_client.py                # LLM/OpenRouter integration
│   │   │   └── storage.py                   # File/data storage management
│   │   ├── modules/
│   │   │   ├── ingestion/
│   │   │   │   ├── __init__.py
│   │   │   │   └── processor.py             # Document ingestion & parsing
│   │   │   ├── extraction/
│   │   │   │   ├── __init__.py
│   │   │   │   └── extractor.py             # LLM-based policy extraction
│   │   │   ├── recommendations/
│   │   │   │   ├── __init__.py
│   │   │   │   └── engine.py                # Gap analysis & recommendations
│   │   │   └── report_generation/
│   │   │       ├── __init__.py
│   │   │       └── generator.py             # Report generation (PDF/HTML/JSON)
│   │   ├── routes/
│   │   │   ├── policies.py                  # Policy endpoints
│   │   │   ├── business.py                  # Business data endpoints
│   │   │   ├── recommendations.py           # Analysis endpoints
│   │   │   └── reports.py                   # Report endpoints
│   │   ├── schemas/
│   │   │   ├── business.py                  # Business data Pydantic models
│   │   │   ├── policy.py                    # Policy Pydantic models
│   │   │   └── recommendation.py            # Analysis/recommendation models
│   │   ├── __init__.py
│   │   └── main.py                          # FastAPI app factory & middleware
│   ├── logs/                                # Auto-created log files
│   │   ├── app.log                          # All application logs
│   │   └── error.log                        # Error-only logs
│   ├── uploads/                             # Policy document uploads storage
│   ├── main.py                              # Entry point (uvicorn runner)
│   ├── requirements.txt                     # Python dependencies
│   ├── Dockerfile                           # Container image definition
│   ├── .env.example                         # Environment variables template
│   └── README.md                            # Backend-specific documentation
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx                  # Homepage & marketing
│   │   │   ├── Landing.css                  # Landing page styles
│   │   │   ├── Upload.jsx                   # Policy document upload
│   │   │   ├── Upload.css                   # Upload styles
│   │   │   ├── IntakeForm.jsx               # Business details form
│   │   │   ├── IntakeForm.css               # Form styles
│   │   │   ├── Dashboard.jsx                # Analysis results view
│   │   │   ├── Dashboard.css                # Dashboard styles
│   │   │   ├── Recommendations.jsx          # Coverage gaps & recommendations
│   │   │   ├── Recommendations.css          # Recommendations styles
│   │   │   ├── Export.jsx                   # Report download/export
│   │   │   ├── Export.css                   # Export styles
│   │   │   ├── Workspace.jsx                # Analysis history/workspace
│   │   │   └── Workspace.css                # Workspace styles
│   │   ├── components/
│   │   │   ├── Layout.jsx                   # App layout wrapper
│   │   │   └── Layout.css                   # Layout styles
│   │   ├── services/
│   │   │   └── api.js                       # Axios API client with interceptors
│   │   ├── hooks/
│   │   │   ├── useForm.js                   # Form state management hook
│   │   │   └── useFetch.js                  # Data fetching hook
│   │   ├── context/
│   │   │   └── store.js                     # Zustand global state store
│   │   ├── utils/
│   │   │   ├── validators.js                # Form validation functions
│   │   │   └── constants.js                 # Application constants
│   │   ├── styles/
│   │   │   └── index.css                    # Global styles & reset
│   │   ├── App.jsx                          # Main app component & router
│   │   └── main.jsx                         # React entry point
│   ├── public/                              # Static assets
│   ├── index.html                           # HTML template
│   ├── package.json                         # npm dependencies & scripts
│   ├── vite.config.js                       # Vite build configuration
│   ├── Dockerfile                           # Container image definition
│   ├── .env.example                         # Environment variables template
│   └── README.md                            # Frontend-specific documentation
│
├── docker-compose.yml                       # Multi-container orchestration
├── .gitignore                               # Git ignore rules
├── LICENSE                                  # MIT License
├── README.md                                # This file
├── QUICKSTART.md                            # Quick setup guide
├── TODO.md                                  # Implementation tasks & roadmap
├── BACKEND_REFACTORING.md                  # Backend architecture notes
├── LOGGING_GUIDE.md                         # Logging usage guide
└── STRUCTURE.md                             # Structure documentation
```

## 🚀 Getting Started

### Prerequisites

| Component | Requirement | Version |
|-----------|-------------|---------|
| Python | Backend runtime | 3.10+ |
| Node.js | Frontend runtime | 16+ |
| npm/yarn | Package manager | Latest |
| Docker | Containerization (optional) | 20.10+ |

### 📋 Quick Start - Local Development

#### Option 1: Using `uv` (Recommended for Python)

```bash
# Backend setup
cd backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings (especially LLM API key)
uv run uvicorn main:app --reload
```

#### Option 2: Using Standard Python venv

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
python main.py
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

**Access the application:**
- 🎨 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:8000
- 📚 API Docs (Swagger): http://localhost:8000/docs
- 📖 API Docs (ReDoc): http://localhost:8000/redoc

### 🐳 Docker Setup (Recommended for Production)

```bash
# From project root
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs

# To stop:
docker-compose down
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False

# API Configuration
PROJECT_NAME=PolicyFit Advisor
VERSION=1.0.0
API_V1_PREFIX=/api/v1

# LLM Configuration (OpenRouter)
# Get API key from: https://openrouter.ai
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_CHAT_MODEL=openrouter/auto
OPENROUTER_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-vl-1b-v2:free

# CORS (comma-separated or JSON list)
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]
ALLOWED_ORIGIN_REGEX=

# File Upload
MAX_UPLOAD_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=["pdf","docx","doc"]

# Database (SQLite by default, can use PostgreSQL)
DATABASE_URL=sqlite:///./policyfit.db
```

### Frontend Environment Variables (.env.local)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=PolicyFit Advisor
```

## 📚 API Documentation

The backend provides auto-generated, interactive API documentation:

- **Swagger UI (Interactive)**: http://localhost:8000/docs
- **ReDoc (Static)**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### REST API Endpoints

#### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root info endpoint |
| GET | `/api/v1/health` | Health check |

#### Policies
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/policies/upload` | Upload policy document |
| GET | `/api/v1/policies/{id}` | Get policy details |
| DELETE | `/api/v1/policies/{id}` | Delete policy |

#### Business Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/business` | Create/register business |
| GET | `/api/v1/business/{id}` | Get business details |
| PUT | `/api/v1/business/{id}` | Update business info |
| DELETE | `/api/v1/business/{id}` | Delete business |

#### Recommendations & Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/recommendations/analyze` | Run analysis & get recommendations |
| GET | `/api/v1/recommendations/{id}` | Get analysis results |

#### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/{id}/pdf` | Download PDF report |
| GET | `/api/v1/reports/{id}/html` | Get HTML report (preview) |
| GET | `/api/v1/reports/{id}/json` | Get JSON report |
| POST | `/api/v1/reports/{id}/export` | Export with specified format |

## 🛠️ Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload (development)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Format code with Black
black .

# Lint with Flake8
flake8 .

# Type checking with mypy
mypy app
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_policies.py

# Run with coverage
pytest --cov=app tests/

# Run with verbose output
pytest -v
```

### Frontend Testing

```bash
cd frontend

# Run with Vitest (when configured)
npm run test

# Run with coverage
npm run test:coverage
```

## 📦 Technology Stack

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| FastAPI | Web framework | 0.135+ |
| Uvicorn | ASGI server | 0.42+ |
| Pydantic | Data validation | 2.12+ |
| SQLite/PostgreSQL | Database | - |
| OpenRouter API | LLM integration | - |
| PyPDF2/pdfplumber | PDF processing | Latest |
| python-docx | DOCX processing | Latest |
| ReportLab | PDF generation | 4.4+ |

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI library | 18+ |
| Vite | Build tool | 5+ |
| React Router | Navigation | 6.20+ |
| Zustand | State management | 4.4+ |
| Axios | HTTP client | 1.6+ |
| CSS Modules | Styling | - |

## 🔒 Security Features

- ✅ CORS middleware with configurable origins
- ✅ Request ID tracking for audit trails
- ✅ Environment variable management (.env files)
- ✅ File upload validation and size limits
- ✅ Input validation with Pydantic
- ✅ Error handling without exposing internal details
- ✅ Structured logging for security events

## 📈 Performance Features

- ⚡ Async/await throughout backend
- 🔄 Request caching where applicable
- 📊 Latency tracking middleware
- 🗜️ Response compression
- 🎯 Lazy loading in frontend
- 🚀 Production builds optimization
- 🔍 Database query optimization

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment for Production

```env
# Backend
DEBUG=False
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=["https://yourdomain.com"]

# Frontend
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Cloud Deployment Options

- **AWS**: ECS, EC2, or Elastic Beanstalk
- **Google Cloud**: Cloud Run, App Engine, or GKE
- **Azure**: App Service or Container Instances
- **Heroku**: Platform as a Service
- **DigitalOcean**: App Platform or Droplets

## 📝 Key Implementation Highlights

### Backend Highlights
- ✅ Factory pattern for FastAPI app creation
- ✅ Request logging middleware with unique IDs
- ✅ Latency tracking in milliseconds
- ✅ Structured logging with rotation
- ✅ LLM integration ready (OpenRouter)
- ✅ Modular architecture for scalability

### Frontend Highlights
- ✅ 7-page application with complete flow
- ✅ Zustand for efficient state management
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Error boundaries and error handling
- ✅ Loading states and user feedback
- ✅ Form validation with custom hooks

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Policy upload and processing
- ✅ Business profile collection
- ✅ Analysis dashboard
- ✅ Recommendations generation
- ✅ Report export

### Phase 2: Enhancement
- 📋 Multi-policy comparison
- 📊 Industry benchmarking
- 💬 Chat interface for questions
- 🔄 Batch processing
- 📧 Email notifications

### Phase 3: Advanced Features
- 🤖 Fine-tuned LLM models
- 📱 Mobile application
- 🌍 Multi-language support
- 🔗 Insurance provider integrations
- 📈 Analytics dashboard

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit a pull request with description

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.
