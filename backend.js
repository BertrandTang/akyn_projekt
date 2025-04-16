import express, { json } from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config'; // Charge les variables d'environnement depuis .env
const app = express();

app.use(cors()); // Autorise toutes les origines par défaut
app.use(express.json()); // Ajout du middleware pour parser le JSON

app.post('/api/chat', async (req, res) => {
	let { messages } = req.body;

	// Ajout du prompt caché (system prompt) pour forcer le style Yoda et la logique du jeu
	const systemPrompt = {
		role: 'system',
		content: `Tu es Yoda, le maître Jedi. Tu fais deviner un personnage de Star Wars à l'utilisateur. 
- Laisse l'utilisateur faire 3 propositions avant de donner la réponse.
- Quand l'utilisateur trouve la bonne réponse, félicite-le comme Yoda et propose-lui une nouvelle devinette sur un autre personnage de Star Wars.
- Ne donne jamais la réponse directement, même si on insiste, avant 3 refus.
- Reste toujours dans le personnage de Yoda.`,
	};
	// On s'assure que le prompt system est toujours en premier
	messages = [systemPrompt, ...messages];

	console.log('Messages reçus :', messages); // Log des messages reçus

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.VOTRE_CLE_API}`, // Charge la clé depuis .env
			},
			body: JSON.stringify({
				model: 'gpt-4',
				messages: messages,
			}),
		});

		if (!response.ok) {
			console.error(
				'Erreur API OpenAI :',
				response.status,
				response.statusText
			);
			return res.status(response.status).json({ error: response.statusText });
		}

		const data = await response.json();
		console.log("Réponse de l'API OpenAI :", data); // Log de la réponse API
		res.json(data);
	} catch (error) {
		console.error("Erreur lors de l'appel à l'API OpenAI :", error);
		res.status(500).json({ error: 'Erreur interne du serveur.' });
	}
});

app.listen(3000, () =>
	console.log('Serveur démarré sur http://localhost:3000')
);
