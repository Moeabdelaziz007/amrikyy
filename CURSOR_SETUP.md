# 🖱️ Cursor IDE Setup for AuraOS (Without Docker)

## 🚫 Problem
Cursor tries to open Dev Container but Docker is not available on Mac.

## ✅ Solution
Dev Container has been disabled. You can now use Cursor normally without Docker.

---

## 📁 Changes Made

### 1. **Disabled Dev Container**
```bash
# Renamed .devcontainer to .devcontainer.disabled
mv .devcontainer .devcontainer.disabled
```

### 2. **Created .cursorignore**
Tells Cursor to ignore Docker-related files:
- `.devcontainer/`
- `docker-compose.yml`
- `Dockerfile*`
- And other unnecessary files

### 3. **Created .vscode/settings.json**
Configured Cursor/VSCode settings:
- ✅ Disabled Dev Container prompts
- ✅ Format on save (Prettier)
- ✅ ESLint auto-fix
- ✅ TypeScript settings
- ✅ File exclusions
- ✅ Tailwind CSS support

---

## 🚀 How to Use Cursor

### **1. Open Project**
```bash
# In Cursor
File → Open Folder → Select /workspace
```

### **2. Install Dependencies**
```bash
# In Cursor's terminal
npm install
```

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Build for Production**
```bash
npm run build
```

---

## 🔧 Recommended Extensions

Install these extensions in Cursor:

### **Essential:**
- ✅ **ESLint** - `dbaeumer.vscode-eslint`
- ✅ **Prettier** - `esbenp.prettier-vscode`
- ✅ **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`

### **TypeScript:**
- ✅ **TypeScript Vue Plugin** - `Vue.volar`
- ✅ **Path Intellisense** - `christian-kohler.path-intellisense`

### **React:**
- ✅ **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
- ✅ **Auto Rename Tag** - `formulahendry.auto-rename-tag`

### **Git:**
- ✅ **GitLens** - `eamodio.gitlens`
- ✅ **Git Graph** - `mhutchie.git-graph`

### **Utilities:**
- ✅ **Error Lens** - `usernamehw.errorlens`
- ✅ **Import Cost** - `wix.vscode-import-cost`
- ✅ **Color Highlight** - `naumovs.color-highlight`

---

## ⚙️ Cursor Settings

### **Format on Save**
Already enabled in `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### **ESLint Auto-Fix**
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### **TypeScript Settings**
```json
{
  "typescript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

---

## 🎯 Keyboard Shortcuts

### **Essential:**
- `Cmd + P` - Quick file open
- `Cmd + Shift + P` - Command palette
- `Cmd + B` - Toggle sidebar
- `Cmd + J` - Toggle terminal
- `Cmd + /` - Toggle comment
- `Cmd + D` - Select next occurrence
- `Cmd + Shift + F` - Search in files
- `Cmd + Shift + H` - Replace in files

### **Code Navigation:**
- `Cmd + Click` - Go to definition
- `Cmd + Shift + O` - Go to symbol
- `F12` - Go to definition
- `Shift + F12` - Find all references
- `Cmd + T` - Go to file

### **Editing:**
- `Option + Up/Down` - Move line up/down
- `Shift + Option + Up/Down` - Copy line up/down
- `Cmd + Shift + K` - Delete line
- `Cmd + Enter` - Insert line below
- `Cmd + Shift + Enter` - Insert line above

---

## 🐛 Troubleshooting

### **Problem: Dev Container prompt still appears**
**Solution:**
1. Close Cursor completely
2. Delete `.devcontainer` folder if it exists
3. Reopen project
4. If prompted, click "Don't show again"

### **Problem: ESLint not working**
**Solution:**
```bash
# Install ESLint
npm install -D eslint

# Restart Cursor
Cmd + Shift + P → "Reload Window"
```

### **Problem: Prettier not formatting**
**Solution:**
1. Install Prettier extension
2. Set as default formatter:
   ```
   Cmd + Shift + P → "Format Document With..."
   → Select "Prettier"
   → Check "Set as default formatter"
   ```

### **Problem: TypeScript errors**
**Solution:**
```bash
# Restart TypeScript server
Cmd + Shift + P → "TypeScript: Restart TS Server"
```

### **Problem: Import paths not working**
**Solution:**
Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 📊 Project Structure

```
/workspace
├── src/
│   ├── apps/           # Applications (Terminal, Notes, etc.)
│   ├── components/     # Reusable components
│   ├── core/          # Core services (AI, Auth, MCP)
│   ├── shell/         # Desktop shell (WindowManager, etc.)
│   ├── styles/        # CSS files
│   └── App.tsx        # Main app component
├── public/            # Static assets
├── .vscode/           # Cursor/VSCode settings
├── .cursorignore      # Files to ignore in Cursor
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── vite.config.ts     # Vite config
└── tailwind.config.js # Tailwind config
```

---

## 🎨 Code Style

### **TypeScript:**
```typescript
// Use single quotes
import { Component } from 'react';

// Use arrow functions
const MyComponent: React.FC = () => {
  return <div>Hello</div>;
};

// Use interfaces for props
interface Props {
  name: string;
  age?: number;
}
```

### **React:**
```tsx
// Functional components with TypeScript
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
};
```

### **Tailwind CSS:**
```tsx
// Use Tailwind classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  <span className="text-lg font-semibold">Hello</span>
</div>
```

---

## 🚀 Development Workflow

### **1. Start Development:**
```bash
npm run dev
```

### **2. Make Changes:**
- Edit files in `src/`
- Hot reload will update automatically
- Check browser console for errors

### **3. Format Code:**
```bash
# Manual format
npm run format

# Or use Cmd + Shift + P → "Format Document"
```

### **4. Lint Code:**
```bash
npm run lint
```

### **5. Build:**
```bash
npm run build
```

### **6. Preview Build:**
```bash
npm run preview
```

---

## 📚 Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [AuraOS AI Commands](./AI_COMMANDS.md)

---

## ✅ Checklist

Before starting development:
- [ ] Cursor installed
- [ ] Project opened in Cursor
- [ ] Extensions installed
- [ ] `npm install` completed
- [ ] Dev server running (`npm run dev`)
- [ ] No Dev Container prompts
- [ ] Format on save working
- [ ] ESLint working
- [ ] TypeScript working

---

## 🎉 You're Ready!

Cursor is now configured to work perfectly with AuraOS without Docker.

**Happy coding!** 🚀✨

---

**Made with ❤️ by AuraOS Team**
