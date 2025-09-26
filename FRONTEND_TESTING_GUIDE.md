# 🧪 **Frontend Testing Guide (No Docker Required)**

## 🚀 **Quick Start**

Since Docker isn't available on your Mac, I've created a simple development environment that works directly with Node.js and Vite.

### **Option 1: Full Development Environment (Recommended)**
```bash
# Start both frontend and mock backend
./start-dev.sh
```

This will start:
- **Mock Backend**: http://localhost:3002
- **Frontend**: http://localhost:3000

### **Option 2: Frontend Only**
```bash
# Start just the frontend (you'll need to start backend separately)
./dev-frontend.sh
```

### **Option 3: Backend Only**
```bash
# Start just the mock backend
node mock-backend.js
```

## 📋 **Testing the TaskQueue Component**

### **1. Access the Application**
1. Open your browser
2. Navigate to **http://localhost:3000**
3. You should see the AuraOS dashboard

### **2. Find the TaskQueue**
1. Look for the **"Task Queue"** tab in the navigation
2. Click on it to access the TaskQueue component

### **3. Test TaskQueue Features**

#### **View Tasks**
- You should see 5 sample tasks with different statuses:
  - **Running**: "Process User Data" (75% complete)
  - **Pending**: "Generate Report" and "Update AI Models"
  - **Completed**: "Clean Database"
  - **Failed**: "Send Notifications"

#### **Filter and Search**
- Use the search box to find tasks by name
- Use the filter dropdown to filter by status (All, Pending, Running, Completed, Failed)
- Try sorting by different criteria

#### **Bulk Operations**
1. Select multiple tasks using checkboxes
2. Use bulk action buttons to:
   - Start multiple tasks
   - Pause multiple tasks
   - Cancel multiple tasks
   - Delete multiple tasks

#### **Individual Task Actions**
- Click action buttons on individual tasks:
  - ▶️ **Start** - Start a pending task
  - ⏸️ **Pause** - Pause a running task
  - 🔄 **Cancel** - Cancel a task
  - 🗑️ **Delete** - Delete a task

#### **Real-time Updates**
- Watch tasks update in real-time (every 5 seconds)
- See progress bars fill up
- Observe status changes

### **4. Test Task Statistics**
- Check the statistics section at the bottom
- Verify counts match the displayed tasks

## 🔧 **Backend API Testing**

You can also test the backend API directly:

### **Health Check**
```bash
curl http://localhost:3002/health
```

### **Get All Tasks**
```bash
curl http://localhost:3002/api/v1/tasks
```

### **Start a Task**
```bash
curl -X POST http://localhost:3002/api/v1/tasks/1/start
```

### **Create a New Task**
```bash
curl -X POST http://localhost:3002/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Task", "description": "A test task", "priority": "medium"}'
```

## 🎨 **UI Features to Test**

### **Responsive Design**
- Resize your browser window
- Test on different screen sizes
- Verify the TaskQueue adapts properly

### **Dark Mode**
- Look for theme toggle buttons
- Test switching between light and dark modes

### **Animations**
- Watch for smooth transitions
- Notice hover effects on buttons
- Observe loading animations

### **Accessibility**
- Test keyboard navigation
- Check screen reader compatibility
- Verify proper ARIA labels

## 🐛 **Troubleshooting**

### **Frontend Won't Start**
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill any process using port 3000
kill -9 $(lsof -ti:3000)

# Try a different port
npx vite --port 3001
```

### **Backend Won't Start**
```bash
# Check if port 3002 is available
lsof -i :3002

# Kill any process using port 3002
kill -9 $(lsof -ti:3002)

# Start backend manually
node mock-backend.js
```

### **Tasks Not Loading**
1. Check browser console for errors
2. Verify backend is running on port 3002
3. Test API endpoint directly: `curl http://localhost:3002/api/v1/tasks`

### **CSS Issues**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R on Mac)
3. Check for CSS syntax errors in console

## 📊 **Expected Results**

### **TaskQueue Component Should Show:**
- ✅ **5 sample tasks** with different statuses
- ✅ **Search functionality** that filters tasks
- ✅ **Filter dropdown** for status filtering
- ✅ **Sort options** for different criteria
- ✅ **Bulk selection** with checkboxes
- ✅ **Action buttons** for each task
- ✅ **Real-time updates** every 5 seconds
- ✅ **Progress bars** for running tasks
- ✅ **Task statistics** at the bottom
- ✅ **Responsive design** on all screen sizes

### **Mock Backend Should Provide:**
- ✅ **Health endpoint** returning status
- ✅ **Tasks API** with full CRUD operations
- ✅ **Real-time task updates** with progress
- ✅ **Error handling** for invalid requests

## 🎯 **Success Criteria**

The frontend testing is successful if:
1. ✅ Frontend loads without errors
2. ✅ TaskQueue component is visible and functional
3. ✅ All interactive features work (search, filter, sort)
4. ✅ Bulk operations work correctly
5. ✅ Individual task actions work
6. ✅ Real-time updates are visible
7. ✅ Responsive design works on different screen sizes
8. ✅ No console errors in browser
9. ✅ Backend API responds correctly
10. ✅ Tasks update automatically

## 🚀 **Next Steps After Testing**

Once you've confirmed everything works:
1. **Deploy to Production** - Use the SSL setup we created
2. **Add More Features** - Implement additional TaskQueue functionality
3. **Connect Real Backend** - Replace mock backend with actual API
4. **Add Tests** - Implement unit and integration tests
5. **Performance Optimization** - Optimize for production use

**Status**: 🎉 **Ready for Testing!**

Run `./start-dev.sh` to begin testing your AuraOS frontend with the new TaskQueue component!
