# 📍 GUIDE D'IMPLÉMENTATION - Fonctionnalité FMPA

## Aperçu

Vous ajoutez une **nouvelle fonctionnalité FMPA** (Fiches Moyens Premiers Arrivants) à votre application EPI SMPM.

### Nouveaux Fichiers Créés

```
src/components/
├── FMPAButton.jsx          (269 lignes)
├── FMPAButton.css          (355 lignes)

api/
├── sheets_AVEC_FMPA.js     (modifié, 210 lignes)

App.jsx (REMPLACER)
├── App_AVEC_FMPA.jsx       (398 lignes, version modifiée)
```

---

## 📋 Étapes d'Implémentation

### Étape 1: Créer la Feuille FMPA dans Google Sheets

1. Ouvrez votre Google Sheets
2. **Créer une nouvelle feuille** nommée exactement: `FMPA`
3. **En-têtes (Ligne 1):**
   ```
   A: Date
   B: Lieu
   C: GPS
   D: Observation
   ```
4. **Exemple données (Ligne 2+):**
   ```
   2026-01-15 | Montagne Val d'Aosta | 45.8167° N, 7.5667° E | Intervention escalade, 3 personnes évacuées
   2026-01-18 | Gorges de la Restonica | 42.0333° N, 9.0167° E | Sauvetage aquatique, eau froide
   ```

### Étape 2: Remplacer les Fichiers React

1. **Remplacez** `src/App.jsx` par `App_AVEC_FMPA.jsx`
   ```bash
   cp App_AVEC_FMPA.jsx src/App.jsx
   ```

2. **Créez le composant** `src/components/FMPAButton.jsx`
   ```bash
   cp FMPAButton.jsx src/components/FMPAButton.jsx
   ```

3. **Créez les styles** `src/components/FMPAButton.css`
   ```bash
   cp FMPAButton.css src/components/FMPAButton.css
   ```

### Étape 3: Remplacer l'API Backend

1. **Remplacez** `api/sheets.js` par `sheets_AVEC_FMPA.js`
   ```bash
   cp sheets_AVEC_FMPA.js api/sheets.js
   ```

### Étape 4: Tester Localement

```bash
npm start
```

Vérifiez:
- ✅ Bouton "📍 FMPA" visible dans le header
- ✅ Click bouton → Modal s'ouvre
- ✅ Liste des FMPA chargée depuis Google Sheets
- ✅ Possibilité de rechercher par lieu
- ✅ Click FMPA card → Détails s'affichent
- ✅ Lien GPS cliquable (ouvre Google Maps)
- ✅ Édition / Ajout / Suppression fonctionnels

### Étape 5: Déployer sur Vercel

```bash
git add .
git commit -m "Ajout fonctionnalité FMPA"
git push
```

Vercel se déploie automatiquement ✅

---

## 🎨 Interface Utilisateur

### Header (Avant)
```
[EPI SMPM] → [🔔 Alarm Button]
```

### Header (Après)
```
[EPI SMPM] → [🔔 Alarm Button] [📍 FMPA Button]
```

### Modal FMPA - Onglet Liste

