'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const use_mobile_1 = require('../../hooks/use-mobile');
const card_1 = require('../../components/ui/card');
const accordion_1 = require('../../components/ui/accordion');
const SmartLearningAI = () => {
  const isMobile = (0, use_mobile_1.default)();
  return (
    <card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>Smart Learning AI</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        {isMobile ? (
          <accordion_1.Accordion type="single" collapsible>
            <accordion_1.AccordionItem value="item-1">
              <accordion_1.AccordionTrigger>
                Lesson 1: Introduction
              </accordion_1.AccordionTrigger>
              <accordion_1.AccordionContent>
                <p>
                  This is the content for lesson 1. It is optimized for mobile
                  viewing.
                </p>
              </accordion_1.AccordionContent>
            </accordion_1.AccordionItem>
            <accordion_1.AccordionItem value="item-2">
              <accordion_1.AccordionTrigger>
                Lesson 2: Advanced Topics
              </accordion_1.AccordionTrigger>
              <accordion_1.AccordionContent>
                <p>
                  This is the content for lesson 2. It is optimized for mobile
                  viewing.
                </p>
              </accordion_1.AccordionContent>
            </accordion_1.AccordionItem>
          </accordion_1.Accordion>
        ) : (
          <div>
            <h3 className="font-semibold">Lesson 1: Introduction</h3>
            <p>
              This is the content for lesson 1, designed for larger screens.
            </p>
            <h3 className="font-semibold mt-4">Lesson 2: Advanced Topics</h3>
            <p>
              This is the content for lesson 2, designed for larger screens.
            </p>
          </div>
        )}
      </card_1.CardContent>
    </card_1.Card>
  );
};
exports.default = SmartLearningAI;
