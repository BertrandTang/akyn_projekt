import express, { json } from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config'; // Charge les variables d'environnement depuis .env
const app = express();

app.use(cors()); // Autorise toutes les origines par défaut
app.use(express.json()); // Ajout du middleware pour parser le JSON

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    console.log('Messages reçus :', messages); // Log des messages reçus

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VOTRE_CLE_API}` // Charge la clé depuis .env
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages
            })
        });

        if (!response.ok) {
            console.error('Erreur API OpenAI :', response.status, response.statusText);
            return res.status(response.status).json({ error: response.statusText });
        }

        const data = await response.json();
        console.log('Réponse de l\'API OpenAI :', data); // Log de la réponse API
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API OpenAI :', error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));