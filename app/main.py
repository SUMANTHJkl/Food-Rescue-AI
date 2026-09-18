from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (analytics, auth, inventory, kitchens, matches,
                         notifications, predictions, redistributions, surplus)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="SIH 2026 | PS-26234 | Team Caffeine Coders",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (analytics, auth, inventory, kitchens, matches,
               notifications, predictions, redistributions, surplus):
    app.include_router(module.router, prefix=settings.api_v1_prefix)


@app.get("/healthz", tags=["health"])
def healthz():
    return {"status": "ok", "service": "food-rescue-ai"}
