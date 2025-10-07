# Guide de configuration n8n pour BeeBot

## Problème actuel
Votre workflow n8n renvoie l'erreur: `{"message":"Error in workflow"}`

## Solution: Créer un workflow minimal qui fonctionne

### Option 1: Importer le workflow (RECOMMANDÉ)

1. **Ouvrez n8n** → `http://localhost:5678`
2. Cliquez sur **"+"** (nouveau workflow) en haut à gauche
3. Cliquez sur les **3 points** (menu) en haut à droite
4. Sélectionnez **"Import from File"**
5. Choisissez le fichier `n8n-workflow-minimal.json` (dans ce dossier)
6. Le workflow s'ouvrira automatiquement
7. Cliquez sur **"Save"** puis activez le workflow (toggle vert en haut à droite)
8. **Testez** en envoyant un message depuis votre interface BeeBot

### Option 2: Créer manuellement le workflow

#### Étape 1: Créer un nouveau workflow
- Dans n8n, cliquez sur **"+"** pour créer un nouveau workflow

#### Étape 2: Ajouter le Chat Trigger
1. Cliquez sur **"Add first step"**
2. Cherchez **"Chat Trigger"**
3. Configurez:
   - **Webhook ID**: `4c0e5d95-ca09-49b7-8e80-5f9cdd9415af`
   - **Path**: Laissez par défaut ou mettez `/chat`
   - L'URL finale doit être: `http://localhost:5678/webhook/4c0e5d95-ca09-49b7-8e80-5f9cdd9415af/chat`

#### Étape 3: Ajouter un nœud Code
1. Cliquez sur le **"+"** après le Chat Trigger
2. Cherchez **"Code"**
3. Collez ce code JavaScript:

```javascript
// Récupère le message de l'utilisateur
const userMessage = $input.item.json.chatInput || $input.item.json.message || 'Bonjour';

// Crée une réponse simple
const response = `Bonjour! 👋 Vous avez dit: "${userMessage}". Comment puis-je vous aider aujourd'hui?`;

// Retourne la réponse au format attendu par le Chat Trigger
return {
  output: response
};
```

#### Étape 4: Activer le workflow
1. Cliquez sur **"Save"** en haut à droite
2. Activez le workflow avec le **toggle** (doit être vert)

#### Étape 5: Tester
1. Allez sur votre application BeeBot: `http://localhost:8080`
2. Envoyez un message (ex: "salut")
3. Vous devriez recevoir: "Bonjour! 👋 Vous avez dit: "salut". Comment puis-je vous aider aujourd'hui?"

## Structure des données envoyées par le frontend

Votre frontend envoie ces données au webhook:

```json
{
  "message": "texte du message utilisateur",
  "mode": "chat",
  "timestamp": "2025-10-02T10:36:00.000Z",
  "context": "health_advice",
  "conversationId": "1234567890",
  "history": [
    {
      "role": "user",
      "content": "message précédent",
      "timestamp": "2025-10-02T10:35:00.000Z"
    }
  ]
}
```

## Champs disponibles dans le nœud Code

- `$input.item.json.message` → Le message de l'utilisateur
- `$input.item.json.chatInput` → Alternative (utilisé par Chat Trigger)
- `$input.item.json.mode` → Mode actuel ("chat", "reasoning", "image", "research")
- `$input.item.json.history` → Historique des 10 derniers messages
- `$input.item.json.conversationId` → ID de la conversation

## Format de réponse attendu

Le Chat Trigger attend que vous retourniez un objet avec le champ `output`:

```javascript
return {
  output: "Votre réponse ici"
};
```

Le frontend lit ensuite `response`, `reply`, `output`, ou `text` depuis la réponse JSON.

## Debugging

### Si vous voyez "Error in workflow"
1. Allez dans **Executions** (menu gauche)
2. Cliquez sur l'exécution en erreur (rouge)
3. Regardez quel nœud a l'icône d'erreur rouge
4. Cliquez dessus et lisez l'erreur dans l'onglet "Error"

### Si le workflow ne se déclenche pas
- Vérifiez que le workflow est **activé** (toggle vert)
- Vérifiez que l'URL du webhook est exactement: `http://localhost:5678/webhook/4c0e5d95-ca09-49b7-8e80-5f9cdd9415af/chat`
- Testez l'URL directement avec curl:
  ```bash
  curl -X POST http://localhost:5678/webhook/4c0e5d95-ca09-49b7-8e80-5f9cdd9415af/chat \
    -H "Content-Type: application/json" \
    -d '{"chatInput":"test"}'
  ```

## Prochaines étapes (optionnel)

Une fois que le workflow minimal fonctionne, vous pouvez:

1. **Ajouter une IA** (OpenAI, Claude, etc.)
   - Ajoutez un nœud "OpenAI Chat Model" entre le Chat Trigger et le Code
   - Configurez votre clé API
   - Utilisez l'historique pour le contexte

2. **Gérer les modes** (reasoning, image, research)
   - Ajoutez un nœud "Switch" pour router selon `$input.item.json.mode`
   - Créez des branches différentes pour chaque mode

3. **Sauvegarder l'historique**
   - Ajoutez un nœud de base de données (PostgreSQL, MongoDB, etc.)
   - Stockez les conversations avec `conversationId`

## Support

Si le workflow minimal ne fonctionne toujours pas:
1. Vérifiez que n8n est bien démarré sur `http://localhost:5678`
2. Vérifiez que le workflow est activé
3. Consultez les logs n8n dans le terminal où vous avez lancé n8n
4. Copiez le message d'erreur exact depuis "Executions" → exécution en erreur
