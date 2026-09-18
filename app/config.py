from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Food Waste Reduction & Redistribution Ecosystem"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql://postgres:changeme@localhost:5432/foodwaste"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret_key: str = "change-me"
    log_level: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
