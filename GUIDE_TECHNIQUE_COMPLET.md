# 📘 GUIDE TECHNIQUE COMPLET - Application EPI SMPM

## 1️⃣ COMPOSANTS & FICHIERS

### Structure des fichiers
```
src/
├── index.js           → Point d'entrée React (10 lignes)
├── index.html         → HTML root (16 lignes)
├── App.jsx            → Composant principal (398 lignes)
├── App.css            → Styles App (542 lignes)
├── components/
│   ├── AlertButton.jsx    → Composant alertes (269 lignes)
│   └── AlertButton.css    → Styles AlertButton (268 lignes)
│
api/
├── sheets.js          → Handler Vercel (126 lignes)
│
config/
├── package.json       → Dépendances
├── vercel.json        → Config Vercel
└── README.md          → Documentation
```

---

## 2️⃣ COMPOSANTS REACT EN DÉTAIL

### **App.jsx** - Composant Principal (398 lignes)

#### État Local (useState)
```javascript
const [personnel, setPersonnel] = useState([])
// Stocke tous les agents de Google Sheets

const [loading, setLoading] = useState(false)
// Indicateur chargement API

const [activeTab, setActiveTab] = useState('agents')
// Tab active: 'agents' | 'inverse' | 'alarms'

const [searchAgent, setSearchAgent] = useState('')
// Filtre agents par nom (live search)

const [selectedAgent, setSelectedAgent] = useState(null)
// Agent actuellement visualisé (pour modal)

const [editingAgent, setEditingAgent] = useState(null)
// Agent en mode édition

const [editData, setEditData] = useState({})
// Données du formulaire en édition
// Clés: nom, prenom, baudrier_type, baudrier_num, baudrier_date, etc.

const [searchNumber, setSearchNumber] = useState('')
// Recherche inverse par numéro d'équipement

const [inverseResults, setInverseResults] = useState([])
// Résultats recherche inverse
```

#### Fonctions Principales

**1. loadPersonnel()**
```javascript
async function loadPersonnel() {
  setLoading(true)
  try {
    const response = await fetch('/api/sheets')
    const data = await response.json()
    setPersonnel(data.personnel || [])
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    setLoading(false)
  }
}
```
- Appelée au montage du composant (useEffect)
- Récupère tous les agents depuis Google Sheets
- Gère les erreurs et l'indicateur loading

**2. Filtrage & Recherche**
```javascript
// Recherche agent par nom (Tab 1)
const filteredAgents = personnel.filter(p => 
  (p.nom + ' ' + p.prenom)
    .toLowerCase()
    .includes(searchAgent.toLowerCase())
)

// Recherche inverse par numéro (Tab 2)
useEffect(() => {
  if (!searchNumber.trim()) {
    setInverseResults([])
    return
  }
  
  const results = []
  personnel.forEach(p => {
    if (p.baudrier_num?.includes(searchNumber)) {
      results.push({ agent: p, epi: 'BAUDRIER', ... })
    }
    // Répété pour 6 types d'EPI
  })
  setInverseResults(results)
}, [searchNumber, personnel])
```

**3. Édition & Sauvegarde**
```javascript
function handleEdit(agent, rowIndex) {
  setEditingAgent(rowIndex)
  setEditData({ ...agent })  // Copie shallow
}

async function handleSave() {
  try {
    const response = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updatePersonnel',
        rowIndex: editingAgent,
        data: editData
      })
    })
    
    if (response.ok) {
      await loadPersonnel()  // Rechargement
      handleCancel()         // Fermeture modal
    }
  } catch (error) {
    console.error('Erreur save:', error)
  }
}

function handleCancel() {
  setEditingAgent(null)
  setEditData({})
  setSelectedAgent(null)
}
```

**4. Gestion Modale**
```javascript
function openModal(agent, index) {
  setSelectedAgent(index)
  setEditingAgent(null)
  setEditData({})
}

function closeModal() {
  setSelectedAgent(null)
  setEditingAgent(null)
  setEditData({})
}
```

