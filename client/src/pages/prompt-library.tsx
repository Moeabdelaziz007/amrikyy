'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = PromptLibraryPage;
const prompt_library_app_1 = require('@/apps/prompt-library/prompt-library-app');
function PromptLibraryPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">Prompt Library</h1>
              <p className="text-muted-foreground mt-2">
                Curated ChatGPT prompts from the awesome-chatgpt-prompts
                repository
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-7xl mx-auto">
            <prompt_library_app_1.default />
          </div>
        </div>
      </div>
    </div>
  );
}