```
┌─────────────────────────────────────┐
│ Gestion FMPA                    [✕] │
├─────────────────────────────────────┤
│                                     │
│ [Rechercher par lieu...] [+ Nouvelle]
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Montagne Val d'Aosta | 2026-01-15
│ │ GPS: 45.8167° N, 7.5667° E     │ │
│ │ Note: Intervention escalade... │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Gorges Restonica | 2026-01-18  │ │
│ │ GPS: 42.0333° N, 9.0167° E     │ │
│ │ Note: Sauvetage aquatique...   │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Modal FMPA - Onglet Détails

```
┌─────────────────────────────────────┐
│ Montagne Val d'Aosta            [✕] │
├─────────────────────────────────────┤
│                                     │
│ Date:      2026-01-15             │
│ Lieu:      Montagne Val d'Aosta    │
│ GPS:       45.8167° N, 7.5667° E   │
│            🔗 (lien Google Maps)   │
│ Observation:                       │
│ Intervention escalade, 3 personnes │
│ évacuées. Conditions météo difficiles
│                                     │
│ [Éditer] [Supprimer] [Fermer]      │
│                                     │
└─────────────────────────────────────┘
```

### Modal FMPA - Édition/Ajout

```
┌─────────────────────────────────────┐
│ Éditer FMPA                     [✕] │
├─────────────────────────────────────┤
│                                     │
│ DATE                               │
│ [2026-01-15]                       │
│                                     │
│ LIEU                               │
│ [Montagne Val d'Aosta]             │
│                                     │
│ COORDONNÉES GPS                    │
│ [45.8167° N, 7.5667° E]            │
│                                     │
│ OBSERVATION                        │
│ [Intervention escalade,            │
│  3 personnes évacuées...]          │
│                                     │
│ [Enregistrer] [Supprimer] [Annuler]│
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Flux de Données FMPA

### Charger FMPA
```
FMPAButton mount
    ↓
useEffect triggered
    ↓
fetch('/api/sheets?type=fmpa')
    ↓
Vercel: req.query.type === 'fmpa'
    ↓
readFMPASheet() → Google Sheets "FMPA" sheet
    ↓
Parse colonnes: date, lieu, gps, observation
    ↓
Return JSON: { fmpa: [...] }
    ↓
setFmpa([...data])
    ↓
Affiche liste
```

### Rechercher FMPA
```
utilisateur tape lieu: "Val d'Aosta"
    ↓
onChange: setSearchLocation("Val d'Aosta")
    ↓
filteredFMPA = fmpa.filter(f =>
  f.lieu.toLowerCase().includes("val d'aosta")
)
    ↓
Affiche résultats filtrés
```

### Éditer FMPA
```
utilisateur click card
    ↓
openFMPA(record)
setSelectedFMPA(record)
    ↓
Affiche détails
    ↓
utilisateur click "Éditer"
    ↓
startEdit(record)
setEditData({...record})
setEditingFMPA(true)
    ↓
Affiche formulaire avec champs pré-remplis
    ↓
utilisateur modifie valeurs
    ↓
onChange: setEditData({...editData, champ: valeur})
    ↓
click "Enregistrer"
    ↓
POST /api/sheets
Body: {
  action: 'updateFMPA',
  rowIndex: index,
  data: editData
}
    ↓
Vercel: updateFMPA(rowIndex, data)
    ↓
sheets.spreadsheets.values.update()
Range: "FMPA!A{rowIndex+2}:D{rowIndex+2}"
    ↓
Google Sheets met à jour ligne
    ↓
Response: { success: true }
    ↓
Reload FMPA list
    ↓
closeModal()
```

### Ajouter FMPA
```
utilisateur click "+ Nouvelle FMPA"
    ↓
addNewFMPA()
editData = { date: '', lieu: '', gps: '', observation: '' }
setEditingFMPA({ isNew: true })
    ↓
Affiche formulaire vide
    ↓
utilisateur remplit champs
    ↓
click "Enregistrer"
    ↓
POST /api/sheets
Body: {
  action: 'addFMPA',
  data: editData
}
    ↓
Vercel: addFMPA(data)
    ↓
sheets.spreadsheets.values.append()
Range: "FMPA!A:D"
    ↓
Google Sheets ajoute ligne à la fin
    ↓
Response: { success: true }
    ↓
Reload FMPA list
    ↓
closeModal()
```

### Supprimer FMPA
```
utilisateur click "Supprimer"
    ↓
confirm('Confirmer suppression?')
    ↓
DELETE /api/sheets
Body: {
  action: 'deleteFMPA',
  rowIndex: index
}
    ↓
Vercel: deleteFMPA(rowIndex)
    ↓
sheets.spreadsheets.batchUpdate()
deleteDimension (ROWS)
startIndex: rowIndex+1, endIndex: rowIndex+2
    ↓
Google Sheets supprime ligne
    ↓
Response: { success: true }
    ↓
Reload FMPA list
    ↓
alert('FMPA supprimée')
```

---

## 📊 Structure Google Sheets FMPA

### Feuille: "FMPA"

| Colonne | Champ | Type | Exemple | Requis? |
|---------|-------|------|---------|---------|
| A | Date | Date (YYYY-MM-DD) | 2026-01-15 | ✅ Oui |
| B | Lieu | String | Montagne Val d'Aosta | ✅ Oui |
| C | GPS | String | 45.8167° N, 7.5667° E | ❌ Non |
| D | Observation | String (long) | Intervention escalade, 3 personnes... | ❌ Non |

### Format Recommandé

**Dates:** Format ISO `YYYY-MM-DD` (ex: `2026-01-15`)
- Le composant affiche date telle quelle
- Vous pouvez modifier l'affichage en formatant dans le rendu

**GPS:** Format libre
- Exemple: `45.8167° N, 7.5667° E`
- Ou: `45.8167, 7.5667`
- Ou: `Lat 45.8167, Lon 7.5667`
- ⚠️ Le lien Google Maps utilise `encodeURIComponent()`, donc n'importe quel format marche

**Observation:** Texte libre, peut être long
- Supports multiline (entrée clavier)
- Affichage tronqué à 60 chars dans la liste ("...")
- Affichage complet dans détails

---

## 🛠️ Modifications API (sheets.js)

### Nouvelles Fonctions

**readFMPASheet()**
- Lit la feuille "FMPA" (colonnes A:E)
- Retourne array FMPA avec normalisation headers
- Gère erreur si sheet manquante (retourne [])

**updateFMPA(rowIndex, data)**
- Met à jour ligne FMPA existante
- Écrit: date, lieu, gps, observation
- Range: `FMPA!A{rowIndex+2}:D{rowIndex+2}`

**addFMPA(data)**
- Ajoute nouvelle FMPA à la fin de la sheet
- Utilise `.append()` (auto-find dernière ligne)
- Range: `FMPA!A:D`

**deleteFMPA(rowIndex)**
- Supprime ligne FMPA
- Utilise `batchUpdate()` avec `deleteDimension`
- ⚠️ Nécessite `sheetId` correct (actuellement 0 - à vérifier!)

### Endpoint GET /api/sheets

```javascript
// Avant
GET /api/sheets → { personnel: [...] }

// Après
GET /api/sheets?type=personnel → { personnel: [...] }
GET /api/sheets?type=fmpa → { fmpa: [...] }
```

### Nouvel Endpoint GET /api/sheets?type=fmpa

**Request:**
```
GET /api/sheets?type=fmpa
```

**Response 200:**
```json
{
  "fmpa": [
    {
      "date": "2026-01-15",
      "lieu": "Montagne Val d'Aosta",
      "gps": "45.8167° N, 7.5667° E",
      "observation": "Intervention escalade, 3 personnes évacuées"
    }
  ]
}
```

### Nouvel Endpoint POST /api/sheets (updateFMPA)

**Request:**
```
POST /api/sheets
Content-Type: application/json

{
  "action": "updateFMPA",
  "rowIndex": 0,
  "data": {
    "date": "2026-01-15",
    "lieu": "Montagne Val d'Aosta UPDATED",
    "gps": "45.8167° N, 7.5667° E",
    "observation": "Intervention escalade, 3 personnes évacuées"
  }
}
```

**Response 200:**
```json
{ "success": true }
```

### Nouvel Endpoint POST /api/sheets (addFMPA)

**Request:**
```
POST /api/sheets
Content-Type: application/json

{
  "action": "addFMPA",
  "data": {
    "date": "2026-02-01",
    "lieu": "Mer Méditerranée",
    "gps": "42.9833° N, 8.2667° E",
    "observation": "Sauvetage maritime, conditions calmes"
  }
}
```

**Response 200:**
```json
{ "success": true }
```

### Nouvel Endpoint DELETE /api/sheets

**Request:**
```
DELETE /api/sheets
Content-Type: application/json

{
  "action": "deleteFMPA",
  "rowIndex": 0
}
```

**Response 200:**
```json
{ "success": true }
```

---

## ⚠️ Points Importants

### 1. Sheet ID pour Suppression

La fonction `deleteFMPA()` utilise:
```javascript
sheetId: 0  // Présume que FMPA est la 1ère/2ème sheet
```

**À vérifier:**
1. Ouvrez votre Google Sheets
2. Inspectez l'URL après `/spreadsheets/d/`
3. Les sheets ont des IDs (visibles si vous explorez l'API)
4. Trouvez le `sheetId` de la feuille "FMPA" et remplacez la valeur dans sheets.js

**Ou, alternative simpler:** Remplacez la suppression par:
```javascript
// Au lieu de deleteDimension, effacer les cellules
await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: `FMPA!A${startRow}:D${startRow}`,
  valueInputOption: 'RAW',
  resource: { values: [[]] } // Ligne vide
});
```

### 2. Recherche par Lieu

La recherche filtre en client-side (côté React):
```javascript
filteredFMPA = fmpa.filter(f =>
  f.lieu.toLowerCase().includes(searchLocation.toLowerCase())
)
```

✅ Rapide pour <1000 FMPA  
❌ Lent pour >5000 FMPA (implémenter côté serveur)

### 3. Lien GPS

Le composant crée automatiquement un lien Google Maps:
```javascript
<a href={`https://maps.google.com/?q=${encodeURIComponent(selectedFMPA.gps)}`}>
  {selectedFMPA.gps} 🔗
</a>
```

✅ Fonctionne avec n'importe quel format GPS  
✅ Clique → Ouvre Google Maps dans nouvel onglet

### 4. Dates

Actuellement format libre (string):
```html
<input type="date" value={editData.date} />
```

Affichage en détails: pas de formatage spécial
```javascript
<span>{selectedFMPA.date}</span>  // Affiche: 2026-01-15
```

Si vous voulez affichage français (15/01/2026):
```javascript
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

<span>{formatDate(selectedFMPA.date)}</span>
```

---

## 🧪 Checklist Déploiement

- [ ] Feuille "FMPA" créée dans Google Sheets
- [ ] En-têtes exacts: Date, Lieu, GPS, Observation
- [ ] 1+ FMPA exemple ajoutée pour tester
- [ ] FMPAButton.jsx créé dans `src/components/`
- [ ] FMPAButton.css créé dans `src/components/`
- [ ] App.jsx remplacé par App_AVEC_FMPA.jsx
- [ ] sheets.js remplacé par sheets_AVEC_FMPA.js
- [ ] Tests locaux OK:
  - [ ] Bouton 📍 FMPA visible
  - [ ] Clic ouvre modal
  - [ ] Liste FMPA chargée
  - [ ] Recherche par lieu fonctionne
  - [ ] Clic card → détails
  - [ ] Lien GPS fonctionne
  - [ ] Édition OK
  - [ ] Ajout OK
  - [ ] Suppression OK
- [ ] `git push` → Vercel déploie
- [ ] Tests en production OK

---

## 📚 Fichiers de Référence

### Import dans App.jsx

```javascript
import FMPAButton from './components/FMPAButton';

// Dans le header:
<div className="header-right">
  <AlertButton agents={personnel} />
  <FMPAButton />  // ← Nouveau
</div>
```

### Structure Répertoire Finale

```
src/
├── App.jsx (MODIFIÉ: app_AVEC_FMPA.jsx)
├── App.css
├── index.js
├── index.html
├── components/
│   ├── AlertButton.jsx
│   ├── AlertButton.css
│   ├── FMPAButton.jsx (NOUVEAU)
│   └── FMPAButton.css (NOUVEAU)

api/
└── sheets.js (MODIFIÉ: sheets_AVEC_FMPA.js)

package.json
vercel.json
README.md
```

---

## 🎯 Prochaines Améliorations (Optionnel)

1. **Carte interactive** - Afficher les FMPA sur une carte Leaflet
2. **Filtres multiples** - Recherche par date range + lieu
3. **Export PDF** - Générer rapport FMPA par période
4. **Notifications** - Alerte quand nouvelle FMPA est ajoutée
5. **Photos** - Upload image/photo de l'intervention
6. **Collaboration** - Champs "Agent assigné", "Statut" (actif/clôturé)
7. **Historique** - Audit trail des modifications

---

*Guide d'implémentation — Juillet 2026*