#### Rendu (render)
```javascript
return (
  <div className="app">
    {/* Header avec logo + statut */}
    <div className="header">
      <div className="header-left">
        <h1>EPI SMPM</h1>
        <p>Gestion Équipements Protection</p>
      </div>
      <div className="header-right">
        <AlertButton agents={personnel} />
        <button onClick={loadPersonnel}>🔄 Rafraîchir</button>
      </div>
    </div>

    {/* Navigation tabs */}
    <div className="tabs-wrapper">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >Agents</button>
        <button 
          className={`tab ${activeTab === 'inverse' ? 'active' : ''}`}
          onClick={() => setActiveTab('inverse')}
        >Recherche Inverse</button>
      </div>
    </div>

    {/* Tab 1: Agents */}
    {activeTab === 'agents' && (
      <>
        <div className="search-box">
          <input 
            className="search-input"
            placeholder="Chercher un agent..."
            value={searchAgent}
            onChange={e => setSearchAgent(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="agents-grid">
            {filteredAgents.map((agent, idx) => (
              <button 
                key={idx}
                className="agent-button"
                onClick={() => openModal(agent, idx)}
              >
                <span className="agent-name">
                  {agent.nom} {agent.prenom}
                </span>
              </button>
            ))}
          </div>
        )}
      </>
    )}

    {/* Tab 2: Recherche Inverse */}
    {activeTab === 'inverse' && (
      <>
        <div className="search-box">
          <input 
            className="search-input"
            placeholder="Chercher un numéro d'équipement..."
            value={searchNumber}
            onChange={e => setSearchNumber(e.target.value)}
          />
        </div>
        
        {inverseResults.length > 0 ? (
          <div className="inverse-results">
            {inverseResults.map((result, idx) => (
              <div key={idx} className="inverse-card">
                {/* Affiche agent + EPI + dates + statut */}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            Aucun équipement trouvé
          </div>
        )}
      </>
    )}

    {/* Modal détail agent */}
    {selectedAgent !== null && (
      <div className="modal-bg open">
        <div className="modal">
          <div className="modal-header">
            <h3>
              {personnel[selectedAgent]?.nom} 
              {' '} 
              {personnel[selectedAgent]?.prenom}
            </h3>
            <button 
              className="close-btn"
              onClick={closeModal}
            >✕</button>
          </div>

          <div className="modal-body">
            {!editingAgent ? (
              /* Vue détails */
              <>
                <div className="epi-grid">
                  {/* 6 EPI cards */}
                </div>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(personnel[selectedAgent], selectedAgent)}
                >Éditer</button>
              </>
            ) : (
              /* Formulaire édition */
              <form className="edit-form">
                {/* 20 inputs */}
                <button className="btn-save" onClick={handleSave}>
                  Enregistrer
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  Annuler
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)
```

---

### **AlertButton.jsx** - Composant Alertes (269 lignes)

#### État Local
```javascript
const [alerts, setAlerts] = useState([])
// Tableau des alertes détectées
// Structure: { agent, epiType, marque, numero, year, severity }

const [showModal, setShowModal] = useState(false)
// Affichage modal alertes
```

#### Logique de Détection (useEffect)
```javascript
useEffect(() => {
  if (!agents || agents.length === 0) {
    setAlerts([])
    return
  }

  const currentYear = new Date().getFullYear()  // 2026
  const found = []

  agents.forEach((agent) => {
    const agentName = agent.nom + ' ' + agent.prenom

    // Scanner chaque type d'EPI
    [
      { type: 'BAUDRIER', typeField: 'baudrier_type', dateField: 'baudrier_date', numField: 'baudrier_num' },
      { type: 'CASQUE', typeField: 'casque_type', dateField: 'casque_date', numField: 'casque_num' },
      { type: 'LONGE', typeField: 'longe_type', dateField: 'longe_date', numField: 'longe_num' },
      { type: 'MOUSQUETON', typeField: 'mousq_type', dateField: 'mousq_date', numField: 'mousq_num1' },
      { type: 'DESCENDEUR', typeField: 'desc_type', dateField: 'desc_date', numField: 'desc_num' },
      { type: 'POIGNEE', typeField: 'poig_type', dateField: 'poig_date', numField: 'poig_num' }
    ].forEach(epi => {
      const typeVal = agent[epi.typeField]
      const dateVal = agent[epi.dateField]
      const numVal = agent[epi.numField]

      if (!typeVal || !dateVal) return

      const year = parseInt(String(dateVal).trim(), 10)
      if (isNaN(year)) return

      // Classification
      let severity = 'ok'
      if (year < currentYear) severity = 'expired'        // Expiré
      else if (year === currentYear) severity = 'warning'  // Année courante

      if (severity === 'ok') return  // Ignore si OK

      found.push({
        agent: agentName,
        epiType: epi.type,
        marque: typeVal,
        numero: numVal || 'N/A',
        year: year,
        severity: severity
      })
    })
  })

  setAlerts(found)
}, [agents])
```

