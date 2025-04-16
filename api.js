const responses = []

document.getElementById('sendButton').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    const responseText = document.getElementById('responseText');

    // Simulation d'appel à une API
    responseText.textContent = "Chargement...";

    try {
        // Remplacez cette partie par l'appel réel à l'API ChatGPT
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer VOTRE_CLE_API'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userInput }]
            })
        });

        const data = await response.json();
        responseText.textContent = data.choices[0].message.content;
    } catch (error) {
        responseText.textContent = "Erreur lors de la récupération de la réponse.";
        console.error(error);
    }
});