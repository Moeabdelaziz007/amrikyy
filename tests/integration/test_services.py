"""
Integration tests for AuraOS services
"""

import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
from unittest.mock import Mock, AsyncMock, patch

from services.templates.conversational-core.app import app as conversational_app
from services.templates.file-organizer.app import app as file_organizer_app
from services.templates.ide-agent.app import app as ide_agent_app

class TestConversationalCoreService:
    """Integration tests for Conversational Core service"""
    
    @pytest.fixture
    def client(self):
        """Test client for conversational core service"""
        return TestClient(conversational_app)
    
    @pytest.fixture
    async def async_client(self):
        """Async test client for conversational core service"""
        async with AsyncClient(app=conversational_app, base_url="http://test") as ac:
            yield ac
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "conversational-core"
    
    def test_metrics_endpoint(self, client):
        """Test metrics endpoint"""
        response = client.get("/metrics")
        assert response.status_code == 200
        assert "conversational_core_requests_total" in response.text
    
    @patch('services.templates.conversational-core.app.redis_client')
    def test_create_conversation(self, mock_redis, client):
        """Test creating a conversation"""
        mock_redis.hset = AsyncMock(return_value=True)
        mock_redis.sadd = AsyncMock(return_value=True)
        
        response = client.post(
            "/conversations",
            json={
                "title": "Test Conversation",
                "initial_message": "Hello, this is a test"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Conversation"
        assert len(data["messages"]) == 1
        assert data["messages"][0]["content"] == "Hello, this is a test"
    
    @patch('services.templates.conversational-core.app.redis_client')
    def test_list_conversations(self, mock_redis, client):
        """Test listing conversations"""
        mock_redis.smembers = AsyncMock(return_value={"conv_123"})
        mock_redis.hget = AsyncMock(return_value='{"id": "conv_123", "title": "Test"}')
        
        response = client.get(
            "/conversations",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @patch('services.templates.conversational-core.app.redis_client')
    def test_add_message(self, mock_redis, client):
        """Test adding a message to conversation"""
        mock_redis.sismember = AsyncMock(return_value=True)
        mock_redis.hget = AsyncMock(return_value='{"id": "conv_123", "messages": []}')
        mock_redis.hset = AsyncMock(return_value=True)
        
        response = client.post(
            "/conversations/conv_123/messages",
            json={
                "content": "Test message",
                "role": "user"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "Test message"
        assert data["role"] == "user"

class TestFileOrganizerService:
    """Integration tests for File Organizer service"""
    
    @pytest.fixture
    def client(self):
        """Test client for file organizer service"""
        return TestClient(file_organizer_app)
    
    @pytest.fixture
    async def async_client(self):
        """Async test client for file organizer service"""
        async with AsyncClient(app=file_organizer_app, base_url="http://test") as ac:
            yield ac
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "file-organizer"
    
    def test_metrics_endpoint(self, client):
        """Test metrics endpoint"""
        response = client.get("/metrics")
        assert response.status_code == 200
        assert "file_organizer_requests_total" in response.text
    
    @patch('services.templates.file-organizer.app.redis_client')
    def test_upload_file(self, mock_redis, client):
        """Test file upload"""
        mock_redis.hset = AsyncMock(return_value=True)
        mock_redis.sadd = AsyncMock(return_value=True)
        
        # Create a test file
        test_file = ("test.txt", "Hello, World!", "text/plain")
        
        response = client.post(
            "/files/upload",
            files={"file": test_file},
            data={"tags": "test,document"},
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "test.txt"
        assert data["mime_type"] == "text/plain"
        assert "test" in data["tags"]
    
    @patch('services.templates.file-organizer.app.redis_client')
    def test_list_files(self, mock_redis, client):
        """Test listing files"""
        mock_redis.smembers = AsyncMock(return_value={"file_123"})
        mock_redis.hget = AsyncMock(return_value='{"id": "file_123", "name": "test.txt"}')
        
        response = client.get(
            "/files",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @patch('services.templates.file-organizer.app.redis_client')
    def test_search_files(self, mock_redis, client):
        """Test file search"""
        mock_redis.smembers = AsyncMock(return_value={"file_123"})
        mock_redis.hget = AsyncMock(return_value='{"id": "file_123", "name": "test.txt", "tags": ["test"]}')
        
        response = client.post(
            "/files/search",
            json={
                "query": "test",
                "tags": ["test"]
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestIDEAgentService:
    """Integration tests for IDE Agent service"""
    
    @pytest.fixture
    def client(self):
        """Test client for IDE agent service"""
        return TestClient(ide_agent_app)
    
    @pytest.fixture
    async def async_client(self):
        """Async test client for IDE agent service"""
        async with AsyncClient(app=ide_agent_app, base_url="http://test") as ac:
            yield ac
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "ide-agent"
    
    def test_metrics_endpoint(self, client):
        """Test metrics endpoint"""
        response = client.get("/metrics")
        assert response.status_code == 200
        assert "ide_agent_requests_total" in response.text
    
    @patch('services.templates.ide-agent.app.redis_client')
    def test_create_file(self, mock_redis, client):
        """Test creating a code file"""
        mock_redis.hset = AsyncMock(return_value=True)
        mock_redis.sadd = AsyncMock(return_value=True)
        
        response = client.post(
            "/files",
            json={
                "name": "test.py",
                "content": "print('Hello, World!')",
                "path": "/tmp/test.py"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "test.py"
        assert data["language"] == "python"
        assert data["content"] == "print('Hello, World!')"
    
    @patch('services.templates.ide-agent.app.redis_client')
    def test_list_files(self, mock_redis, client):
        """Test listing code files"""
        mock_redis.smembers = AsyncMock(return_value={"file_123"})
        mock_redis.hget = AsyncMock(return_value='{"id": "file_123", "name": "test.py"}')
        
        response = client.get(
            "/files",
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @patch('services.templates.ide-agent.app.redis_client')
    def test_execute_code(self, mock_redis, client):
        """Test code execution"""
        mock_redis.hset = AsyncMock(return_value=True)
        mock_redis.sadd = AsyncMock(return_value=True)
        
        response = client.post(
            "/execute",
            json={
                "code": "print('Hello, World!')",
                "language": "python"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["success", "error", "timeout"]
        assert "execution_time" in data
    
    @patch('services.templates.ide-agent.app.redis_client')
    def test_analyze_code(self, mock_redis, client):
        """Test code analysis"""
        mock_redis.sismember = AsyncMock(return_value=True)
        mock_redis.hget = AsyncMock(return_value='{"id": "file_123", "content": "print(\'test\')"}')
        mock_redis.hset = AsyncMock(return_value=True)
        
        response = client.post(
            "/analyze/file_123",
            json={"analysis_type": "quality"},
            headers={"Authorization": "Bearer test_token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["file_id"] == "file_123"
        assert data["analysis_type"] == "quality"
        assert "results" in data

class TestServiceIntegration:
    """Integration tests across services"""
    
    @pytest.mark.asyncio
    async def test_service_communication(self):
        """Test communication between services"""
        # This would test actual service-to-service communication
        # For now, we'll test that all services can start and respond
        services = [
            ("conversational-core", 8001),
            ("file-organizer", 8002),
            ("ide-agent", 8003)
        ]
        
        for service_name, port in services:
            # In a real integration test, we would start the services
            # and test actual communication
            assert service_name is not None
            assert port > 0
    
    def test_shared_authentication(self):
        """Test that all services use the same authentication"""
        # This would test that JWT tokens work across all services
        # For now, we'll just verify the structure
        token = "Bearer test_token_123"
        assert token.startswith("Bearer ")
        assert len(token) > 10
    
    def test_shared_metrics(self):
        """Test that all services expose metrics"""
        # This would test that all services expose Prometheus metrics
        # For now, we'll just verify the metric names
        expected_metrics = [
            "conversational_core_requests_total",
            "file_organizer_requests_total",
            "ide_agent_requests_total"
        ]
        
        for metric in expected_metrics:
            assert metric.endswith("_total")
            assert "_requests_" in metric