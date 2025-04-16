const messages = []; // Initialisation correcte du tableau des messages

document.getElementById('sendButton').addEventListener('click', async () => {
	const userInput = document.getElementById('userInput').value;
	const responseText = document.getElementById('responseText');
	const messageZone = document.querySelector('.message_zone');

	// Ajout du message utilisateur dans l'historique
	const userMessageDiv = document.createElement('div');
	userMessageDiv.className = 'message human';
	userMessageDiv.textContent = userInput;
	messageZone.appendChild(userMessageDiv);

	try {
		document.getElementById('userInput').value = '';
		messages.push({ role: 'user', content: `"${userInput}"` }); // Ajout du message utilisateur

		const response = await fetch('http://localhost:3000/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: messages }),
		});

		const data = await response.json();

		const assistantMessage = data.choices[0].message.content; // Ajout de la réponse de l'assistant
		messages.push({ role: 'assistant', content: assistantMessage });

		// Ajout de la réponse de l'assistant dans l'historique
		const assistantMessageDiv = document.createElement('div');
		assistantMessageDiv.className = 'message gpt';
		assistantMessageDiv.textContent = assistantMessage;
		messageZone.appendChild(assistantMessageDiv);
	} catch (error) {
		console.error(error);
	}
});

// Ajout de la validation par la touche Entrée
const userInputField = document.getElementById('userInput');
if (userInputField) {
	userInputField.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			document.getElementById('sendButton').click();
		}
	});
}

window.addEventListener('DOMContentLoaded', () => {
	const startBtn = document.getElementById('startGameBtn');
	const starterZone = document.querySelector('.starter_zone');
	const chatZone = document.querySelector('.chat_zone');
	const messageZone = document.querySelector('.message_zone');
	if (startBtn && starterZone && chatZone) {
		startBtn.addEventListener('click', async () => {
			starterZone.style.display = 'none';
			chatZone.style.display = 'flex';
			// Prompt initial pour lancer le jeu
			const initialPrompt =
				"Fais deviner un personnage de l'univers Star Wars en incarnant Yoda. Fais moi deviner un personnage de Star Wars mais ne me donne pas la réponse. Si j'ai la bonne réponse, propose moi de rejouer.";
			messages.push({ role: 'user', content: initialPrompt });
			// Affiche un message de chargement
			const loadingDiv = document.createElement('div');
			loadingDiv.className = 'message gpt';
			loadingDiv.textContent = 'Chargement...';
			messageZone.appendChild(loadingDiv);
			try {
				const response = await fetch('http://localhost:3000/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: messages }),
				});
				const data = await response.json();
				const assistantMessage = data.choices[0].message.content;
				messages.push({ role: 'assistant', content: assistantMessage });
				// Remplace le message de chargement par la réponse de l'IA
				loadingDiv.textContent = assistantMessage;
			} catch (error) {
				loadingDiv.textContent =
					'Erreur lors de la récupération de la réponse.';
				console.error(error);
			}
		});
	}
});