**Exemple:**
- Agent: Dupont Jean
- BAUDRIER: Petzl (2024) → OK si currentYear=2026
- CASQUE: SafeHead (2026) → WARNING (année courante)
- MOUSQUETON: (2023) → EXPIRED (passé)

#### Rendu Modal
```javascript
return (
  <>
    {/* Bouton alarme avec badge */}
    <button onClick={() => setShowModal(true)} className="alarm-button">
      🔔
      {alerts.length > 0 && (
        <span className="alarm-badge">{alerts.length}</span>
      )}
    </button>

    {/* Modal alarmes */}
    {showModal && (
      <div className="alarm-modal-bg open">
        <div className="alarm-modal">
          <div className="alarm-modal-header">
            <h2>ALERTES EXPIRATION ({alerts.length})</h2>
            <button onClick={() => setShowModal(false)} className="alarm-close">
              ✕
            </button>
          </div>

          <div className="alarm-modal-body">
            {/* Alertes EXPIRED (rouges) */}
            {expiredAlerts.length > 0 && (
              <>
                <div className="alarm-section-header">EXPIRE ({expiredAlerts.length})</div>
                {expiredAlerts.map((alert, idx) => (
                  <div key={idx} className="alarm-item expired">
                    <strong>{alert.agent}</strong><br/>
                    EPI: {alert.epiType}<br/>
                    Marque: {alert.marque}<br/>
                    Numéro: {alert.numero}<br/>
                    Expiration: {alert.year}
                  </div>
                ))}
              </>
            )}

            {/* Alertes WARNING (orange) */}
            {warningAlerts.length > 0 && (
              <>
                <div className="alarm-section-header">ATTENTION ({warningAlerts.length})</div>
                {warningAlerts.map((alert, idx) => (
                  <div key={idx} className="alarm-item warning">
                    {/* Même affichage que EXPIRED */}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </>
)
```

---

## 3️⃣ API BACKEND - sheets.js (126 lignes)

### Architecture
```
Vercel Serverless Function
  ↓
GET /api/sheets → readSheet('EPI PERSONNELS SMPM')
POST /api/sheets → updatePersonnel(rowIndex, data)
  ↓
Google Sheets API v4
  ↓
Google Sheets (GOOGLE_SHEET_ID)
```

### Authentification
```javascript
function getAuth() {
  // Parse la clé de service depuis variable d'env
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  
  // Crée client authentifié
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
}
```

### GET /api/sheets
```javascript
async function handler(req, res) {
  if (req.method === 'GET') {
    const personnel = await readSheet('EPI PERSONNELS SMPM')
    
    return res.status(200).json({
      personnel: personnel || []
    })
  }
}
```

**Réponse:**
```json
{
  "personnel": [
    {
      "nom": "Dupont",
      "prenom": "Jean",
      "baudrier_type": "Petzl",
      "baudrier_num": "ABC123",
      "baudrier_date": "2025",
      // ... 14 autres champs
    },
    // ... autres agents
  ]
}
```

### POST /api/sheets
```javascript
if (req.method === 'POST') {
  const { action, rowIndex, data } = req.body

  if (action === 'updatePersonnel' && rowIndex !== undefined && data) {
    await updatePersonnel(rowIndex, data)
    return res.status(200).json({ success: true })
  }

  return res.status(400).json({ error: 'Action non reconnue' })
}
```

**Body attendu:**
```json
{
  "action": "updatePersonnel",
  "rowIndex": 0,
  "data": {
    "nom": "Dupont",
    "prenom": "Jean",
    "baudrier_type": "Petzl",
    "baudrier_num": "ABC123",
    "baudrier_date": "2025",
    // ... 14 autres champs
  }
}
```

