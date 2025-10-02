# 🤖 AuraOS AI Commands Guide

## Overview
AuraOS features an intelligent command system powered by Google Gemini AI. You can interact with the system using natural language through the **AI Terminal** or **Command Palette**.

---

## 🎯 Accessing AI Features

### **AI Terminal**
- Open from Desktop or use Command Palette
- Type commands in natural language
- Get intelligent responses powered by AI

### **Command Palette**
- Press `Ctrl + Space` anywhere in AuraOS
- Search for commands
- Execute with Enter

---

## 📋 Available Commands

### **System Commands**

#### `status` or `show system status`
Display comprehensive system information including:
- System uptime
- Memory usage (used/total/percentage)
- CPU usage and core count
- Running services count
- Active processes count

**Example:**
```
status
```

**Output:**
```
System Status:
Uptime: 1234s
Memory: 4096MB / 16384MB (25%)
CPU: 15% (8 cores)
Services: 5 running
Processes: 4 active
```

---

#### `services` or `list services`
List all running system services with their status and uptime.

**Example:**
```
services
```

**Output:**
```
Active Services:
  auth: running (1234s)
  settings: running (1234s)
  ai: running (1234s)
  automation: running (1234s)
  mcp: running (1234s)
```

---

#### `processes` or `list processes`
Show all active processes with memory usage.

**Example:**
```
processes
```

**Output:**
```
Active Processes:
  Desktop Environment: active (256MB)
  Window Manager: active (128MB)
  Taskbar: active (64MB)
  Command Palette: idle (32MB)
```

---

#### `uptime`
Show how long the system has been running.

**Example:**
```
uptime
```

**Output:**
```
System uptime: 1234 seconds
```

---

#### `memory` or `show memory usage`
Display detailed memory information.

**Example:**
```
show memory usage
```

---

### **AI Commands**

#### `analyze`
Get AI-powered system analysis with health score and recommendations.

**Example:**
```
analyze
```

**Output:**
```
AI Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Health Score: 85/100

Status: ✅ Excellent

Key Metrics:
• Memory Usage: 25% ✅
• CPU Usage: 15% ✅
• Services: 5 running ✅
• Processes: 4 active ✅

Recommendation: System is operating optimally.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### `summarize`
Get a concise AI summary of the system state.

**Example:**
```
summarize
```

---

#### `ask [question]`
Ask AI any question about the system or general topics.

**Examples:**
```
ask what is the weather like
ask how do I create a new window
ask what features does AuraOS have
```

---

#### `summarize [text]`
Summarize any text using AI.

**Example:**
```
summarize AuraOS is an advanced operating system with AI capabilities...
```

---

### **Notes Commands**

#### `create note [title]`
Create a new note (integration coming soon).

**Example:**
```
create note Meeting Notes
```

---

### **Automation Commands**

#### `create workflow`
Start building a new automation workflow (integration coming soon).

**Example:**
```
create workflow
```

---

## 🎨 Command Palette Commands

### **AI Commands**
- **Summarize this note** - Use AI to summarize text
- **Extract action items** - Find and extract tasks from text

### **System Commands**
- **Show system status** - Display system information
- **List running services** - Show all active services

### **App Commands**
- **Open Terminal** - Launch the terminal application
- **Open Settings** - Launch settings

### **Automation Commands**
- **Create new automation** - Start building a workflow

---

## 💡 Tips & Tricks

### **Natural Language**
You can use natural language! The AI will understand:
- "show me the system status"
- "what services are running"
- "how much memory am I using"
- "analyze the system"

### **Debug Mode**
Add `--debug` to any command to see AI analysis:
```
status --debug
```

### **Help Command**
Type `help` in the terminal to see available commands:
```
help
```

### **Clear Terminal**
Clear the terminal output:
```
clear
```

---

## 🔧 Configuration

### **Gemini API Key**
To enable full AI features, set your Gemini API key in `.env`:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

### **Fallback Mode**
If no API key is configured, AuraOS will use basic command parsing as a fallback.

---

## 🚀 Advanced Usage

### **Chaining Commands**
You can execute multiple commands in sequence (coming soon):
```
status && services && analyze
```

### **Command History**
Use ↑ and ↓ arrows to navigate command history (coming soon).

### **Auto-completion**
Press Tab for command suggestions (coming soon).

---

## 📊 Command Categories

| Category | Icon | Description |
|----------|------|-------------|
| **AI** | 🤖 | AI-powered intelligent commands |
| **System** | ⚙️ | System information and control |
| **App** | 📱 | Application management |
| **Automation** | ⚡ | Workflow and automation |
| **Notes** | 📝 | Note-taking and management |

---

## 🎯 Examples

### **Quick System Check**
```bash
# Terminal
status

# Command Palette
Ctrl+Space → "Show system status"
```

### **AI Analysis**
```bash
# Terminal
analyze

# Get detailed health report with recommendations
```

### **Ask AI**
```bash
# Terminal
ask how do I maximize a window

# AI will provide helpful instructions
```

### **Summarize Text**
```bash
# Command Palette
Ctrl+Space → "Summarize this note"

# AI will summarize the current text
```

---

## 🔮 Coming Soon

- 📝 Full Notes app integration
- ⚡ Automation workflow builder
- 🔄 Command history
- ⌨️ Auto-completion
- 🔗 Command chaining
- 📊 Advanced analytics
- 🎨 Custom commands
- 🌐 Multi-language support

---

## 🆘 Troubleshooting

### **AI Commands Not Working**
1. Check if `VITE_GEMINI_API_KEY` is set in `.env`
2. Verify API key is valid
3. Check browser console for errors
4. Try fallback commands (status, services, etc.)

### **Command Not Recognized**
1. Type `help` to see available commands
2. Try using natural language
3. Check spelling and syntax
4. Use Command Palette for guided selection

### **Slow Response**
1. Check internet connection (AI requires API calls)
2. Try simpler commands
3. Use fallback mode (basic commands)

---

## 📚 Resources

- [AuraOS Documentation](./README.md)
- [Google Gemini API](https://ai.google.dev/)
- [Command Palette Guide](./docs/command-palette.md)
- [Terminal Guide](./docs/terminal.md)

---

**Made with ❤️ by AuraOS Team**
**Powered by Google Gemini AI** 🤖✨
