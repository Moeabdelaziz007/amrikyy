"""
Pytest configuration and fixtures for AuraOS tests
"""

import os
import pytest
import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import Mock, AsyncMock
from fastapi.testclient import TestClient
from httpx import AsyncClient
import redis.asyncio as redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set test environment
os.environ["TESTING"] = "true"
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["REDIS_URL"] = "redis://localhost:6379/1"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def test_db():
    """Create test database"""
    engine = create_engine(
        "sqlite:///./test.db",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    # Base.metadata.create_all(bind=engine)
    
    yield TestingSessionLocal()
    
    # Cleanup
    os.remove("test.db")

@pytest.fixture
async def redis_client():
    """Create Redis client for testing"""
    client = redis.from_url("redis://localhost:6379/1")
    yield client
    await client.flushdb()
    await client.close()

@pytest.fixture
def mock_redis():
    """Mock Redis client"""
    mock = Mock()
    mock.get = AsyncMock(return_value=None)
    mock.set = AsyncMock(return_value=True)
    mock.delete = AsyncMock(return_value=True)
    mock.exists = AsyncMock(return_value=False)
    mock.expire = AsyncMock(return_value=True)
    mock.hget = AsyncMock(return_value=None)
    mock.hset = AsyncMock(return_value=True)
    mock.hdel = AsyncMock(return_value=True)
    mock.sadd = AsyncMock(return_value=True)
    mock.srem = AsyncMock(return_value=True)
    mock.smembers = AsyncMock(return_value=set())
    mock.sismember = AsyncMock(return_value=False)
    return mock

@pytest.fixture
def mock_openai():
    """Mock OpenAI client"""
    mock = Mock()
    mock.chat.completions.create = AsyncMock(
        return_value=Mock(
            choices=[
                Mock(
                    message=Mock(
                        content="Test response",
                        role="assistant"
                    )
                )
            ]
        )
    )
    return mock

@pytest.fixture
def mock_anthropic():
    """Mock Anthropic client"""
    mock = Mock()
    mock.messages.create = AsyncMock(
        return_value=Mock(
            content=[
                Mock(
                    text="Test response"
                )
            ]
        )
    )
    return mock

@pytest.fixture
def mock_firebase():
    """Mock Firebase client"""
    mock = Mock()
    mock.collection.return_value.document.return_value.set = AsyncMock(return_value=True)
    mock.collection.return_value.document.return_value.get = AsyncMock(
        return_value=Mock(exists=False)
    )
    mock.collection.return_value.add = AsyncMock(return_value=Mock(id="test_id"))
    return mock

@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "id": "test_user_123",
        "email": "test@example.com",
        "username": "testuser",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    }

@pytest.fixture
def sample_conversation_data():
    """Sample conversation data for testing"""
    return {
        "id": "test_conv_123",
        "title": "Test Conversation",
        "user_id": "test_user_123",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "messages": []
    }

@pytest.fixture
def sample_message_data():
    """Sample message data for testing"""
    return {
        "id": "test_msg_123",
        "content": "Hello, this is a test message",
        "role": "user",
        "conversation_id": "test_conv_123",
        "created_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_file_data():
    """Sample file data for testing"""
    return {
        "id": "test_file_123",
        "name": "test.txt",
        "path": "/tmp/test.txt",
        "size": 1024,
        "mime_type": "text/plain",
        "hash": "abc123def456",
        "user_id": "test_user_123",
        "created_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_code_data():
    """Sample code data for testing"""
    return {
        "id": "test_code_123",
        "name": "test.py",
        "content": "print('Hello, World!')",
        "language": "python",
        "user_id": "test_user_123",
        "created_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture
def auth_headers():
    """Authentication headers for testing"""
    return {
        "Authorization": "Bearer test_token_123"
    }

@pytest.fixture
def mock_jwt_token():
    """Mock JWT token for testing"""
    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdF91c2VyXzEyMyIsImV4cCI6OTk5OTk5OTk5OX0.test_signature"

@pytest.fixture
def mock_metrics():
    """Mock metrics collector"""
    mock = Mock()
    mock.record_http_request = Mock()
    mock.record_db_operation = Mock()
    mock.record_redis_operation = Mock()
    mock.record_ai_request = Mock()
    mock.record_file_operation = Mock()
    mock.record_user_activity = Mock()
    mock.record_error = Mock()
    mock.record_performance = Mock()
    return mock

@pytest.fixture
def mock_logger():
    """Mock logger"""
    mock = Mock()
    mock.info = Mock()
    mock.warning = Mock()
    mock.error = Mock()
    mock.debug = Mock()
    mock.critical = Mock()
    mock.log_request = Mock()
    mock.log_error = Mock()
    mock.log_performance = Mock()
    mock.log_security = Mock()
    return mock

@pytest.fixture
def mock_alert_manager():
    """Mock alert manager"""
    mock = Mock()
    mock.check_metrics = Mock(return_value=[])
    mock.send_notifications = Mock()
    mock.resolve_alert = Mock()
    mock.get_active_alerts = Mock(return_value=[])
    return mock

@pytest.fixture
def test_client():
    """Test client for FastAPI applications"""
    # This will be overridden by specific service tests
    pass

@pytest.fixture
async def async_client():
    """Async test client for FastAPI applications"""
    # This will be overridden by specific service tests
    pass

# Pytest configuration
def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "unit: mark test as a unit test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "e2e: mark test as an end-to-end test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )

def pytest_collection_modifyitems(config, items):
    """Modify test collection"""
    for item in items:
        # Add unit marker to tests in unit directory
        if "unit" in str(item.fspath):
            item.add_marker(pytest.mark.unit)
        # Add integration marker to tests in integration directory
        elif "integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        # Add e2e marker to tests in e2e directory
        elif "e2e" in str(item.fspath):
            item.add_marker(pytest.mark.e2e)
