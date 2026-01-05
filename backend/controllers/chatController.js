const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // SIMULATION MODE: If no API Key is provided in .env, return a mock response
        if (!process.env.OPENAI_API_KEY) {
            console.log("No API Key found. Using Simulation Mode.");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
            return res.json({
                response: "[MODE SIMULATION] Je n'ai pas de clé API, mais je fonctionne ! Je peux répondre à vos questions sur les produits, les livraisons (3-5 jours) et les retours (30 jours)."
            });
        }

        // Construct the conversation history for context
        const messages = [
            {
                role: 'system',
                content: `You are a helpful and knowledgeable sales assistant for "KolieShop", a premium e-commerce store.
        Your goal is to assist customers with product inquiries, provide style advice, and help them navigate the store.

        Tone: Professional, friendly, polite, and consistent with a high-end brand.

        Key responsibilities:
        - Answer questions about products (shoes, clothes, electronics, etc.).
        - Suggest products based on user preferences.
        - Explain shipping and return policies (Standard shipping 3-5 days, 30-day returns).
        - If you don't know an answer, politely ask the user to contact support at support@kolieshop.com.
        - Do NOT invent specific product prices or stock levels unless provided in the context (which is currently limited).
        - Keep responses concise and helpful.
        `
            },
            ...(history || []).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error in chatWithAI:', error);

        // Fallback if the API fails even if key is present (e.g. quota exceeded or connection error)
        return res.json({
            response: "[MODE SECOURS] Je rencontre des difficultés techniques avec mon cerveau IA pour le moment, mais je suis là ! Avez-vous besoin d'aide avec une commande ?"
        });
    }
};

module.exports = { chatWithAI };
