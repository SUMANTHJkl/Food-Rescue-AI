from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app import models
from app.config import settings
from app.database import Base, engine
from app.routers import (
    ai,
    analytics,
    auth,
    farmers,
    inventory,
    kitchens,
    matches,
    notifications,
    predictions,
    qr,
    redistributions,
    surplus,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist on app startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="SIH 2026 | PS-26234 | Team Caffeine Coders — AI Food Rescue Engine",
    servers=[
        {"url": "http://localhost:8000", "description": "Local FastAPI Backend Server"},
        {"url": "http://127.0.0.1:8000", "description": "Loopback Server"}
    ],
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (
    ai,
    analytics,
    auth,
    farmers,
    inventory,
    kitchens,
    matches,
    notifications,
    predictions,
    qr,
    redistributions,
    surplus,
):
    app.include_router(module.router, prefix=settings.api_v1_prefix)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/healthz", tags=["health"])
def healthz():
    return {"status": "ok", "service": "food-rescue-ai", "version": "1.0.0"}
