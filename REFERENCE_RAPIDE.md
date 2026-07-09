# 🎯 RÉFÉRENCE RAPIDE - EPI SMPM App

## Diagramme d'Architecture Complète

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 18.2)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  App.jsx (398 lignes)                                    │   │
│  │  ├─ État: personnel[], loading, activeTab, ...           │   │
│  │  ├─ loadPersonnel() → fetch('/api/sheets')               │   │
│  │  ├─ Render: Tabs + Search + Grid + Modal                 │   │
│  │  └─ Props: AlertButton (agents)                          │   │
│  │                                                           │   │
│  │  AlertButton.jsx (269 lignes)                            │   │
│  │  ├─ Props: agents[]                                      │   │
│  │  ├─ useEffect: detecte dates expirant                    │   │
│  │  ├─ State: alerts[] + showModal                          │   │
│  │  └─ Render: Badge + Modal alertes                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Styles: App.css (542L) + AlertButton.css (268L)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
                    HTTP (fetch/JSON)
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Vercel Serverless)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/sheets Handler (sheets.js, 126 lignes)            │   │
│  │  ├─ GET:  readSheet() → personnel[]                      │   │
│  │  ├─ POST: updatePersonnel(rowIndex, data)                │   │
│  │  └─ Auth: Google Service Account                         │   │
│  │                                                           │   │
│  │  Endpoint:                                               │   │
│  │  GET  /api/sheets → { personnel: [...] }                 │   │
│  │  POST /api/sheets → { success: true }                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Config: vercel.json (1024MB, 30s timeout)                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
                   Google Sheets API v4
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│               DATA LAYER (Google Sheets)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Spreadsheet: GOOGLE_SHEET_ID (env var)                  │   │
│  │  Sheet: "EPI PERSONNELS SMPM"                            │   │
│  │  Colonnes: A-T (20 colonnes)                             │   │
│  │  ├─ A-B: Nom, Prénom                                     │   │
│  │  ├─ C-E: Baudrier (Type, Num, Date)                      │   │
│  │  ├─ F-H: Casque (Type, Num, Date)                        │   │
│  │  ├─ I-K: Longe (Type, Num, Date)                         │   │
│  │  ├─ L-N: Mousqueton (Type, Num1, Num2)                   │   │
│  │  ├─ O-Q: Descendeur (Type, Num, Date)                    │   │
│  │  └─ R-T: Poignée (Type, Num, Date)                       │   │
│  │  Rows: 1=Headers, 2+=Agents                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Auth: GOOGLE_SERVICE_ACCOUNT_KEY (env var, JSON)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flux de Données - Cas d'Usage Principaux

### 1️⃣ Consulter Agent
```
utilisateur click agent
         ↓
setSelectedAgent(index)
         ↓
Modal affiche personnel[index]
         ↓
Grid 3×2 des 6 EPI
  [Baudrier]  [Casque]   [Longe]
  [Mousqueton] [Descendeur] [Poignée]

Chaque carte:
  Type: {baudrier_type}
  Numéro: {baudrier_num}
  Expiration: {baudrier_date} 🔴/🟠/🟢
```

### 2️⃣ Éditer Agent
```
utilisateur click "Éditer"
         ↓
setEditingAgent(index)
editData = {...agent}
         ↓
Affiche 20 inputs (nom, prenom, 6×(type+num+date))
utilisateur change valeurs
         ↓
onChange: setEditData({...editData, field: value})
         ↓
click "Enregistrer"
         ↓
POST /api/sheets
Body: {
  action: 'updatePersonnel',
  rowIndex: index,
  data: editData
}
         ↓
Vercel appelle:
  sheets.spreadsheets.values.update({
    range: "EPI PERSONNELS SMPM!A{rowIndex+1}:T{rowIndex+1}",
    values: [[...editData values]]
  })
         ↓
Google Sheets met à jour ligne
         ↓
Response: { success: true }
         ↓
loadPersonnel() (reload complet)
         ↓
closeModal()
```

### 3️⃣ Recherche Inverse (Numéro)
```
Tab: "Recherche Inverse" → activeTab = 'inverse'
         ↓
utilisateur tape numéro: "ABC123"
searchNumber = "ABC123"
         ↓
useEffect triggered:
  loop personnel.forEach(agent):
    if (agent.baudrier_num.includes('ABC123')) → found.push(...)
    if (agent.casque_num.includes('ABC123')) → found.push(...)
    ... (6 EPI)
         ↓
inverseResults = [
  { agent: "Dupont Jean", epiType: 'BAUDRIER', 
    marque: 'Petzl', numero: 'ABC123', year: 2025, severity: 'ok' },
  ...
]
         ↓
Affichage par agent:
  Dupont Jean
  ├─ BAUDRIER: Petzl (ABC123) - Exp: 2025 🟢
  ├─ CASQUE: SafeHead (ABC123) - Exp: 2024 🟠
  └─ ...

Code couleur:
  🟢 severity=ok (year > current)
  🟠 severity=warning (year == current)
  🔴 severity=expired (year < current)
```

