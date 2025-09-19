"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const firebase_1 = require("../../lib/firebase");
const button_1 = require("../../components/ui/button");
const dialog_1 = require("../../components/ui/dialog");
const textarea_1 = require("../../components/ui/textarea");
const CreatePostDialog = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [content, setContent] = (0, react_1.useState)('');
    const handleCreatePost = () => {
        (0, firebase_1.trackEvent)('create_post', { post_length: content.length });
        // Add post creation logic here
        setIsOpen(false);
    };
    return (<dialog_1.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <dialog_1.DialogTrigger asChild>
        <button_1.Button>Create Post</button_1.Button>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Create a new post</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>
        <textarea_1.Textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)}/>
        <button_1.Button onClick={handleCreatePost}>Post</button_1.Button>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
};
exports.default = CreatePostDialog;
