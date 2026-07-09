# 🔧 DIAGNOSTIC - Erreur 500 API

## ❌ Problème

```
Erreur chargement: Error: Erreur API
Status: 500 (Internal Server Error)
```

---

## 🔍 Causes Possibles (par ordre de probabilité)

### 1️⃣ **Variables d'Environnement Manquantes** (80% des cas) 🔴

**Symptôme:** Erreur 500 au démarrage de l'app

**Vérification:**

Vercel Dashboard:
1. Aller à: **Settings → Environment Variables**
2. Vérifier que vous avez:
   - ✅ `GOOGLE_SHEET_ID`
   - ✅ `GOOGLE_SERVICE_ACCOUNT_KEY`

3. Les deux doivent être présentes et non vides

**Solution:**

```bash
# Si absent, ajouter dans Vercel Dashboard:

GOOGLE_SHEET_ID = "votre-id-sheet"
# Exemple: 1A2B3C4D5E6F7G8H9I0J

GOOGLE_SERVICE_ACCOUNT_KEY = '{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n..."}'
# C'est un JSON complet en une seule ligne
```

**Comment obtenir ces valeurs:**

```
GOOGLE_SHEET_ID:
1. Ouvrir votre Google Sheet
2. URL: https://docs.google.com/spreadsheets/d/XXXXXXX/edit
                                              ↑
                                         Copier cela

GOOGLE_SERVICE_ACCOUNT_KEY:
1. Google Cloud Console → Service Accounts
2. Sélectionner service account
3. Keys → Create new key → JSON
4. Copier tout le JSON, mettre entre guillemets simples
```

**Redéployer après ajout:**
```bash
git push  # Vercel redéploie automatiquement
```

---

### 2️⃣ **Feuille Google Sheets Nommage Incorrect** (10% des cas) 🟠

**Symptôme:** Erreur 500 lors du chargement

**Vérification:**

sheets.js cherche: `'EPI PERSONNELS SMPM'` (exactement!)

Vérifier dans Google Sheets:
- ✅ Feuille 1: Nommée exactement `EPI PERSONNELS SMPM`
- ❌ Pas `EPI Personnels SMPM` (casse différente)
- ❌ Pas `EPI_PERSONNELS_SMPM` (underscores)
- ❌ Pas `EPI PERSONNELS` (nom tronqué)

**Solution:**

1. Ouvrir Google Sheets
2. Right-click sur l'onglet feuille
3. Rename → Taper exactement: `EPI PERSONNELS SMPM`
4. OK
5. Rafraîchir l'app

---

### 3️⃣ **Service Account Permissions Manquantes** (5% des cas) 🟡

**Symptôme:** Erreur 500 lors de save/update

**Vérification:**

1. Google Cloud Console
2. Service Accounts → Votre compte
3. Vérifier email: `xxx@xxx.iam.gserviceaccount.com`
4. Google Sheets → Partager
5. Ajouter email service account
6. Permission: **Editor** (pas Viewer!)

**Solution:**

```
1. Google Sheets → Partager
2. Ajouter: xxx@xxx.iam.gserviceaccount.com
3. Permission: Editor
4. Envoyer
5. Attendre 30 secondes
6. Tester l'app
```

---

### 4️⃣ **JSON KEY Malformé** (3% des cas) 🟡

**Symptôme:** Erreur 500, erreur parsing JSON

**Vérification:**

La clé doit être:
- ✅ Une string JSON complète entre guillemets simples
- ✅ Pas de retours à la ligne (tout sur une ligne)
- ✅ Tous les caractères spéciaux échappés
- ✅ Commence par `{"type":"service_account"`

**Solution:**

Récupérer clé depuis Google Cloud:
1. Service Accounts → Votre compte
2. Keys → Create new key → JSON
3. Copier tout le contenu du fichier JSON
4. Dans Vercel, mettre entre guillemets simples: `'{JSON_ICI}'`

---

## 🧪 Tester Localement (Debug)

### 1. Créer `.env.local`

```bash
# .env.local (à la racine du projet)
GOOGLE_SHEET_ID=votre-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 2. Tester l'API directement

```bash
# Terminal
curl "http://localhost:3000/api/sheets"

# Ou dans navigateur console:
fetch('/api/sheets')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### 3. Vérifier console Vercel

```bash
vercel logs --prod
```

Chercher l'erreur complète (pas juste "Erreur API")

---

## 📋 Checklist Diagnostic Rapide

- [ ] GOOGLE_SHEET_ID existe dans Vercel Settings
- [ ] GOOGLE_SERVICE_ACCOUNT_KEY existe dans Vercel Settings
- [ ] Feuille nommée exactement: `EPI PERSONNELS SMPM`
- [ ] Service account a permission Editor
- [ ] JSON key est complet (commence par `{"type":"service_account"`)
- [ ] Pas de retours à la ligne dans JSON key
- [ ] Redéploiement fait (après change env vars)
- [ ] Cache navigateur vidé (Ctrl+Shift+Del)
- [ ] Incognito mode testé (pour vérifier cache)

---

## 🚀 Solutions Étape par Étape

