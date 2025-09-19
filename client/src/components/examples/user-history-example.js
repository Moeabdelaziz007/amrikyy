"use strict";
// Example component demonstrating user history tracking usage
// This shows how to integrate tracking into your components
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHistoryExample = UserHistoryExample;
const react_1 = require("react");
const button_1 = require("../ui/button");
const card_1 = require("../ui/card");
const use_user_history_1 = require("../../hooks/use-user-history");
function UserHistoryExample() {
    const { trackNavigation, trackContentInteraction, trackAIInteraction, trackError } = (0, use_user_history_1.useUserHistory)();
    const { trackClick, trackView, trackCreate, trackUpdate, trackDelete } = (0, use_user_history_1.useInteractionTracking)('example-component');
    const { trackFormStart, trackFieldFocus, trackFormSubmit, trackFormAbandon } = (0, use_user_history_1.useFormTracking)('example-form');
    const handleExampleClick = () => {
        trackClick('example-button', {
            component: 'UserHistoryExample',
            action: 'demo_click'
        });
    };
    const handleAIDemo = () => {
        trackAIInteraction('chat', 'demo-agent', {
            message: 'Hello AI!',
            context: 'demo'
        });
    };
    const handleErrorDemo = () => {
        try {
            throw new Error('This is a demo error');
        }
        catch (error) {
            trackError(error, 'demo-error', {
                component: 'UserHistoryExample'
            });
        }
    };
    const handleFormDemo = () => {
        trackFormStart();
        trackFieldFocus('demo-field');
        trackFormSubmit(true, {
            field1: 'demo value',
            field2: 'another value'
        });
    };
    return (<card_1.Card className="max-w-2xl mx-auto">
      <card_1.CardHeader>
        <card_1.CardTitle>User History Tracking Example</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This component demonstrates how to use the user history tracking system.
          Click the buttons below to see different types of tracking in action.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button_1.Button onClick={handleExampleClick} className="w-full">
            Track Click
          </button_1.Button>

          <button_1.Button onClick={handleAIDemo} variant="secondary" className="w-full">
            Track AI Interaction
          </button_1.Button>

          <button_1.Button onClick={handleErrorDemo} variant="destructive" className="w-full">
            Track Error
          </button_1.Button>

          <button_1.Button onClick={handleFormDemo} variant="outline" className="w-full">
            Track Form
          </button_1.Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">What gets tracked:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Page navigation and time spent</li>
            <li>• Button clicks and user interactions</li>
            <li>• Form interactions and submissions</li>
            <li>• AI agent interactions</li>
            <li>• Errors and system events</li>
            <li>• Device and browser information</li>
            <li>• Session duration and activity</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-900">How to use in your components:</h4>
          <pre className="text-xs text-blue-800 overflow-x-auto">
        {`import { useUserHistory, useInteractionTracking } from '@/hooks/use-user-history';

function MyComponent() {
  const { trackContentInteraction } = useUserHistory();
  const { trackClick } = useInteractionTracking('my-component');

  const handleClick = () => {
    trackClick('my-button', { action: 'demo' });
  };

  return <button onClick={handleClick}>Click me</button>;
}`}
          </pre>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.default = UserHistoryExample;
