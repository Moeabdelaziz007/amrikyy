'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const OptimizedImage_1 = require('../components/OptimizedImage');
const card_1 = require('../components/ui/card');
const SocialFeedExample = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <card_1.Card key={i}>
          <card_1.CardContent>
            <OptimizedImage_1.default
              src={`https://source.unsplash.com/random/400x300?sig=${i}`}
              alt={`Social media image ${i}`}
              className="w-full h-48 object-cover rounded-md"
              placeholder={
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
              }
            />
            <div className="p-4">
              <h3 className="font-semibold">Post Title</h3>
              <p className="text-sm text-gray-500">
                This is an example of a social media post with an optimized
                image.
              </p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      ))}
    </div>
  );
};
exports.default = SocialFeedExample;
