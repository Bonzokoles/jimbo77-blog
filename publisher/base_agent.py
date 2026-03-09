"""
Base Agent Class — shared infrastructure for all Publisher agents.
Provides FastAPI server, logging, standard request/response format.
"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional, List, Literal
import uvicorn
import argparse
import json
import logging
from pathlib import Path
from datetime import datetime


class AgentConfig(BaseModel):
    id: str
    name: str
    version: str = "1.0.0"
    description: str = ""
    port: int = 6000
    capabilities: List[str] = []
    log_level: str = "INFO"


class AgentRequest(BaseModel):
    action: Literal["test", "execute", "status"]
    data: Optional[Dict[str, Any]] = None


class AgentResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: str = datetime.now().isoformat()


class BaseAgent:
    """Base class for all Python agents"""

    def __init__(self, config: AgentConfig):
        self.config = config
        self.app = FastAPI(
            title=config.name,
            version=config.version,
            description=config.description,
        )
        self.logger = self._setup_logging()
        self._setup_routes()
        self.is_running = False

    def _setup_logging(self) -> logging.Logger:
        logger = logging.getLogger(self.config.id)
        logger.setLevel(getattr(logging, self.config.log_level))

        log_dir = Path(__file__).parent / "logs"
        log_dir.mkdir(exist_ok=True)
        log_file = log_dir / f"{self.config.id}.log"

        handler = logging.FileHandler(log_file, encoding="utf-8")
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        console = logging.StreamHandler()
        console.setFormatter(formatter)
        logger.addHandler(console)
        return logger

    def _setup_routes(self):
        @self.app.get("/")
        async def root():
            return {
                "agent": self.config.name,
                "version": self.config.version,
                "status": "running" if self.is_running else "idle",
                "capabilities": self.config.capabilities,
            }

        @self.app.get("/health")
        async def health():
            return {
                "status": "healthy",
                "agent": self.config.id,
                "timestamp": datetime.now().isoformat(),
            }

        @self.app.post("/api", response_model=AgentResponse)
        async def handle_request(request: AgentRequest):
            self.logger.info(f"Received {request.action} request")
            try:
                if request.action == "test":
                    result = await self.test(request.data)
                elif request.action == "execute":
                    result = await self.execute(request.data)
                elif request.action == "status":
                    result = await self.status()
                else:
                    raise ValueError(f"Unknown action: {request.action}")

                return AgentResponse(
                    success=True, message=f"{request.action} completed", data=result
                )
            except Exception as e:
                self.logger.error(f"Error in {request.action}: {e}")
                return AgentResponse(
                    success=False, message=str(e), data={"error": type(e).__name__}
                )

    async def test(self, data: Optional[Dict] = None) -> Dict[str, Any]:
        return {
            "agent": self.config.id,
            "capabilities": self.config.capabilities,
            "message": "Test OK",
        }

    async def execute(self, data: Optional[Dict] = None) -> Dict[str, Any]:
        raise NotImplementedError("Subclass must implement execute()")

    async def status(self) -> Dict[str, Any]:
        return {
            "agent": self.config.id,
            "running": self.is_running,
            "capabilities": self.config.capabilities,
        }

    async def startup(self):
        self.is_running = True
        self.logger.info(f"{self.config.name} started on port {self.config.port}")

    async def shutdown(self):
        self.is_running = False
        self.logger.info(f"{self.config.name} stopped")

    def run(self, port: Optional[int] = None):
        port = port or self.config.port

        @self.app.on_event("startup")
        async def on_startup():
            await self.startup()

        @self.app.on_event("shutdown")
        async def on_shutdown():
            await self.shutdown()

        self.logger.info(f"Starting {self.config.name} on port {port}")
        uvicorn.run(
            self.app, host="0.0.0.0", port=port, log_level=self.config.log_level.lower()
        )


def create_agent_cli(agent_class, default_config: Dict):
    parser = argparse.ArgumentParser(description=default_config.get("description", ""))
    parser.add_argument("--port", type=int, help="Port override")
    args = parser.parse_args()

    config = AgentConfig(**default_config)
    if args.port:
        config.port = args.port

    agent = agent_class(config)
    agent.run()
