# PolicyFit Advisor

AI-powered insurance policy analysis and coverage recommendation platform.

## Project Overview

PolicyFit Advisor is a full-stack application that leverages AI to analyze commercial insurance policies and identify coverage gaps. It provides tailored recommendations based on your business profile.

### Key Features

- **AI Policy Analysis**: Extracts and analyzes insurance policy information
- **Business Profile Integration**: Matches coverage against NAICS industry codes and operations
- **Gap Identification**: Identifies missing or insufficient coverage
- **Smart Recommendations**: Generates tailored coverage recommendations
- **Multiple Report Formats**: Export analysis in PDF, HTML, or JSON formats

## Architecture

The application is built with a modern microservices architecture:

### Backend (FastAPI)
- **Document Ingestion**: Accepts PDF/DOCX policy documents
- **Policy Extraction**: Uses LLM to extract structured policy information
- **Recommendation Engine**: Analyzes gaps and generates recommendations
- **Report Generation**: Creates comprehensive reports
- REST API with auto-generated documentation

### Frontend (React + Vite)
- **Landing Page**: Marketing and feature overview
- **Upload Interface**: Policy document upload
- **Business Intake Form**: Collect business information
- **Analysis Dashboard**: View results and metrics
- **Recommendations View**: Browse detailed recommendations
- **Export Interface**: Download reports

## Project Structure

```
PolicyFit_Advisor/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration and utilities
│   │   ├── modules/           # Feature modules
│   │   ├── routes/            # API endpoints
│   │   └── schemas/           # Pydantic models
│   ├── tests/                 # Test suite
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container image
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # State management
│   │   ├── utils/             # Utilities
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── Dockerfile             # Frontend container image
│   ├── .env.example           # Environment template
│   └── README.md              # Frontend documentation
│
├── docker-compose.yml         # Docker orchestration
├── .gitignore                 # Git ignore rules
├── LICENSE                    # License
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Python 3.10+ (for backend)
- Node.js 16+ (for frontend)
- Docker & Docker Compose (optional)

### Quick Start - Local Development

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

Backend API: http://localhost:8000
Docs: http://localhost:8000/docs

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend App: http://localhost:5173

### Docker Setup

```bash
docker-compose up
```

This will start both services:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Configuration

### Backend (.env)

```
HOST=0.0.0.0
PORT=8000
DEBUG=False
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=PolicyFit Advisor
```

## API Documentation

The backend provides auto-generated API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `POST /api/policies/upload` - Upload policy document
- `POST /api/business` - Register business
- `POST /api/recommendations/analyze` - Run analysis
- `GET /api/reports/{id}/pdf` - Download PDF report

## Development

### Backend Development

```bash
cd backend

# Run tests
pytest

# Format code
black .

# Lint
flake8 .
```

### Frontend Development

```bash
cd frontend

# Format code
npm run format

# Lint
npm run lint

# Build for production
npm run build
```

## Key Technologies

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation
- **OpenAI API**: LLM for policy analysis
- **PyPDF2/pdfplumber**: Document processing
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Navigation
- **Zustand**: State management
- **Axios**: HTTP client
- **CSS Modules**: Styling

## Next Steps

1. **Implement LLM Integration**: Connect OpenAI or other LLM APIs
2. **Database Setup**: Add persistence with PostgreSQL/MongoDB
3. **Authentication**: Add user authentication and authorization
4. **Advanced Features**: Add multi-policy comparison, benchmarking
5. **Deployment**: Deploy to cloud (AWS, GCP, Azure)
6. **Testing**: Expand test coverage

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit a pull request

## License

[See LICENSE file](LICENSE)

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for better insurance coverage analysis**
