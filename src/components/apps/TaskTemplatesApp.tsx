import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Task Templates & Automation App
export const TaskTemplatesApp: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [automations, setAutomations] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'general',
    tasks: [] as any[],
    tags: [] as string[]
  });
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: 'daily',
    templateId: '',
    schedule: '',
    isActive: true
  });
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showAutomationForm, setShowAutomationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadTemplates();
      loadAutomations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTemplates = () => {
    if (!user) return;
    
    const templatesRef = collection(db, 'taskTemplates');
    const q = query(templatesRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTemplates(templatesData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load templates:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadAutomations = () => {
    if (!user) return;
    
    const automationsRef = collection(db, 'taskAutomations');
    const q = query(automationsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const automationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAutomations(automationsData);
    }, (error) => {
      console.error('Failed to load automations:', error);
    });

    return unsubscribe;
  };

  const createTemplate = async () => {
    if (!newTemplate.name.trim() || !user) return;

    try {
      const templateData = {
        ...newTemplate,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        usageCount: 0
      };

      await addDoc(collection(db, 'taskTemplates'), templateData);
      
      setNewTemplate({
        name: '',
        description: '',
        category: 'general',
        tasks: [],
        tags: []
      });
      setShowTemplateForm(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const createAutomation = async () => {
    if (!newAutomation.name.trim() || !user) return;

    try {
      const automationData = {
        ...newAutomation,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastRun: null,
        runCount: 0
      };

      await addDoc(collection(db, 'taskAutomations'), automationData);
      
      setNewAutomation({
        name: '',
        description: '',
        trigger: 'daily',
        templateId: '',
        schedule: '',
        isActive: true
      });
      setShowAutomationForm(false);
    } catch (error) {
      console.error('Failed to create automation:', error);
    }
  };

  const useTemplate = async (templateId: string) => {
    if (!user) return;

    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      // Create tasks from template
      for (const taskTemplate of template.tasks) {
        const taskData = {
          ...taskTemplate,
          userId: user.uid,
          status: 'pending',
          progress: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          fromTemplate: templateId
        };

        await addDoc(collection(db, 'tasks'), taskData);
      }

      // Update template usage count
      const templateRef = doc(db, 'taskTemplates', templateId);
      await updateDoc(templateRef, {
        usageCount: (template.usageCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to use template:', error);
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      const automationRef = doc(db, 'taskAutomations', automationId);
      await updateDoc(automationRef, {
        isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      await deleteDoc(doc(db, 'taskTemplates', templateId));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const deleteAutomation = async (automationId: string) => {
    try {
      await deleteDoc(doc(db, 'taskAutomations', automationId));
    } catch (error) {
      console.error('Failed to delete automation:', error);
    }
  };

  const addTaskToTemplate = () => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: [...prev.tasks, {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignee: ''
      }]
    }));
  };

  const updateTaskInTemplate = (index: number, field: string, value: string) => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeTaskFromTemplate = (index: number) => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'text-blue-400 bg-blue-900/20';
      case 'personal': return 'text-green-400 bg-green-900/20';
      case 'health': return 'text-red-400 bg-red-900/20';
      case 'learning': return 'text-purple-400 bg-purple-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      case 'event': return '⚡';
      default: return '🔄';
    }
  };

  if (loading) {
    return (
      <div className="task-templates-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading templates and automations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="task-templates-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access task templates and automation</p>
          <button 
            className="auth-btn"
            onClick={() => window.location.reload()}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-templates-app">
      <div className="templates-header">
        <h2>🤖 Task Templates & Automation</h2>
        <div className="header-actions">
          <button 
            className="create-btn"
            onClick={() => setShowTemplateForm(true)}
          >
            + New Template
          </button>
          <button 
            className="create-btn"
            onClick={() => setShowAutomationForm(true)}
          >
            + New Automation
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Templates ({templates.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'automations' ? 'active' : ''}`}
          onClick={() => setActiveTab('automations')}
        >
          🤖 Automations ({automations.length})
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="templates-grid">
            {templates.length === 0 ? (
              <div className="empty-state">
                <h3>No Templates Yet</h3>
                <p>Create your first task template to get started!</p>
                <button 
                  className="create-first-btn"
                  onClick={() => setShowTemplateForm(true)}
                >
                  Create Template
                </button>
              </div>
            ) : (
              templates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h4>{template.name}</h4>
                    <div className="template-usage">
                      Used {template.usageCount || 0} times
                    </div>
                  </div>
                  <p className="template-description">{template.description}</p>
                  <div className="template-meta">
                    <span className={`template-category ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className="template-tasks">
                      {template.tasks.length} tasks
                    </span>
                  </div>
                  <div className="template-actions">
                    <button 
                      onClick={() => useTemplate(template.id)}
                      className="action-btn primary"
                    >
                      Use Template
                    </button>
                    <button 
                      onClick={() => deleteTemplate(template.id)}
                      className="action-btn danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Automations Tab */}
      {activeTab === 'automations' && (
        <div className="automations-section">
          <div className="automations-grid">
            {automations.length === 0 ? (
              <div className="empty-state">
                <h3>No Automations Yet</h3>
                <p>Create your first automation to streamline your workflow!</p>
                <button 
                  className="create-first-btn"
                  onClick={() => setShowAutomationForm(true)}
                >
                  Create Automation
                </button>
              </div>
            ) : (
              automations.map(automation => (
                <div key={automation.id} className="automation-card">
                  <div className="automation-header">
                    <h4>{automation.name}</h4>
                    <div className="automation-status">
                      <span className={`status-dot ${automation.isActive ? 'active' : 'inactive'}`}></span>
                      {automation.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <p className="automation-description">{automation.description}</p>
                  <div className="automation-meta">
                    <div className="automation-trigger">
                      <span className="trigger-icon">{getTriggerIcon(automation.trigger)}</span>
                      {automation.trigger}
                    </div>
                    <div className="automation-schedule">
                      {automation.schedule}
                    </div>
                    <div className="automation-runs">
                      Run {automation.runCount || 0} times
                    </div>
                  </div>
                  <div className="automation-actions">
                    <button 
                      onClick={() => toggleAutomation(automation.id, !automation.isActive)}
                      className={`action-btn ${automation.isActive ? 'warning' : 'success'}`}
                    >
                      {automation.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => deleteAutomation(automation.id)}
                      className="action-btn danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Template Form */}
      {showTemplateForm && (
        <div className="create-form-overlay">
          <div className="create-form glass-effect">
            <h3>Create Task Template</h3>
            <input
              type="text"
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea aria-label="Text area"
              placeholder="Description"
              value={newTemplate.description}
              onChange={e => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <select aria-label="Select option"
              value={newTemplate.category}
              onChange={e => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
            </select>

            {/* Template Tasks */}
            <div className="template-tasks-section">
              <h4>Template Tasks</h4>
              {newTemplate.tasks.map((task, index) => (
                <div key={index} className="template-task-item">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={e => updateTaskInTemplate(index, 'title', e.target.value)}
                  />
                  <textarea aria-label="Text area"
                    placeholder="Task Description"
                    value={task.description}
                    onChange={e => updateTaskInTemplate(index, 'description', e.target.value)}
                  ></textarea>
                  <div className="task-fields">
                    <select aria-label="Select option"
                      value={task.priority}
                      onChange={e => updateTaskInTemplate(index, 'priority', e.target.value)}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Assignee"
                      value={task.assignee}
                      onChange={e => updateTaskInTemplate(index, 'assignee', e.target.value)}
                    />
                    <input
                      type="date"
                      value={task.dueDate}
                      aria-label="Task due date"
                      placeholder="Select due date"
                      onChange={e => updateTaskInTemplate(index, 'dueDate', e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => removeTaskFromTemplate(index)}
                    className="remove-task-btn"
                  >
                    Remove Task
                  </button>
                </div>
              ))}
              <button onClick={addTaskToTemplate} className="add-task-btn">
                + Add Task to Template
              </button>
            </div>

            <div className="form-actions">
              <button onClick={createTemplate} className="submit-btn">Create Template</button>
              <button onClick={() => setShowTemplateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Automation Form */}
      {showAutomationForm && (
        <div className="create-form-overlay">
          <div className="create-form glass-effect">
            <h3>Create Task Automation</h3>
            <input
              type="text"
              placeholder="Automation Name"
              value={newAutomation.name}
              onChange={e => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea aria-label="Text area"
              placeholder="Description"
              value={newAutomation.description}
              onChange={e => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <select aria-label="Select option"
              value={newAutomation.trigger}
              onChange={e => setNewAutomation(prev => ({ ...prev, trigger: e.target.value }))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="event">Event-based</option>
            </select>
            <select aria-label="Select option"
              value={newAutomation.templateId}
              onChange={e => setNewAutomation(prev => ({ ...prev, templateId: e.target.value }))}
            >
              <option value="">Select Template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Schedule (e.g., 9:00 AM)"
              value={newAutomation.schedule}
              onChange={e => setNewAutomation(prev => ({ ...prev, schedule: e.target.value }))}
            />

            <div className="form-actions">
              <button onClick={createAutomation} className="submit-btn">Create Automation</button>
              <button onClick={() => setShowAutomationForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
