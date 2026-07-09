# 📊 ANALYSE STRUCTURELLE - Application EPI SMPM

## 📋 Vue d'ensemble

**Application:** Gestion des Équipements de Protection Individuelle (EPI) du SMPM  
**Stack:** React 18.2 + Node.js (Vercel)  
**Total de lignes:** ~1650  
**Fichiers:** 10 fichiers principaux

---

## 🏗️ Architecture Générale

```
EPI-SMPM-APP
│
├── Frontend (React)
│   ├── App.jsx (398 lignes) - Composant principal
│   ├── AlertButton.jsx (269 lignes) - Composant alarme
│   ├── App.css (542 lignes) - Styles principaux
│   ├── AlertButton.css (268 lignes) - Styles alarme
│   ├── index.js (10 lignes) - Point d'entrée
│   └── index.html (16 lignes) - HTML root
│
├── Backend (Vercel Serverless)
│   └── sheets.js (126 lignes) - API Google Sheets
│
└── Configuration
    ├── package.json - Dépendances React
    ├── vercel.json - Config Vercel
    └── README.md - Documentation
```

---

## 🔄 Flux de Données

### 1️⃣ Initialisation
```
App.jsx (useEffect)
    ↓
loadPersonnel()
    ↓
fetch('/api/sheets')
    ↓
sheets.js (Vercel Serverless)
    ↓
Google Sheets API
    ↓
personnel[] state
```

### 2️⃣ Affichage des Agents
```
personnel (state)
    ↓
Tab: "agents" activé
    ↓
Filtrage par searchAgent
    ↓
Grid d'agents
    ↓
Click agent → selectedAgent
    ↓
Modal détail
```

### 3️⃣ Recherche Inverse (Numéros d'EPI)
```
searchNumber (état)
    ↓
Scan personnel[] pour chaque EPI field
    ↓
Match numéro → inverseResults[]
    ↓
Affichage par agent
    ↓
Status: ok/warning/expired
```

### 4️⃣ Édition EPI
```
selectedAgent + editMode
    ↓
editData state (copie)
    ↓
onChange handlers
    ↓
POST /api/sheets
    ↓
updatePersonnel() (sheet.js)
    ↓
Google Sheets update
    ↓
Rechargement personnel[]
```

### 5️⃣ Alertes (AlertButton)
```
agents props
    ↓
useEffect scan dates
    ↓
Comparaison année actuelle
    ↓
Classification: ok/warning/expired
    ↓
Badge count
    ↓
Modal détail alertes
```

---

## 📦 Dépendances

### Production
```json
{
  "react": "^18.2.0",           // Framework UI
  "react-dom": "^18.2.0",       // Rendu React
  "react-scripts": "5.0.1",     // Build tools
  "googleapis": "^118.0.0"      // Google API client
}
```

### Compatibilité Navigateur
- Chrome: dernière version
- Firefox: dernière version
- Safari: dernière version
- Production: >0.2% coverage

---

## 🧩 Composants React

### **1. App.jsx** (Composant Principal)
**Responsabilités:**
- Gestion état global (personnel, tabs, recherche)
- Orchestration 3 modes: agents / inverse / alarmes
- Communication API

**État Local (useState):**
```javascript
personnel[]              // Données des agents
loading                  // Indicateur chargement
activeTab               // agents | inverse | alarms
searchAgent             // Filtrage par nom
selectedAgent           // Agent sélectionné (view)
editingAgent            // Agent en édition
editData {}             // Données en cours d'édition
searchNumber            // Recherche inverse numéro
inverseResults[]        // Résultats recherche
```

**Fonctions Clés:**
- `loadPersonnel()` - Fetch API
- `openModal(agent)` - Afficher détails
- `handleEdit(agent)` - Passer en édition
- `handleSave()` - POST changements
- `handleCancel()` - Annuler édition
- `closeModal()` - Fermer modal

### **2. AlertButton.jsx** (Composant Alarme)
**Responsabilités:**
- Affichage badge compte alertes
- Détection expiration EPI
- Modal détail avec tri expired/warning

