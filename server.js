const express = require('express');
const cors = require('cors'); // Permet au frontend de parler au backend
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ton point d'entrée API
app.get('/api/message', (req, res) => {
    res.json({
        text: "Salut depuis le serveur Node.js !",
        status: "success",
        timestamp: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});