### 4️⃣ Alertes d'Expiration
```
<AlertButton agents={personnel} />
         ↓
useEffect (agents dépendance):
  currentYear = 2026
  
  loop agents.forEach(agent):
    loop epiTypes [BAUDRIER, CASQUE, LONGE, MOUSQUETON, DESCENDEUR, POIGNEE]:
      year = parseInt(agent.{epiType}_date)
      
      if (year < 2026) severity = 'expired' ❌
      else if (year == 2026) severity = 'warning' ⚠️
      else severity = 'ok' ✓
      
      if (severity != 'ok') → found.push({ agent, epiType, year, severity })
         ↓
setAlerts([...found])
         ↓
affiche badge: 🔔 {alerts.length}
         ↓
utilisateur click 🔔
         ↓
showModal = true
         ↓
Modal affiche deux sections:
  
  EXPIRE (5 alertes)
  ├─ Dupont Jean - CASQUE (2023)
  ├─ Martin Anne - BAUDRIER (2024)
  └─ ...
  
  ATTENTION (3 alertes)
  ├─ Dupont Jean - LONGE (2026)
  └─ ...
```

---

## Structure État React (App.jsx)

```javascript
// 🔴 Données principales
const [personnel, setPersonnel] = useState([])
  → Tous les agents depuis Google Sheets
  → Actualisé au mount + après édition

const [loading, setLoading] = useState(false)
  → Pendant fetch('/api/sheets')

const [searchNumber, setSearchNumber] = useState('')
  → Texte recherche inverse

const [inverseResults, setInverseResults] = useState([])
  → Résultats recherche inverse

// 🟡 Navigation / Affichage
const [activeTab, setActiveTab] = useState('agents')
  → 'agents' | 'inverse'

const [selectedAgent, setSelectedAgent] = useState(null)
  → Index agent sélectionné (pour modal)

// 🟢 Édition
const [editingAgent, setEditingAgent] = useState(null)
  → Index agent en édition

const [editData, setEditData] = useState({})
  → Formulaire données temporaires
  → Clés: nom, prenom, baudrier_type, baudrier_num, ...

// Recherche
const [searchAgent, setSearchAgent] = useState('')
  → Live filter agents par nom
```

---

## État React (AlertButton.jsx)

```javascript
const [alerts, setAlerts] = useState([])
  → Structure: { agent, epiType, marque, numero, year, severity }
  → Calculé en useEffect à partir de props.agents

const [showModal, setShowModal] = useState(false)
  → Affichage modal alertes
```

---

## Colonnes Google Sheets

```
A  | Nom
B  | Prénom
C  | Baudrier Type
D  | Baudrier Num
E  | Baudrier Date (YYYY)
F  | Casque Type
G  | Casque Num
H  | Casque Date (YYYY)
I  | Longe Type
J  | Longe Num
K  | Longe Date (YYYY)
L  | Mousqueton Type
M  | Mousqueton Num1
N  | Mousqueton Num2
O  | Descendeur Type
P  | Descendeur Num
Q  | Descendeur Date (YYYY)
R  | Poignée Type
S  | Poignée Num
T  | Poignée Date (YYYY)

Exemple ligne:
Dupont | Jean | Petzl | ABC123 | 2025 | SafeHead | DEF456 | 2024 | ... (16 autres colonnes)
```

---

## API Endpoints

### GET /api/sheets

**Request:**
```
GET /api/sheets
Headers: (none)
Body: (empty)
```

**Response 200:**
```json
{
  "personnel": [
    {
      "nom": "Dupont",
      "prenom": "Jean",
      "baudrier_type": "Petzl",
      "baudrier_num": "ABC123",
      "baudrier_date": "2025",
      "casque_type": "SafeHead",
      "casque_num": "DEF456",
      "casque_date": "2024",
      "longe_type": "Simond",
      "longe_num": "GHI789",
      "longe_date": "2025",
      "mousq_type": "Petzl",
      "mousq_num1": "JKL012",
      "mousq_num2": "MNO345",
      "desc_type": "DMM",
      "desc_num": "PQR678",
      "desc_date": "2023",
      "poig_type": "Petzl",
      "poig_num": "STU901",
      "poig_date": "2026"
    }
  ]
}
```

**Response 500:**
```json
{
  "error": "GOOGLE_SERVICE_ACCOUNT_KEY manquante"
}
```

### POST /api/sheets

**Request:**
```
POST /api/sheets
Content-Type: application/json

{
  "action": "updatePersonnel",
  "rowIndex": 0,
  "data": {
    "nom": "Dupont",
    "prenom": "Jean",
    "baudrier_type": "Petzl",
    "baudrier_num": "ABC123_UPDATED",
    "baudrier_date": "2025",
    ... (14 autres champs)
  }
}
```

**Response 200:**
```json
{
  "success": true
}
```

**Response 400:**
```json
{
  "error": "Action non reconnue"
}
```

**Response 500:**
```json
{
  "error": "Erreur message ici"
}
```

---

## Palette Couleurs