**État Local:**
```javascript
alerts[]        // Alertes détectées
showModal       // Affiche modal alarme
```

**Logique:**
- Scanne 6 types d'EPI par agent
- Compare année expiration vs année actuelle
- Classe: `ok` (futur), `warning` (année courante), `expired` (passé)

**Props:**
- `agents` - Array d'agents (du parent App)

---

## 🎨 Système de Style

### **App.css** (542 lignes)

**Palette de Couleurs:**
```
Primary:      #1F3864 (bleu foncé)
Secondary:    #2E75B6 (bleu moyen)
Light:        #F0F6FC (bleu clair)
Accent:       #ED7D31 (orange alarme)
Danger:       #C00000 (rouge expiration)
```

**Composants Stylisés:**

| Classe | Rôle | Notes |
|--------|------|-------|
| `.app` | Container principal | max-width: 1200px |
| `.header` | En-tête avec gradient | Sticky en haut |
| `.tabs` | Onglets navigation | Flex layout |
| `.search-box` | Barre recherche | Sticky position |
| `.agents-grid` | Grille agents | 3 col → 2 col → 1 col (responsive) |
| `.modal-bg` | Overlay modal | Fixed, z-index: 8000 |
| `.epi-grid` | Grille équipements | 3 colonnes dans modal |
| `.alarm-button` | Bouton alarme | Cercle 48px, orange |

**Responsive Design:**
- Desktop (>1024px): 3 colonnes agents
- Tablet (768px-1024px): 2 colonnes
- Mobile (<768px): 1 colonne, modal full-width

### **AlertButton.css** (268 lignes)

**Surcharges Spécifiques:**
- `.alarm-modal-bg` - Overlay alarme (z-index: 9000)
- `.alarm-modal` - Animation `slideIn`
- `.alarm-item` - Card rouge avec gradient
- `.alarm-item:hover` - Effet shadow/couleur
- Animations: `@keyframes slideIn` (0.3s ease-out)

---

## 🔌 API Backend (sheets.js)

### Architecture Serverless (Vercel)

**Endpoint:** `/api/sheets`

**GET /api/sheets**
```javascript
Requête:  None
Réponse:  {
  personnel: [
    {
      nom: "string",
      prenom: "string",
      baudrier_type: "string",
      baudrier_num: "string",
      baudrier_date: "YYYY",
      // ... 14 autres champs
    }
  ]
}
```

**POST /api/sheets**
```javascript
Body: {
  action: "updatePersonnel",
  rowIndex: number,
  data: {
    nom, prenom,
    baudrier_type, baudrier_num, baudrier_date,
    casque_type, casque_num, casque_date,
    longe_type, longe_num, longe_date,
    mousq_type, mousq_num1, mousq_num2,
    desc_type, desc_num, desc_date,
    poig_type, poig_num, poig_date
  }
}

Réponse: { success: true }
```