### Gestion des Erreurs
```javascript
try {
  // Opération
} catch (error) {
  console.error('Erreur:', error.message)
  return res.status(500).json({
    error: error.message || 'Erreur serveur'
  })
}
```

**Codes HTTP:**
- 200: Succès
- 400: Action non reconnue
- 405: Méthode non autorisée
- 500: Erreur serveur (creds manquante, API down, etc.)

---

## 4️⃣ STRUCTURE GOOGLE SHEETS

### Feuille: "EPI PERSONNELS SMPM"

| Colonne | Champ | Type | Exemple |
|---------|-------|------|---------|
| A | nom | String | Dupont |
| B | prenom | String | Jean |
| C | baudrier_type | String | Petzl |
| D | baudrier_num | String | ABC123 |
| E | baudrier_date | Year | 2025 |
| F | casque_type | String | SafeHead |
| G | casque_num | String | DEF456 |
| H | casque_date | Year | 2024 |
| I | longe_type | String | Simond |
| J | longe_num | String | GHI789 |
| K | longe_date | Year | 2025 |
| L | mousq_type | String | Petzl |
| M | mousq_num1 | String | JKL012 |
| N | mousq_num2 | String | MNO345 |
| O | desc_type | String | DMM |
| P | desc_num | String | PQR678 |
| Q | desc_date | Year | 2023 |
| R | poig_type | String | Petzl |
| S | poig_num | String | STU901 |
| T | poig_date | Year | 2026 |

**Ligne 1:** Headers (obligatoires)  
**Ligne 2+:** Agents (données)

### Format Données
- **Dates:** Année seulement (YYYY), ex: `2025`
- **Numéros:** String alphanumérique, ex: `ABC123`
- **Types:** String libre, ex: `Petzl`, `SafeHead`
- **Noms/Prénoms:** String libre

### Conversion Interne
```javascript
// Les headers sont convertis en clés state
"Baudrier Type" → "baudrier_type"
"Baudrier Num" → "baudrier_num"
"Baudrier Date" → "baudrier_date"

// Conversion:
// 1. Minuscules
// 2. Espaces → underscores
```

---

## 5️⃣ FLUX DE COMMUNICATION

### Initialisation
```
1. React App mount
   ↓
2. useEffect → loadPersonnel()
   ↓
3. fetch('/api/sheets')
   ↓
4. Vercel handler (GET)
   ↓
5. readSheet('EPI PERSONNELS SMPM')
   ↓
6. Google Sheets API → Récupère données
   ↓
7. Parse rows & map to personnel[]
   ↓
8. Response JSON
   ↓
9. setPersonnel(data.personnel)
   ↓
10. Re-render App avec agents
```

### Édition Agent
```
1. Utilisateur clique "Éditer"
   ↓
2. setEditingAgent(index)
3. setEditData({...agent})
   ↓
4. Utilisateur modifie editData
   ↓
5. onClick "Enregistrer"
   ↓
6. POST /api/sheets
   Body: { action: 'updatePersonnel', rowIndex: X, data: {...} }
   ↓
7. Vercel handler (POST)
   ↓
8. updatePersonnel(rowIndex, data)
   ↓
9. Construit array [20 values]
   ↓
10. sheets.spreadsheets.values.update()
    Range: "EPI PERSONNELS SMPM!A{rowIndex}:T{rowIndex}"
   ↓
11. Google Sheets écrit ligne
   ↓
12. Response: { success: true }
   ↓
13. loadPersonnel() (reload complet)
   ↓
14. setPersonnel(updated)
15. closeModal()
```

### Recherche Inverse
```
1. Utilisateur tape numéro dans Tab 2
   ↓
2. onChange → setSearchNumber(value)
   ↓
3. useEffect déclenché (searchNumber dépendance)
   ↓
4. Boucle: personnel.forEach()
   ↓
5. Pour chaque agent, cherche numéro dans:
   - baudrier_num, casque_num, longe_num, mousq_num1, mousq_num2, desc_num, poig_num
   ↓
6. Match trouvé → construit result object:
   { agent, epiType, marque, numero, year, severity }
   ↓
7. setInverseResults([...matches])
   ↓
8. Affiche résultats triés + statut couleur
```

