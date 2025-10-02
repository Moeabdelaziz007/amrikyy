import pytest
from ai_agent import AIAgent, Task, AgentState

def test_ai_agent_initialization():
    """Tests that the AIAgent initializes with a default state."""
    agent = AIAgent()
    assert agent.state == AgentState.IDLE
    assert agent.task_queue.empty()
    assert agent.confidence_score == 0.0

def test_add_task_to_queue():
    """Tests that a task can be added to the agent's queue."""
    agent = AIAgent()
    task = Task(id=1, description="Test task", priority=1)
    agent.add_task(task)
    assert not agent.task_queue.empty()
    retrieved_task = agent.task_queue.get()
    assert retrieved_task.id == 1
    assert retrieved_task.description == "Test task"

def test_process_task_changes_state():
    """Tests that processing a task changes the agent's state to BUSY and then back to IDLE."""
    agent = AIAgent()
    task = Task(id=2, description="Process me", priority=1)
    agent.add_task(task)
    
    # This is a simplified test. In a real scenario, we would mock the task's execute method.
    # For now, we'll just check the state transitions.
    agent.process_tasks()
    
    # Since process_tasks runs in a loop, we can't easily test the intermediate BUSY state
    # without more complex threading/mocking. We'll test the end state.
    assert agent.task_queue.empty()
    assert agent.state == AgentState.IDLE

# To run this test, use the command: pytest