### Solution 1: Ajouter Variables d'Env (Cas le plus courant)

```
1. Vercel Dashboard
2. Votre Project
3. Settings → Environment Variables
4. Ajouter:
   Name: GOOGLE_SHEET_ID
   Value: 1A2B3C...
   
   Name: GOOGLE_SERVICE_ACCOUNT_KEY
   Value: '{"type":"service_account",...}'

5. Sauvegarder
6. Attendre 10 secondes
7. `git push` → Redéploiement automatique
8. Attendre 2-3 min
9. Tester l'app
```

### Solution 2: Vérifier Feuille Google Sheets

```
1. Ouvrir Google Sheets
2. Right-click feuille → Rename
3. Taper: EPI PERSONNELS SMPM (exactement!)
4. OK
5. Rafraîchir navigateur
```

### Solution 3: Vérifier Service Account Permissions

```
1. Google Cloud Console
2. Service Accounts → Votre compte
3. Copier email
4. Google Sheets → Partager
5. Ajouter email
6. Permission: Editor
7. Envoyer
8. Attendre 30 sec
9. Tester
```

---

## 🐛 Erreurs Spécifiques

### "GOOGLE_SERVICE_ACCOUNT_KEY manquante"

```javascript
// Dans sheets.js, ligne:
if (!SERVICE_ACCOUNT_KEY) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY manquante');
}
```

**Cause:** Variable d'env manquante  
**Solution:** Ajouter dans Vercel Settings (Solution 1)

---

### "Invalid JSON in service account key"

```
Cause: JSON key malformé
Solution: 
1. Récupérer nouvelle clé depuis Google Cloud
2. Copier/coller entièrement
3. Mettre entre guillemets simples
4. Pas de retours à la ligne
```

---

### "Permission denied" (403)

```
Cause: Service account n'a pas accès à la sheet
Solution: 
1. Vérifier service account partagé (Solution 3)
2. Vérifier permission: Editor (pas Viewer)
3. Attendre 30-60 secondes
4. Tester
```

---

### "Sheet not found" (404)

```
Cause: Feuille "EPI PERSONNELS SMPM" n'existe pas ou mal nommée
Solution:
1. Vérifier exact name (case-sensitive)
2. Pas d'espaces supplémentaires
3. Pas de tirets/underscores
4. Recharger (Solution 2)
```

---

## 🔄 Workflow Complet pour Fixer

### 1. Vérifier Logs

```bash
# Voir erreur complète
vercel logs --prod
```

### 2. Identifier Cause

Chercher dans logs:
- "manquante" → Variable d'env
- "not found" → Feuille mal nommée
- "Permission denied" → Permissions
- "Invalid JSON" → Clé malformée

### 3. Appliquer Solution

Voir Solutions 1-3 ci-dessus

### 4. Redéployer

```bash
git push  # Ou si change seulement env vars, attendre redéploiement auto
```

### 5. Tester

```bash
# Vider cache navigateur
Ctrl+Shift+Del → Clear everything

# Ou tester en incognito
Ctrl+Shift+N
Aller à https://votre-app.vercel.app
```

---

## ⚠️ Notes Importantes

### Variables d'Env Redéploiement

Quand vous changez variables d'env dans Vercel:
- ✅ Le redéploiement est **automatique**
- ⏱️ Attendre **2-3 minutes**
- 🔄 Puis vider cache navigateur

### Service Account Permissions

Quand vous partagez la sheet:
- ✅ L'accès est **immédiat** en théorie
- ⏱️ Mais Google met parfois **30-60 sec**
- 🔄 Puis tester dans nouvelle session navigateur

### JSON Key Format

La clé doit être:
```
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"-----BEGIN...","client_email":"...@iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}'
```

Pas de retours à la ligne, guillemets simples autour!

---

## 🎯 Prochaines Étapes

### Si toujours 500 après checklist:

1. **Vérifier console.log détaillé**
   ```bash
   vercel logs --prod | grep -i error
   ```

2. **Tester en local avec .env.local**
   ```bash
   npm start
   # Voir erreur locale
   ```

3. **Vérifier Google Cloud Console**
   - Service Account existe?
   - API Sheets activée?
   - Clé valide?

4. **Recréer Service Account**
   ```
   1. Google Cloud Console
   2. Service Accounts → Delete ancien
   3. Create new → Download JSON key
   4. Ajouter key dans Vercel
   5. Redéployer
   ```

---

## 📞 Support

### Questions Communes

**Q: J'ai l'erreur 500 mais les variables d'env sont là**  
A: Vérifier feuille Google Sheets nommée exactement `EPI PERSONNELS SMPM`

**Q: Ça marche en local mais pas en production**  
A: Variables d'env manquantes sur Vercel (différent de `.env.local`)

**Q: Erreur 500 seulement quand j'essaie d'éditer**  
A: Permissions service account insuffisantes (doit être Editor, pas Viewer)

**Q: Quel format pour GOOGLE_SHEET_ID?**  
A: Long string alphanumérique, extrait de l'URL Google Sheets

---

*Guide Diagnostic — Juillet 2026*

**Commencez par la checklist ci-dessus! ✅**
