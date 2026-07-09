# 📦 INSTALLATION - EPI SMPM + FMPA

**Fichiers modifiés prêts à copier dans votre projet**

---

## 📋 FICHIERS DANS CE ZIP

```
App_AVEC_FMPA.jsx          → src/App.jsx (REMPLACER)
FMPAButton.jsx             → src/components/FMPAButton.jsx (CRÉER)
FMPAButton.css             → src/components/FMPAButton.css (CRÉER)
sheets_AVEC_FMPA.js        → api/sheets.js (REMPLACER)
README_INSTALLATION.md     → Ce fichier
```

---

## ⚡ INSTALLATION RAPIDE (5 MIN)

### 1. Copier les Fichiers

```bash
# Frontend
cp App_AVEC_FMPA.jsx src/App.jsx
cp FMPAButton.jsx src/components/
cp FMPAButton.css src/components/

# Backend
cp sheets_AVEC_FMPA.js api/sheets.js
```

### 2. Configurer Vercel

**Vercel Dashboard → Settings → Environment Variables**

Ajouter:
```
GOOGLE_SHEET_ID = votre-id-sheet

GOOGLE_SERVICE_ACCOUNT_KEY = '{"type":"service_account",...}'
```

### 3. Google Sheets

1. Créer feuille: `FMPA` (si vous voulez utiliser FMPA)
2. Headers: Date | Lieu | GPS | Observation
3. Partager avec service account (Permission: Éditeur)

### 4. Déployer

```bash
git add .
git commit -m "Ajout FMPA + fix erreur 500"
git push
```

Attendre 3 min ✅

---

## 📖 DOCUMENTATION COMPLÈTE

Voir les fichiers dans le dossier parent:

- **01_CONFIGURATION_RAPIDE.md** - Configuration Vercel détaillée
- **OBTENIR_GOOGLE_SHEET_ID.md** - Comment obtenir l'ID
- **OBTENIR_SERVICE_ACCOUNT_KEY.md** - Comment obtenir la clé
- **README_FMPA.md** - Guide FMPA
- **DIAGNOSTIC_ERREUR_500.md** - Si erreur 500

---

## ✅ CHECKLIST

- [ ] Fichiers copiés
- [ ] src/App.jsx remplacé
- [ ] src/components/ créé (s'il n'existe pas)
- [ ] FMPAButton.jsx + FMPAButton.css dans components/
- [ ] api/sheets.js remplacé
- [ ] GOOGLE_SHEET_ID ajoutée dans Vercel
- [ ] GOOGLE_SERVICE_ACCOUNT_KEY ajoutée dans Vercel
- [ ] git push
- [ ] Attente 3 min
- [ ] Test: Pas d'erreur 500 ✅

---

*Installation EPI SMPM + FMPA — Juillet 2026*
