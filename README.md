# Amrikyy | Cyber Intelligence Portfolio (2025 Neon Edition)

**Live Demo:** [https://amrikyy.github.io/portfolio](https://amrikyy.github.io/portfolio)

---

## 🚀 Overview: The New Amrikyy Experience

Welcome to the all-new, premium digital CV and portfolio for Mohamed H Abdelaziz (Amrikyy). This version features a modern neon/tech aesthetic, a smart animated loader, up-to-date personal and professional information, and interactive features including a bilingual interface and a custom AI chatbot named **Amrikyy**.

---

## 🎨 Design & Features

- **Neon/Tech Aesthetic:** Futuristic, glassy, and glowing UI with dark backgrounds and neon green/blue accents.
- **Animated Loader:** Custom "Amrikyy Cyber Neon Loader" with neon logo, animated progress bar, and user photo.
- **Personalized CV Card:**
  - Name, role, and social/contact links
  - **Personal Information**: Birthdate, age, birthplace, and residency history
  - Education (including El Shaheen High School, Kuwait)
  - Skills, projects, and more
- **Interactivity:**
  - Language toggle (Arabic/English) with full translation support
  - 3D tilt and hover effects
  - Downloadable CV (see `Mohamed_H_Abdelaziz_CV.pdf` in the project root)
  - **AI Chatbot (Amrikyy):**
  - Custom neon-themed chat window
  - Toggleable bubble with smooth open/close
  - Connects to a Replit backend for AI responses
  - Fully branded as "Amrikyy"

---

## 🛠️ Tech Stack

- **HTML5** (index.html)
- **CSS3** (style.css, with variables, glassmorphism, neon effects, and responsive design)
- **JavaScript** (script.js: loader, translation, chatbot logic, interactivity)
- **Font Awesome 6** (icons)
- **Google Fonts:** Orbitron (headings), Cairo (body)

---

## 📁 File Structure

- `index.html` – Main structure: loader, CV card, chatbot, all content
- `style.css` – All styles: neon/glow, loader, CV card, chatbot, responsive
- `script.js` – Loader logic, translation, chatbot toggle, backend integration
- `avatar.jpg` – User profile photo
- `Mohamed_H_Abdelaziz_CV.pdf` – Downloadable CV located in the project root

---

## 🚦 Usage & Customization

1. **Open `index.html`** in your browser.
2. **Edit content** (personal info, skills, etc.) in `index.html` as needed.
3. **Change colors or effects** in `style.css` (see `:root` for variables).
4. **Connect chatbot**: In `script.js`, set your backend endpoint for the chatbot.
5. **Switch language**: Use the toggle button for Arabic/English.

## Adding New Translations

1. Open `translations.js`.
2. Add a new key to the `translations` object using the following format:
   ```javascript
   newKey: {
     ar: 'Arabic text',
     en: 'English text'
   }
   ```
3. Ensure that both `ar` and `en` values are provided.
4. Reference the key in your HTML using the `data-translate` attribute.

## 🖥️ Local Development

1. Install Node.js (v18 or higher recommended).
2. Run `npm install` to install Express and other dependencies.
3. Start the local server with `npm start`.
4. Open `http://localhost:3000` in your browser.

### Syncing AI Tool Data

1. Create a `.env` file with your credentials. Example:

   ```dotenv
   DATA_PROVIDER=notion
   NOTION_API_KEY=secret_key
   NOTION_DATABASE_ID=your_database_id
   ```

   For Firebase, set `DATA_PROVIDER=firebase` and provide `FIREBASE_SERVICE_ACCOUNT_JSON` and `FIREBASE_DATABASE_URL`.

2. Run `npm run sync-tools` to fetch tool records and update `public/aiTools.json`.

The server exposes these records at `/api/tools`.

---

## 🌐 Deployment on Vercel

1. Create a project on Vercel and grab your **Org ID** and **Project ID**.
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository
   secrets on GitHub.
3. Push to the `main` branch and GitHub Actions will deploy the site using the
   provided `vercel.json` configuration.

---

## ✨ Credits

Created by **Mohamed H Abdelaziz (Amrikyy)**

---

*This version reflects all 2025 updates, including the new loader, personal info section, education, translation fixes, and the rebranded Amrikyy chatbot.*
