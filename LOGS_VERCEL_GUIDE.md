# 🔍 GUIDE - Récupérer les Logs Vercel

## Objectif
Trouver le **message d'erreur exact** pour diagnostiquer le problème 500

---

## 🚀 Récupérer les Logs

### Option 1: Via Vercel Dashboard (Plus Facile) ✅

1. Aller à: https://vercel.com/dashboard
2. Sélectionner votre project
3. Onglet: **Deployments**
4. Cliquer sur le dernier déploiement (haut de la liste)
5. Onglet: **Logs**
6. Chercher les lignes rouges (erreurs)
7. **Copier l'erreur complète**

### Option 2: Via Terminal (Si installé Vercel CLI)

```bash
# Installer CLI (si pas déjà fait)
npm i -g vercel

# Login
vercel login

# Voir logs production
vercel logs --prod

# Voir logs dernier déploiement
vercel logs --prod --follow
```

---

## 📝 Erreurs Courantes et Solutions

### Erreur 1: "GOOGLE_SERVICE_ACCOUNT_KEY manquante"

```
❌ Error: GOOGLE_SERVICE_ACCOUNT_KEY manquante
```

**Cause:** Variable d'env pas configurée  
**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Ajouter: `GOOGLE_SERVICE_ACCOUNT_KEY` = votre JSON key
3. Redéployer: `git push`

---

### Erreur 2: "GOOGLE_SHEET_ID manquante"

```
❌ Error: GOOGLE_SHEET_ID manquante
```

**Cause:** Variable d'env pas configurée  
**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Ajouter: `GOOGLE_SHEET_ID` = votre sheet ID
3. Redéployer: `git push`

---

### Erreur 3: "Invalid JSON"

```
❌ Error: Unexpected token in JSON
❌ SyntaxError: Unexpected token
```

**Cause:** JSON key mal formaté  
**Solution:**
1. Google Cloud → Service Accounts → Download nouvelle key
2. Copier/coller la clé ENTIÈRE (tous les caractères)
3. Vercel → mettre entre guillemets simples: `'{KEY_HERE}'`
4. Redéployer

---

### Erreur 4: "Permission denied" (403)

```
❌ 403 Forbidden
❌ Permission denied
```

**Cause:** Service account n'a pas accès à la sheet  
**Solution:**
1. Ouvrir Google Sheets
2. Partager → Ajouter: `xxx@xxx.iam.gserviceaccount.com`
3. Permission: **Editor** (important!)
4. Attendre 30-60 secondes
5. Tester

---

### Erreur 5: "Sheet not found" (404)

```
❌ 404 Not found
❌ Sheet "EPI PERSONNELS SMPM" not found
```

**Cause:** Feuille mal nommée ou inexistante  
**Solution:**
1. Google Sheets → Right-click feuille
2. Rename → Taper exactement: `EPI PERSONNELS SMPM`
3. (Vérifier: maj/min, espaces, pas de caractères spéciaux)
4. Rafraîchir l'app

---

## 🧪 Tester Localement

Si vous avez Node.js installé:

### 1. Créer `.env.local`

```bash
# À la racine du projet
GOOGLE_SHEET_ID=votre-sheet-id
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### 2. Démarrer l'app

```bash
npm install
npm start
```

### 3. Vérifier erreur console

Ouvrir DevTools (F12) → Console → Chercher l'erreur rouge

---

## 🔧 Vérification Complète

### Checklist Variables d'Env

```bash
# Dans Vercel Dashboard → Settings → Environment Variables

✅ GOOGLE_SHEET_ID
   - Doit être présent
   - Doit être non-vide
   - Format: String alphanumérique long

✅ GOOGLE_SERVICE_ACCOUNT_KEY
   - Doit être présent
   - Doit commencer par: {"type":"service_account"
   - Doit terminer par: }"
   - Doit être complet (tous les caractères)
   - Pas de retours à la ligne
```

### Checklist Google Sheets

```bash
✅ Feuille nommée: EPI PERSONNELS SMPM
   - Vérifier exacte casse
   - Vérifier pas d'espaces supplémentaires
   
✅ Headers (Ligne 1):
   A: (ne importe quoi, sera parsé comme header)
   
✅ Données (Ligne 2+):
   Exemple: Dupont | Jean | Petzl | ABC123 | 2026 | ...
```

### Checklist Google Cloud

```bash
✅ Service Account créé
✅ Key créée (JSON format)
✅ Sheet partagée avec email du service account
✅ Permission: Editor (pas Viewer, Commenter, etc.)
✅ Sheets API activée dans Google Cloud
```

---

## 📋 Formulaire de Diagnostic

Quand vous posez une question, inclure:

```
❌ Erreur observée: [message exact des logs]

✅ Checklist:
[ ] GOOGLE_SHEET_ID configurée dans Vercel
[ ] GOOGLE_SERVICE_ACCOUNT_KEY configurée dans Vercel
[ ] Feuille Google Sheets nommée: EPI PERSONNELS SMPM
[ ] Service account partagé avec permission Editor
[ ] Redéploiement fait après changement env vars

📊 Environnement:
- OS: Windows / Mac / Linux
- Node.js version: [npm -v]
- Git push: [oui/non]
- Vercel deployment: [succès/erreur]

🔍 Logs Vercel:
[Copier/coller l'erreur exacte des logs]
```

---

## 🚀 Étapes Finales de Fix

### Quand erreur 500 persiste:

#### 1. Videz le cache
```bash
# Hard refresh (Ctrl+Shift+R)
# Ou en Incognito (Ctrl+Shift+N)
```

#### 2. Vérifiez redéploiement
```
Vercel Dashboard → Deployments
Chercher le dernier = doit être "Ready" (vert)
Si "Building" → attendre
Si "Failed" → vérifier build logs
```

#### 3. Testez l'API directement
```bash
curl https://votre-app.vercel.app/api/sheets
# Ou dans navigateur console:
fetch('https://votre-app.vercel.app/api/sheets')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

#### 4. Recréez les credentials
```
Si rien marche:
1. Google Cloud → Supprimer service account
2. Créer nouveau service account
3. Télécharger nouvelle key
4. Ajouter dans Vercel
5. Git push
6. Attendre 3 min
7. Tester
```

---

## 📞 Besoin d'Aide?

### Informations à Fournir

1. **Erreur exacte des logs Vercel**
2. **Checklist complétée** (ci-dessus)
3. **Étapes que vous avez essayées**
4. **Environnement** (OS, Node version)

### Lieux pour Chercher

1. **Vercel Logs:** https://vercel.com/dashboard
2. **Google Cloud Console:** https://console.cloud.google.com
3. **Google Sheets:** https://sheets.google.com

---

*Guide Logs Vercel — Juillet 2026*
