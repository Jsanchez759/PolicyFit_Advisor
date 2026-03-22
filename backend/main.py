"""Main FastAPI application entry point"""
import logging
import time
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request

from api.router import router as api_router
from api.core.config import settings
from api.core.logging_config import setup_logging
from api.core.storage import init_db

setup_logging()
init_db()
logger = logging.getLogger("app")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="AI-powered insurance policy analysis and recommendation engine",
    )

    # Allow frontend clients to call this backend during development.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_origin_regex=settings.ALLOWED_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_logging_middleware(request: Request, call_next):
        """Log HTTP request/response metadata with latency and request id."""
        request_id = str(uuid.uuid4())
        started = time.perf_counter()
        path = request.url.path
        method = request.method
        client_host = request.client.host if request.client else "unknown"

        logger.info("request.start id=%s method=%s path=%s client=%s", request_id, method, path, client_host)
        try:
            response = await call_next(request)
        except Exception:
            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.exception(
                "request.error id=%s method=%s path=%s duration_ms=%.2f",
                request_id,
                method,
                path,
                elapsed_ms,
            )
            raise

        elapsed_ms = (time.perf_counter() - started) * 1000
        response.headers["X-Request-ID"] = request_id
        logger.info(
            "request.end id=%s method=%s path=%s status=%s duration_ms=%.2f",
            request_id,
            method,
            path,
            response.status_code,
            elapsed_ms,
        )
        return response

    # Mount versioned API routes under a common prefix.
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/")
    async def root():
        """Root endpoint"""
        return {
            "message": f"{settings.PROJECT_NAME} API",
            "version": settings.VERSION,
            "docs": "/docs",
            "openapi": "/openapi.json",
        }

    return app


app = create_application()