### Détection Alertes
```
1. <AlertButton agents={personnel} />
   ↓
2. useEffect déclenché (agents dépendance)
   ↓
3. currentYear = new Date().getFullYear()
   ↓
4. Boucle agents × 6 types EPI
   ↓
5. Compare: year vs currentYear
   - Si year < currentYear → severity = 'expired' (rouge)
   - Si year === currentYear → severity = 'warning' (orange)
   - Si year > currentYear → severity = 'ok' (vert, ignoré)
   ↓
6. setAlerts([...found])
   ↓
7. Affiche badge count
8. Click → modal avec tri expired/warning
```

---

## 6️⃣ STYLES & DESIGN SYSTÈME

### Palette Couleurs (App.css)

| Rôle | Hex | Usage |
|------|-----|-------|
| **Primary** | #1F3864 | Header, borders, text |
| **Secondary** | #2E75B6 | Buttons, highlights |
| **Light** | #F0F6FC | Backgrounds |
| **Accent** | #ED7D31 | Alarm button, warnings |
| **Danger** | #C00000 | Expired status, errors |
| **Success** | #375623 | OK status |

### Typographie
```css
font-family: Arial, sans-serif
font-sizes:
  - h1: 24px (title)
  - h3: 15px (modal headers)
  - body: 13px (labels, text)
  - small: 10px (EPI dates, details)
font-weights:
  - 400: regular
  - 600: semibold
  - 700: bold
```

### Composants Visuels