### Authentification
- **Service Account Key** (variable d'env: `GOOGLE_SERVICE_ACCOUNT_KEY`)
- **Scope:** Google Sheets API v4
- **Spreadsheet ID:** variable d'env `GOOGLE_SHEET_ID`

### Gestion d'Erreurs
```javascript
try {
  // Opération API
} catch (error) {
  return { error: error.message }
  // Status: 400 | 405 | 500
}
```

---

## 📊 Structure Google Sheets

### Feuille: "EPI PERSONNELS SMPM"

**Colonnes (A-T):**
```
A: Nom
B: Prénom
C: Baudrier Type
D: Baudrier Num
E: Baudrier Date (Année)
F: Casque Type
G: Casque Num
H: Casque Date (Année)
I: Longe Type
J: Longe Num
K: Longe Date (Année)
L: Mousqueton Type
M: Mousqueton Num1
N: Mousqueton Num2
O: Descendeur Type
P: Descendeur Num
Q: Descendeur Date (Année)
R: Poignée Type
S: Poignée Num
T: Poignée Date (Année)
```

**Exemple Ligne:**
```
Dupont | Jean | Petzl | ABC123 | 2025 | SafeHead | DEF456 | 2024 | ...
```

---

## 🔄 États et Props Diagram

```
App.jsx
├── State:
│   ├── personnel[] → AlertButton (props)
│   ├── activeTab → Conditionnel render
│   ├── selectedAgent → Modal data
│   └── editData → Form inputs
│
└── AlertButton.jsx
    └── Props:
        └── agents (personnel[])
```

---

## 🛠️ Configuration Vercel

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
- Mémoire: 1024 MB
- Timeout: 30 secondes
- ✅ Plan gratuit compatible

---

## 🔐 Variables d'Environnement Requises

| Variable | Type | Exemple |
|----------|------|---------|
| `GOOGLE_SHEET_ID` | string | `1A2B3C...` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON string | `{"type":"service_account",...}` |

**Configuration Vercel:**
1. Dashboard → Settings → Environment Variables
2. Ajouter 2 variables
3. Redéployer

---

## 📈 Flux d'Utilisation (User Journey)

### Cas 1: Consulter Agent
```
1. App charge (loadPersonnel)
2. Liste agents affichée (grid)
3. Click agent → Modal s'ouvre
4. Affiche 6 EPI avec dates
5. Close modal
```

### Cas 2: Éditer EPI
```
1. Modal ouvert sur agent
2. Click "Éditer" → Form activé
3. Modifier champs
4. Click "Enregistrer"
5. POST /api/sheets
6. Reload personnel[], close modal
7. Affichage mis à jour
```

### Cas 3: Recherche Inverse
```
1. Tab "Recherche Inverse" activé
2. Taper numéro (ex: "ABC123")
3. Scan tous agents pour ce numéro
4. Affiche résultats (agent + EPI + date)
5. Code couleur: vert (ok), orange (warning), rouge (expired)
```

### Cas 4: Voir Alertes
```
1. Click bouton alarme 🔔
2. Badge affiche compte
3. Modal s'ouvre (animation slideIn)
4. Triées: EXPIRE (rouge) / ATTENTION (orange)
5. Affiche: agent, EPI, marque, numéro, année expiration
```

---

## ⚠️ Points Critiques à Noter

### Sécurité
- ✅ Service Account caché (env variables)
- ⚠️ API sans authentication requise (CORS ouvert)
- ⚠️ Données sensibles potentiellement publiques

### Performance
- ✅ Fetch unique au load
- ✅ Pas de requêtes répétées inutiles
- ⚠️ Pas de pagination (tous les agents en mémoire)
- ⚠️ Pas de caching (rechargement complet)

### Maintenabilité
- ✅ Code modularisé (2 composants)
- ✅ CSS séparé par composant
- ⚠️ Pas de composant réutilisable (grille, inputs)
- ⚠️ Pas de gestion d'erreurs utilisateur

### UX/UI
- ✅ Responsive design complet
- ✅ Indicateurs visuels clairs (couleurs)
- ✅ Modal + inline editing
- ⚠️ Pas de confirmation avant save
- ⚠️ Pas de indicateur loading pendant POST

---

## 📝 Résumé Technique

| Aspect | Détail |
|--------|--------|
| **Framework** | React 18.2 |
| **État** | useState hooks |
| **Données** | Google Sheets (API v4) |
| **Hosting** | Vercel (serverless) |
| **CSS** | CSS-in-file (BEM-like) |
| **Composants** | 2 (App + AlertButton) |
| **Taille Build** | ~300KB (estimé) |
| **Temps Load** | <2s (Vercel CDN) |

---

## 🎯 Opportunités d'Amélioration

1. **Refactoring Composants** → Extraire Card, Modal, Form
2. **State Management** → Context API pour éviter prop drilling
3. **Caching** → LocalStorage ou React Query
4. **Pagination** → Virtual scrolling pour >100 agents
5. **Validation** → Formulaires avec regex/yup
6. **Tests** → Jest + React Testing Library
7. **Types** → TypeScript pour type safety
8. **Monitoring** → Sentry pour erreurs

---

*Analyse générée: Juillet 2026*
