from pydantic_settings import BaseSettings
from pydantic import Field, AnyHttpUrl
from typing import List

class Settings(BaseSettings):
    environment: str = "development"
    allowed_origins: str = ""


    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin]


    supabase_url: str = Field(..., min_length=1, strip_whitespace=True)
    supabase_service_role_key: str = Field(..., min_length=1, strip_whitespace=True)

    flow_api_key: str = Field(..., min_length=1, strip_whitespace=True)
    flow_secret_key: str = Field(..., min_length=1, strip_whitespace=True)

    flow_base_url: AnyHttpUrl
    flow_return_url: AnyHttpUrl
    flow_confirmation_url: AnyHttpUrl

    database_url: str
    app_name: str
    internal_api_key: str

    class Config:
        env_file = ".env"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
