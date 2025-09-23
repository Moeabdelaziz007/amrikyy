"""
End-to-end tests for AuraOS workflows
"""

import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient

class TestUserWorkflow:
    """End-to-end tests for user workflows"""
    
    @pytest.fixture
    def conversational_client(self):
        """Test client for conversational core service"""
        from services.templates.conversational-core.app import app
        return TestClient(app)
    
    @pytest.fixture
    def file_organizer_client(self):
        """Test client for file organizer service"""
        from services.templates.file-organizer.app import app
        return TestClient(app)
    
    @pytest.fixture
    def ide_agent_client(self):
        """Test client for IDE agent service"""
        from services.templates.ide-agent.app import app
        return TestClient(app)
    
    @pytest.mark.e2e
    def test_complete_user_workflow(self, conversational_client, file_organizer_client, ide_agent_client):
        """Test complete user workflow across all services"""
        # Step 1: Create a conversation
        conv_response = conversational_client.post(
            "/conversations",
            json={
                "title": "E2E Test Conversation",
                "initial_message": "I need help with a Python project"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert conv_response.status_code == 200
        conversation = conv_response.json()
        conv_id = conversation["id"]
        
        # Step 2: Add a message to the conversation
        message_response = conversational_client.post(
            f"/conversations/{conv_id}/messages",
            json={
                "content": "Can you help me create a Python script?",
                "role": "user"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert message_response.status_code == 200
        
        # Step 3: Create a Python file using IDE agent
        file_response = ide_agent_client.post(
            "/files",
            json={
                "name": "hello.py",
                "content": "print('Hello, World!')",
                "path": "/tmp/hello.py"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert file_response.status_code == 200
        code_file = file_response.json()
        file_id = code_file["id"]
        
        # Step 4: Execute the code
        execute_response = ide_agent_client.post(
            "/execute",
            json={
                "code": "print('Hello, World!')",
                "language": "python"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert execute_response.status_code == 200
        execution_result = execute_response.json()
        assert execution_result["status"] in ["success", "error", "timeout"]
        
        # Step 5: Upload a file using file organizer
        upload_response = file_organizer_client.post(
            "/files/upload",
            files={"file": ("test.txt", "This is a test file", "text/plain")},
            data={"tags": "test,e2e"},
            headers={"Authorization": "Bearer test_token"}
        )
        assert upload_response.status_code == 200
        uploaded_file = upload_response.json()
        
        # Step 6: Search for the uploaded file
        search_response = file_organizer_client.post(
            "/files/search",
            json={
                "query": "test",
                "tags": ["test"]
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert search_response.status_code == 200
        search_results = search_response.json()
        assert len(search_results) > 0
        
        # Step 7: Analyze the code file
        analyze_response = ide_agent_client.post(
            f"/analyze/{file_id}",
            json={"analysis_type": "quality"},
            headers={"Authorization": "Bearer test_token"}
        )
        assert analyze_response.status_code == 200
        analysis = analyze_response.json()
        assert analysis["file_id"] == file_id
        
        # Step 8: Get conversation history
        conv_history = conversational_client.get(
            f"/conversations/{conv_id}",
            headers={"Authorization": "Bearer test_token"}
        )
        assert conv_history.status_code == 200
        history = conv_history.json()
        assert len(history["messages"]) > 0

class TestFileManagementWorkflow:
    """End-to-end tests for file management workflows"""
    
    @pytest.fixture
    def file_organizer_client(self):
        """Test client for file organizer service"""
        from services.templates.file-organizer.app import app
        return TestClient(app)
    
    @pytest.mark.e2e
    def test_file_lifecycle_workflow(self, file_organizer_client):
        """Test complete file lifecycle workflow"""
        # Step 1: Upload multiple files
        files_to_upload = [
            ("document.pdf", "PDF content", "application/pdf"),
            ("image.jpg", "Image content", "image/jpeg"),
            ("data.csv", "CSV data", "text/csv")
        ]
        
        uploaded_files = []
        for filename, content, mime_type in files_to_upload:
            response = file_organizer_client.post(
                "/files/upload",
                files={"file": (filename, content, mime_type)},
                data={"tags": f"test,{mime_type.split('/')[0]}"},
                headers={"Authorization": "Bearer test_token"}
            )
            assert response.status_code == 200
            uploaded_files.append(response.json())
        
        # Step 2: List all files
        list_response = file_organizer_client.get(
            "/files",
            headers={"Authorization": "Bearer test_token"}
        )
        assert list_response.status_code == 200
        all_files = list_response.json()
        assert len(all_files) >= len(files_to_upload)
        
        # Step 3: Search files by type
        for file_type in ["pdf", "jpeg", "csv"]:
            search_response = file_organizer_client.post(
                "/files/search",
                json={
                    "mime_types": [f"application/{file_type}", f"image/{file_type}", f"text/{file_type}"]
                },
                headers={"Authorization": "Bearer test_token"}
            )
            assert search_response.status_code == 200
            search_results = search_response.json()
            assert len(search_results) > 0
        
        # Step 4: Get file details
        for file_info in uploaded_files:
            detail_response = file_organizer_client.get(
                f"/files/{file_info['id']}",
                headers={"Authorization": "Bearer test_token"}
            )
            assert detail_response.status_code == 200
            file_detail = detail_response.json()
            assert file_detail["id"] == file_info["id"]
            assert file_detail["name"] == file_info["name"]
        
        # Step 5: Delete files
        for file_info in uploaded_files:
            delete_response = file_organizer_client.delete(
                f"/files/{file_info['id']}",
                headers={"Authorization": "Bearer test_token"}
            )
            assert delete_response.status_code == 200

class TestCodeDevelopmentWorkflow:
    """End-to-end tests for code development workflows"""
    
    @pytest.fixture
    def ide_agent_client(self):
        """Test client for IDE agent service"""
        from services.templates.ide-agent.app import app
        return TestClient(app)
    
    @pytest.mark.e2e
    def test_code_development_workflow(self, ide_agent_client):
        """Test complete code development workflow"""
        # Step 1: Create a Python project
        python_files = [
            ("main.py", "print('Hello, World!')", "python"),
            ("utils.py", "def helper(): pass", "python"),
            ("test.py", "def test_function(): pass", "python")
        ]
        
        created_files = []
        for filename, content, language in python_files:
            response = ide_agent_client.post(
                "/files",
                json={
                    "name": filename,
                    "content": content,
                    "path": f"/tmp/{filename}"
                },
                headers={"Authorization": "Bearer test_token"}
            )
            assert response.status_code == 200
            created_files.append(response.json())
        
        # Step 2: List all code files
        list_response = ide_agent_client.get(
            "/files",
            headers={"Authorization": "Bearer test_token"}
        )
        assert list_response.status_code == 200
        all_files = list_response.json()
        assert len(all_files) >= len(python_files)
        
        # Step 3: Execute code from main.py
        main_file = next(f for f in created_files if f["name"] == "main.py")
        execute_response = ide_agent_client.post(
            "/execute",
            json={
                "code": main_file["content"],
                "language": "python"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert execute_response.status_code == 200
        execution_result = execute_response.json()
        assert execution_result["status"] in ["success", "error", "timeout"]
        
        # Step 4: Analyze code quality
        for file_info in created_files:
            analyze_response = ide_agent_client.post(
                f"/analyze/{file_info['id']}",
                json={"analysis_type": "quality"},
                headers={"Authorization": "Bearer test_token"}
            )
            assert analyze_response.status_code == 200
            analysis = analyze_response.json()
            assert analysis["file_id"] == file_info["id"]
            assert "results" in analysis
        
        # Step 5: Update code
        updated_content = "print('Hello, Updated World!')"
        update_response = ide_agent_client.put(
            f"/files/{main_file['id']}",
            json={"content": updated_content},
            headers={"Authorization": "Bearer test_token"}
        )
        assert update_response.status_code == 200
        updated_file = update_response.json()
        assert updated_file["content"] == updated_content
        
        # Step 6: Execute updated code
        execute_updated_response = ide_agent_client.post(
            "/execute",
            json={
                "code": updated_content,
                "language": "python"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert execute_updated_response.status_code == 200

class TestCrossServiceWorkflow:
    """End-to-end tests for cross-service workflows"""
    
    @pytest.fixture
    def conversational_client(self):
        """Test client for conversational core service"""
        from services.templates.conversational-core.app import app
        return TestClient(app)
    
    @pytest.fixture
    def file_organizer_client(self):
        """Test client for file organizer service"""
        from services.templates.file-organizer.app import app
        return TestClient(app)
    
    @pytest.fixture
    def ide_agent_client(self):
        """Test client for IDE agent service"""
        from services.templates.ide-agent.app import app
        return TestClient(app)
    
    @pytest.mark.e2e
    def test_ai_assisted_development_workflow(self, conversational_client, file_organizer_client, ide_agent_client):
        """Test AI-assisted development workflow across services"""
        # Step 1: Start a conversation about a coding project
        conv_response = conversational_client.post(
            "/conversations",
            json={
                "title": "AI-Assisted Development",
                "initial_message": "I want to create a Python web scraper"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert conv_response.status_code == 200
        conversation = conv_response.json()
        conv_id = conversation["id"]
        
        # Step 2: Add requirements to the conversation
        requirements_response = conversational_client.post(
            f"/conversations/{conv_id}/messages",
            json={
                "content": "I need to scrape data from a website and save it to CSV",
                "role": "user"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert requirements_response.status_code == 200
        
        # Step 3: Create the Python scraper code
        scraper_code = """
import requests
import csv
from bs4 import BeautifulSoup

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup

def save_to_csv(data, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(data)
"""
        
        code_response = ide_agent_client.post(
            "/files",
            json={
                "name": "scraper.py",
                "content": scraper_code,
                "path": "/tmp/scraper.py"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert code_response.status_code == 200
        code_file = code_response.json()
        
        # Step 4: Execute the code to test it
        execute_response = ide_agent_client.post(
            "/execute",
            json={
                "code": scraper_code,
                "language": "python"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert execute_response.status_code == 200
        
        # Step 5: Analyze the code quality
        analyze_response = ide_agent_client.post(
            f"/analyze/{code_file['id']}",
            json={"analysis_type": "quality"},
            headers={"Authorization": "Bearer test_token"}
        )
        assert analyze_response.status_code == 200
        
        # Step 6: Upload sample data file
        sample_data = "name,age,city\nJohn,25,New York\nJane,30,London"
        upload_response = file_organizer_client.post(
            "/files/upload",
            files={"file": ("sample_data.csv", sample_data, "text/csv")},
            data={"tags": "data,sample"},
            headers={"Authorization": "Bearer test_token"}
        )
        assert upload_response.status_code == 200
        
        # Step 7: Search for data files
        search_response = file_organizer_client.post(
            "/files/search",
            json={
                "mime_types": ["text/csv"],
                "tags": ["data"]
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert search_response.status_code == 200
        search_results = search_response.json()
        assert len(search_results) > 0
        
        # Step 8: Continue the conversation with results
        followup_response = conversational_client.post(
            f"/conversations/{conv_id}/messages",
            json={
                "content": "I've created the scraper and uploaded sample data. What's next?",
                "role": "user"
            },
            headers={"Authorization": "Bearer test_token"}
        )
        assert followup_response.status_code == 200
        
        # Step 9: Get the complete conversation history
        history_response = conversational_client.get(
            f"/conversations/{conv_id}",
            headers={"Authorization": "Bearer test_token"}
        )
        assert history_response.status_code == 200
        history = history_response.json()
        assert len(history["messages"]) >= 3  # Initial + requirements + followup
