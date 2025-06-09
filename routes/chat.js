const express = require('express');
const router = express.Router();
const geminiService = require('../geminiService');

router.post('/', async (req, res) => {
    try {
        const userMessage = req.body.prompt;
        const userId = req.ip;

        if (!userMessage) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        // --- System prompt/persona ---
        const systemPrompt = `أنت "Amrikyy"، مساعد ذكي متخصص في التقنية والعملات الرقمية وتجربة المستخدم. أجب دائماً بأسلوب ودود، حديث، واحترافي، ووضح الإجابات بلغة سهلة مع لمسة من الحماس التقني. إذا كان السؤال متعلقاً بالسيرة الذاتية أو المهارات أو المشاريع، قدّم إجابة مختصرة وواضحة. إذا كان السؤال عن التقنية أو الذكاء الاصطناعي أو العملات الرقمية، أضف لمسة من الشرح المبسط والأمثلة العملية.`;

        // Pass both system prompt and user message to Gemini
        const geminiResponsePayload = await geminiService.generateResponse([
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ]);

        let botResponseText = "";
        if (
            geminiResponsePayload &&
            geminiResponsePayload.candidates &&
            geminiResponsePayload.candidates.length > 0 &&
            geminiResponsePayload.candidates[0].content &&
            geminiResponsePayload.candidates[0].content.parts &&
            geminiResponsePayload.candidates[0].content.parts.length > 0
        ) {
            botResponseText = geminiResponsePayload.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected response structure from Gemini service:', geminiResponsePayload);
            botResponseText = "عفواً، أواجه مشكلة فنية بسيطة. حاول مرة أخرى بعد قليل.";
        }

        // --- الخطوة 4: تحديد ما إذا كان رد البوت يتضمن سؤالاً جديداً لجمع البيانات ---
        const opinionMarkerMatch = botResponseText.match(/\[ASK_OPINION:([\w-]+)\]/);
        const feedbackMarkerMatch = botResponseText.match(/\[ASK_FEEDBACK:([\w-]+)\]/);

        if (opinionMarkerMatch) {
            const topic = opinionMarkerMatch[1];
            await setConversationContext(userId, { awaitingDataFor: `opinion_on_${topic}` });
            console.log(`Bot asked for opinion on ${topic} from user ${userId}. Context set.`);
        } else if (feedbackMarkerMatch) {
            const feature = feedbackMarkerMatch[1];
            await setConversationContext(userId, { awaitingDataFor: `feedback_on_${feature}` });
            console.log(`Bot asked for feedback on ${feature} from user ${userId}. Context set.`);
        }

        res.json({ response: botResponseText });

    } catch (error) {
        console.error('Chat route error:', error);
        res.status(500).json({ response: "عفواً، حدث خطأ ما. يرجى المحاولة مرة أخرى." });
    }
});

module.exports = router;