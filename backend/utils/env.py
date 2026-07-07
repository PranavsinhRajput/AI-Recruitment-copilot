from pathlib import Path

from dotenv import load_dotenv


def load_project_env() -> None:
    """Load the backend .env file if it exists."""
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(env_path)