```
🔵 Primary Blue:    #1F3864 (header, borders)
🔹 Secondary Blue:  #2E75B6 (buttons, highlights)
🔸 Light Blue:      #F0F6FC (backgrounds)
🟠 Orange/Accent:   #ED7D31 (alarm, warnings)
🔴 Red/Danger:      #C00000 (expired status)
✅ Green:           #375623 (ok status)
⚪ Border:          #C5D8ED (subtle)
```

---

## Composants CSS Clés

```css
.header
  → Gradient bleu, padding 20px, sticky haut

.tabs
  → Flex, buttons avec hover effect
  → .active: blue gradient

.agents-grid
  → grid 3 colonnes desktop → 2 tablet → 1 mobile
  → gap 20px

.agent-button
  → white, blue border 2px, 12px radius
  → hover: border #2E75B6, light bg, translateY(-4px)

.modal-bg
  → position fixed, z-index 8000
  → backdrop rgba(0,0,0,0.5)

.modal
  → 640px max-width, 88vh max-height scrollable

.epi-grid
  → grid 3 col, 12px gap
  → cards: light blue bg, left border accent

.epi-item
  → Labelling: uppercase 9px
  → Values: 10px monospace
  → Dates: 10px secondary

.alarm-button
  → 48px circle orange
  → Badge red, absolute top-right
  → hover: darker + scale

.alarm-item.expired
  → FFF5F5 bg, left red border
  → hover: FFE8E8

.alarm-item.warning
  → Même style orange
```

---

## Variables d'Environnement Requises

```bash
# Vercel Dashboard > Settings > Environment Variables

GOOGLE_SHEET_ID
  Description: ID de la feuille Google
  Format: String
  Exemple: "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P"

GOOGLE_SERVICE_ACCOUNT_KEY
  Description: JSON clé de service Google (échappée)
  Format: JSON String (pas multiline)
  Exemple: '{"type":"service_account","project_id":"my-project","private_key":"-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----\n","client_email":"...@...iam.gserviceaccount.com"}'
  Source: Google Cloud Console > Service Accounts > Create Key > Download JSON
  ⚠️ Ne pas commit en code!
```

---

## Commandes Utiles

```bash
# Development
npm start
  → React dev server localhost:3000

npm build
  → Production build (optimisé)

npm test
  → Jest tests

# Deployment
vercel
  → Deploy local → Vercel
  → Env vars doivent être set dans Dashboard

vercel logs --prod
  → Voir logs production

vercel env pull
  → Télécharger env vars localement (.env.local)

# Git
git push
  → Auto-deploys sur Vercel si connecté
```

---

## Checklist Déploiement

- [ ] Repository GitHub créé
- [ ] Vercel account créé + connecté à repo
- [ ] GOOGLE_SHEET_ID env var configurée
- [ ] GOOGLE_SERVICE_ACCOUNT_KEY env var configurée
- [ ] Google Sheets "EPI PERSONNELS SMPM" créée avec headers (ligne 1)
- [ ] Google Cloud Project avec API Sheets activée
- [ ] Service Account avec permissions Editor sur la sheet
- [ ] Deploy initial réussi (voir Vercel Dashboard)
- [ ] Fetch agents fonctionne (tester GET /api/sheets)
- [ ] Édition agent fonctionne (tester POST /api/sheets)
- [ ] Alertes détectent dates expirant correctement
- [ ] Domain custom configuré (optionnel)

---

## Troubleshooting Rapide

| Symptôme | Diagnostic | Solution |
|----------|-----------|----------|
| "Erreur API" au load | Vérifier console Network tab | ENV manquante? Vérifier Vercel Settings |
| Personnel liste vide | Vérifier Google Sheets | Ajouter données, vérifier headers ligne 1 |
| Édition ne sauvegarde pas | Vérifier console + Vercel logs | 500 error? Vérifier env vars, auth Google |
| Alertes toutes rouges | Vérifier dates Google Sheets | Assurer format YYYY (ex: 2025, pas "2025-01-01") |
| Slow performance | Vérifier count agents | Si >500, implémenter pagination |
| CORS error | Vérifier origins | Vercel origin manquante en API CORS? |

---

## Liens Utiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Google Sheets API:** https://developers.google.com/sheets/api
- **React Docs:** https://react.dev
- **GitHub:** https://github.com

---

## Taille & Performance

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Bundle size | ~300KB | <500KB ✅ |
| Agents en mémoire | n × 80 bytes | <10K agents ok |
| Google Sheets API | 100-500ms | <1s acceptable |
| Page load | ~2s | <3s acceptable |
| Modal render | instant | <100ms ✅ |
| Recherche inverse | O(n×6) | <500ms pour 1000 agents |
| Détection alertes | O(n×6) | <1s pour 1000 agents |

---

## Roadmap Futurs

- 🔄 React Query pour caching
- 🔍 Debounce recherche
- 📄 Pagination agents
- 🔐 Authentification utilisateur
- 📊 Dashboard stats (agents total, équipements expirés)
- 🖨️ Export PDF rapports
- 📱 Progressive Web App (offline)
- 🧪 Unit tests (Jest)
- 🔔 Email notifications (alertes)
- 📝 Audit trail (historique modifications)

---

*Référence rapide — Juillet 2026*
