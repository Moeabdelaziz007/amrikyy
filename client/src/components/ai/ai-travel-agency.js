"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const card_1 = require("../../../components/ui/card");
const AITravelAgency = () => {
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>AI Travel Agency</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <p className="mb-4">Welcome to the AI Travel Agency. Let our AI-powered agents help you plan your next trip.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {
        // Add AI travel agent cards here
        }
        </div>
      </card_1.CardContent>
    </card_1.Card>);
};
exports.default = AITravelAgency;