**Agent Button:**
- 2px solid border (#C5D8ED)
- 12px border-radius
- Hover: border-color → #2E75B6, light bg gradient
- Transition: 0.3s

**Modal:**
- position: fixed, z-index: 8000
- max-width: 640px
- max-height: 88vh (scrollable)
- Backdrop: rgba(0,0,0,0.5)

**EPI Grid:**
- 3 colonnes (desktop) → 1 colonne (mobile)
- Gaps: 12px
- Cards: light blue bg, left border accent

**Alarm Button:**
- 48px circle, orange (#ED7D31)
- Badge: red (#C00000), absolute top-right
- Hover: darker shade + scale

### Responsive
```
Desktop (>1024px): 3 colonnes agents
Tablet (768-1024px): 2 colonnes
Mobile (<768px): 1 colonne, modal fullwidth
```

---

## 7️⃣ CONFIGURATION VERCEL

### vercel.json
```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**Limitations:**
- Mémoire: 1024 MB (suffit)
- Timeout: 30 secondes (OK pour Google Sheets API)
- Plan: Gratuit (Hobby)

### Environment Variables
À ajouter dans Vercel Dashboard > Settings > Environment Variables:

```
GOOGLE_SHEET_ID = "1A2B3C4D5E6F7G8H9I0J"
GOOGLE_SERVICE_ACCOUNT_KEY = '{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----..."}' 
```

**Note:** La clé est une string JSON échappée, copier-coller depuis Google Cloud Console

---

## 8️⃣ CYCLE DE VIE & HOOKS

### useEffect Hooks

**1. App.jsx - Initial Load**
```javascript
useEffect(() => {
  loadPersonnel()
}, [])  // Vide = au montage uniquement
```

**2. App.jsx - Recherche Inverse**
```javascript
useEffect(() => {
  // Filtre inverseResults quand searchNumber change
  if (!searchNumber.trim()) {
    setInverseResults([])
    return
  }
  // Scan + match
  setInverseResults([...found])
}, [searchNumber, personnel])
```

**3. AlertButton.jsx - Détection Alertes**
```javascript
useEffect(() => {
  // Calcule alerts quand agents props change
  if (!agents || agents.length === 0) {
    setAlerts([])
    return
  }
  // Scan + classify
  setAlerts([...found])
}, [agents])
```

---

## 9️⃣ GESTION D'ERREURS

### Frontend (App.jsx)
```javascript
try {
  const response = await fetch('/api/sheets')
  if (!response.ok) throw new Error('Erreur API')
  const data = await response.json()
  setPersonnel(data.personnel || [])
} catch (error) {
  console.error('Erreur chargement:', error)
  // Affiche message utilisateur
}
```

### Backend (sheets.js)
```javascript
try {
  // Opération API
} catch (error) {
  console.error('Erreur:', error.message)
  return res.status(500).json({
    error: error.message || 'Erreur serveur'
  })
}
```

### Causes Courantes d'Erreur
- ❌ GOOGLE_SERVICE_ACCOUNT_KEY manquante → 500
- ❌ GOOGLE_SHEET_ID invalide → 500
- ❌ Feuille "EPI PERSONNELS SMPM" inexistante → 500
- ❌ Réseau → client-side catch
- ❌ Format JSON incorrect POST → 400

---

## 🔟 PERFORMANCE & OPTIMISATIONS

### Optimisations Actuelles
✅ Pas de re-fetch inutile (une seule requête au load)  
✅ Filtrages locaux (pas d'API à chaque changement search)  
✅ États séparés (données, UI, alertes)  
✅ Lazy rendering (modale seulement si selected)  
✅ No external libraries (React seulement)  

### Points Faibles
⚠️ Pas de pagination (tous agents en mémoire)  
⚠️ Pas de caching (rechargement complet à chaque refresh)  
⚠️ Pas de debounce searchAgent (filtre à chaque keystroke)  
⚠️ Google Sheets API lent (100-500ms per request)  

### Améliorations Possibles
1. **Pagination:** Charger 20 agents, scroll → plus
2. **Debounce:** setSearchAgent avec délai 300ms
3. **Caching:** localStorage pour personnel[], invalidate au refresh
4. **Virtual Scrolling:** Si >500 agents
5. **React Query:** Gestion cache + retry automatique

---

## 1️⃣1️⃣ SÉCURITÉ

### ✅ Présent
- Clés de service en variables d'env (pas en code)
- Google OAuth (via service account)
- Google Sheets scope limité (spreadsheets seulement)

### ⚠️ À Améliorer
- CORS ouvert à tous (`'*'`) → À restreindre en prod
- Pas d'authentification utilisateur → N'importe qui peut lire/modifier
- Données sensibles (noms, numéros) → Données publiques
- Pas de validation POST → Injection possible si client forge request

### Recommandations
1. Ajouter authentification (OAuth Google, Firebase Auth)
2. Restrictions CORS: `origin: process.env.ALLOWED_DOMAIN`
3. Validation schéma POST (Zod, Yup)
4. Audit trail (logging modifications)
5. Permissions par rôle (lecture seule vs admin)

---

## 1️⃣2️⃣ DÉPLOIEMENT

### 1. Créer Vercel Account
- https://vercel.com/sign-up

### 2. Connecter Repository GitHub
- Vercel Dashboard → "New Project"
- "Import Git Repository"
- Sélectionner repo

### 3. Ajouter Environment Variables
- Settings → Environment Variables
- GOOGLE_SHEET_ID: `paste-here`
- GOOGLE_SERVICE_ACCOUNT_KEY: `paste-here`

### 4. Deploy
- "Deploy"
- Attendre ~2 min build

### 5. Tester
- Ouvrir URL Vercel
- Essayer load agents
- Essayer édition → POST /api/sheets
- Essayer alertes

### 6. Custom Domain (optionnel)
- Settings → Domains
- Ajouter domaine
- Configurer DNS

---

## 1️⃣3️⃣ MAINTENANCE

### Logs
```bash
# Vercel Dashboard → Deployments → Logs
# Ou via CLI
vercel logs --prod
```

### Monitoring
- Vercel Analytics (gratuit)
- Google Sheets API quota dashboard
- Error tracking (console.error)

### Updates
```bash
# Maj dépendances
npm update

# Maj React
npm install react@latest react-dom@latest

# Redéployer
git push
# Vercel se déploie automatiquement
```

---

## 1️⃣4️⃣ TROUBLESHOOTING

| Problème | Cause | Solution |
|----------|-------|----------|
| "Erreur API" au load | ENV manquante | Vérifier Vercel Settings |
| Agents vides | Sheet vide | Ajouter données à Google Sheets |
| Édition ne sauvegarde pas | POST échoue | Vérifier console, logs Vercel |
| Alertes ne s'affichent pas | Format date invalide | Assurer format YYYY |
| Slow load | Trop d'agents | Paginer ou cache |

---

*Documentation complète — Juillet 2026*
