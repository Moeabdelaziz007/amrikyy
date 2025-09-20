"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemDesignerApp;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
function SystemDesignerApp() {
    const [requirements, setRequirements] = (0, react_1.useState)("");
    const [complexity, setComplexity] = (0, react_1.useState)("medium");
    const [frontend, setFrontend] = (0, react_1.useState)("React");
    const [backend, setBackend] = (0, react_1.useState)("FastAPI");
    const [database, setDatabase] = (0, react_1.useState)("PostgreSQL");
    const [context, setContext] = (0, react_1.useState)("");
    const [output, setOutput] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const executeDesigner = async () => {
        setLoading(true);
        setError(null);
        setOutput(null);
        try {
            const response = await fetch("http://localhost:3001/mcp/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tool: "system_designer",
                    params: {
                        requirements,
                        complexity,
                        technology_stack: {
                            frontend,
                            backend,
                            database
                        },
                        context,
                    },
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to execute System Designer");
            }
            const data = await response.json();
            setOutput(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (<card_1.Card className="w-full">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center gap-2">
          <lucide_react_1.Settings className="h-5 w-5"/> System Designer
        </card_1.CardTitle>
        <p className="text-muted-foreground">
          AI-powered system architecture designer for technical creativity and solution planning.
        </p>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-foreground mb-1">Requirements</label>
          <textarea_1.Textarea id="requirements" placeholder="Describe your system requirements and specifications..." value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-foreground mb-1">Complexity</label>
            <select_1.Select value={complexity} onValueChange={setComplexity}>
              <select_1.SelectTrigger className="w-full">
                <select_1.SelectValue placeholder="Select complexity"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="simple">Simple</select_1.SelectItem>
                <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                <select_1.SelectItem value="complex">Complex</select_1.SelectItem>
                <select_1.SelectItem value="enterprise">Enterprise</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          <div>
            <label htmlFor="frontend" className="block text-sm font-medium text-foreground mb-1">Frontend</label>
            <select_1.Select value={frontend} onValueChange={setFrontend}>
              <select_1.SelectTrigger className="w-full">
                <select_1.SelectValue placeholder="Select frontend"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="React">React</select_1.SelectItem>
                <select_1.SelectItem value="Vue">Vue</select_1.SelectItem>
                <select_1.SelectItem value="Angular">Angular</select_1.SelectItem>
                <select_1.SelectItem value="Svelte">Svelte</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="backend" className="block text-sm font-medium text-foreground mb-1">Backend</label>
            <select_1.Select value={backend} onValueChange={setBackend}>
              <select_1.SelectTrigger className="w-full">
                <select_1.SelectValue placeholder="Select backend"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="FastAPI">FastAPI</select_1.SelectItem>
                <select_1.SelectItem value="Express">Express</select_1.SelectItem>
                <select_1.SelectItem value="Django">Django</select_1.SelectItem>
                <select_1.SelectItem value="Spring">Spring</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          <div>
            <label htmlFor="database" className="block text-sm font-medium text-foreground mb-1">Database</label>
            <select_1.Select value={database} onValueChange={setDatabase}>
              <select_1.SelectTrigger className="w-full">
                <select_1.SelectValue placeholder="Select database"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="PostgreSQL">PostgreSQL</select_1.SelectItem>
                <select_1.SelectItem value="MySQL">MySQL</select_1.SelectItem>
                <select_1.SelectItem value="MongoDB">MongoDB</select_1.SelectItem>
                <select_1.SelectItem value="Redis">Redis</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </div>

        <div>
          <label htmlFor="context" className="block text-sm font-medium text-foreground mb-1">Context (optional)</label>
          <textarea_1.Textarea id="context" placeholder="Additional context for system design" value={context} onChange={(e) => setContext(e.target.value)} rows={2}/>
        </div>

        <button_1.Button onClick={executeDesigner} disabled={loading || !requirements} className="w-full">
          {loading ? (<>
              <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Designing...
            </>) : (<>
              <lucide_react_1.Play className="mr-2 h-4 w-4"/>
              Design System
            </>)}
        </button_1.Button>

        {error && (<div className="mt-4 text-red-500 flex items-center gap-2">
            <lucide_react_1.XCircle className="h-5 w-5"/>
            Error: {error}
          </div>)}

        {output && (<div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/> System Design
            </h3>
            <card_1.Card className="bg-muted/20 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Architecture</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Frontend:</span>
                      <div className="mt-1 space-y-1">
                        <div>Framework: {output.system_design?.architecture?.frontend?.framework}</div>
                        <div>State: {output.system_design?.architecture?.frontend?.state_management}</div>
                        <div>Styling: {output.system_design?.architecture?.frontend?.styling}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Backend:</span>
                      <div className="mt-1 space-y-1">
                        <div>Framework: {output.system_design?.architecture?.backend?.framework}</div>
                        <div>Database: {output.system_design?.architecture?.backend?.database}</div>
                        <div>Cache: {output.system_design?.architecture?.backend?.cache}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Infrastructure:</span>
                      <div className="mt-1 space-y-1">
                        <div>Container: {output.system_design?.architecture?.infrastructure?.containerization}</div>
                        <div>Orchestration: {output.system_design?.architecture?.infrastructure?.orchestration}</div>
                        <div>Monitoring: {output.system_design?.architecture?.infrastructure?.monitoring}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Components</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {output.system_design?.components?.map((component, index) => (<div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {component}
                      </div>))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {output.recommendations?.map((rec, index) => (<li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">Complexity:</span> {output.complexity}
                  </div>
                  <div>
                    <span className="font-medium">Est. Time:</span> {output.estimated_development_time}
                  </div>
                </div>
              </div>
            </card_1.Card>
          </div>)}
      </card_1.CardContent>
    </card_1.Card>);
}





