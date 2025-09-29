import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// IMPORTANT: Create a serviceAccountKey.json file in the backend directory
// with your Firebase Admin SDK credentials.
try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Error initializing Firebase Admin SDK. Make sure 'backend/serviceAccountKey.json' is present and valid.");
  process.exit(1);
}


const db = admin.firestore();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware to simulate user authentication (replace with real auth later)
const fakeAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real app, you would get the user ID from a decoded JWT token.
  // For this example, we'll use a hardcoded user ID.
  req.userId = 'test-user-id';
  next();
};

// --- Notes API Endpoints ---

// GET all notes for a user
app.get('/api/notes', fakeAuth, async (req, res) => {
  try {
    const notesSnapshot = await db.collection('users').doc(req.userId).collection('notes').orderBy('createdAt', 'desc').get();
    const notes = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// POST a new note
app.post('/api/notes', fakeAuth, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const newNote = {
      title,
      content,
      color: color || 'yellow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('users').doc(req.userId).collection('notes').add(newNote);
    res.status(201).json({ id: docRef.id, ...newNote });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

// PUT (update) an existing note
app.put('/api/notes/:id', fakeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color } = req.body;
    const noteRef = db.collection('users').doc(req.userId).collection('notes').doc(id);

    const updatedData = {
      title,
      content,
      color,
      updatedAt: new Date().toISOString(),
    };

    await noteRef.update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

// DELETE a note
app.delete('/api/notes/:id', fakeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(req.userId).collection('notes').doc(id).delete();
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

// --- Autopilot API Endpoints ---

// GET all automation rules for a user
app.get('/api/autopilot/rules', fakeAuth, async (req, res) => {
  try {
    const rulesSnapshot = await db.collection('users').doc(req.userId).collection('automationRules').orderBy('createdAt', 'desc').get();
    const rules = rulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch automation rules.' });
  }
});

// POST a new automation rule
app.post('/api/autopilot/rules', fakeAuth, async (req, res) => {
  try {
    const ruleData = req.body;
    const newRule = {
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRun: null,
      runCount: 0,
      successRate: 0,
      isActive: true,
    };
    const docRef = await db.collection('users').doc(req.userId).collection('automationRules').add(newRule);
    res.status(201).json({ id: docRef.id, ...newRule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create automation rule.' });
  }
});

// PUT (update) an existing automation rule
app.put('/api/autopilot/rules/:id', fakeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('users').doc(req.userId).collection('automationRules').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update automation rule.' });
  }
});

// DELETE an automation rule
app.delete('/api/autopilot/rules/:id', fakeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(req.userId).collection('automationRules').doc(id).delete();
    res.status(200).json({ message: 'Rule deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rule.' });
  }
});

// GET all automation logs for a user
app.get('/api/autopilot/logs', fakeAuth, async (req, res) => {
  try {
    const logsSnapshot = await db.collection('users').doc(req.userId).collection('automationLogs').orderBy('timestamp', 'desc').limit(50).get();
    const logs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch automation logs.' });
  }
});

// --- Automation Engine ---

const executeAction = async (action: any, userId: string) => {
  switch (action.type) {
    case 'create_note':
      console.log(`Executing 'create_note' for user ${userId}`);
      const { title, content, color } = action.parameters;
      const newNote = {
        title: title || 'Automated Note',
        content: content || 'This note was created by an Autopilot rule.',
        color: color || '#F59E0B',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.collection('users').doc(userId).collection('notes').add(newNote);
      return 'Note created successfully.';
    // Add other action types here in the future
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const runAutomationEngine = async () => {
  console.log('Automation engine checking for rules to run...');
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const rulesQuery = db.collection('users').doc(userId).collection('automationRules').where('isActive', '==', true);
    const rulesSnapshot = await rulesQuery.get();

    for (const ruleDoc of rulesSnapshot.docs) {
      const rule = { id: ruleDoc.id, ...ruleDoc.data() } as any;

      // Simple daily schedule check (can be expanded)
      if (rule.trigger.type === 'schedule' && rule.trigger.frequency === 'daily') {
        const now = new Date();
        const lastRun = rule.lastRun ? new Date(rule.lastRun) : null;

        // Check if it hasn't run today
        if (!lastRun || lastRun.getDate() !== now.getDate()) {
          console.log(`Running rule '${rule.name}' for user ${userId}`);
          try {
            for (const action of rule.actions) {
              const message = await executeAction(action, userId);
              // Log success
              await db.collection('users').doc(userId).collection('automationLogs').add({
                ruleId: rule.id,
                ruleName: rule.name,
                status: 'success',
                message,
                timestamp: new Date().toISOString(),
              });
            }
            // Update rule's lastRun time
            await ruleDoc.ref.update({ lastRun: new Date().toISOString() });
          } catch (error) {
            console.error(`Error executing rule ${rule.id}:`, error);
            // Log error
            await db.collection('users').doc(userId).collection('automationLogs').add({
              ruleId: rule.id,
              ruleName: rule.name,
              status: 'error',
              message: error.message,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }
  }
};

// Run the engine every minute
setInterval(runAutomationEngine, 60 * 1000);


app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
