# 🔑 COMMENT OBTENIR GOOGLE_SERVICE_ACCOUNT_KEY

## C'est Quoi?

Une **clé de service** qui permet à Vercel d'accéder à votre Google Sheets.

C'est un long texte JSON qui ressemble à:

```json
{
  "type": "service_account",
  "project_id": "mon-projet-12345",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "mon-service@mon-projet.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...plus de champs...
}
```

---

## 📋 Étapes Pour L'Obtenir

### Étape 1: Ouvrir Google Cloud Console

1. Aller à: **https://console.cloud.google.com**
2. Se connecter avec votre compte Google
3. Voir écran bleu avec "Google Cloud"

### Étape 2: Créer/Sélectionner un Projet

1. En haut à gauche, cliquer sur le **sélecteur de projet**
2. Ou créer nouveau: **Créer un projet**
   - Donner un nom: "EPI-SMPM" (par exemple)
   - Cliquer "Créer"
3. Attendre quelques secondes que le projet se crée

### Étape 3: Activer l'API Google Sheets

1. Barre de recherche en haut: Taper **"Sheets API"**
2. Cliquer sur **Google Sheets API**
3. Bouton: **ACTIVER** (en bleu)
4. Attendre que cela se fasse (quelques secondes)

### Étape 4: Créer un Service Account

1. Barre de recherche: Taper **"Service Accounts"**
2. Cliquer sur **Service Accounts**
3. Bouton en haut: **+ CRÉER UN COMPTE DE SERVICE**
   - Ou en français: **Créer un compte de service**

4. Formulaire:
   ```
   Nom du compte de service: "epi-smpm-bot"
   Description (optionnel): "Bot pour accéder à Google Sheets"
   Cliquer: Créer et continuer
   ```

5. Permissions (facultatif, on peut laisser vide):
   - Cliquer: **Continuer**

6. Créer une clé:
   - Cliquer: **Créer une clé**
   - Type: **JSON**
   - Bouton: **Créer**

### Étape 5: Télécharger la Clé

**Un fichier JSON va se télécharger automatiquement**

Exemple: `mon-projet-12345-abc123def456.json`

Ouvrir ce fichier avec un éditeur de texte (Notepad, VS Code, etc.)

---

## 📝 Récupérer la Valeur

### Copier Toute la Clé JSON

```
1. Ouvrir le fichier JSON téléchargé
2. Sélectionner TOUT le contenu (Ctrl+A)
3. Copier (Ctrl+C)
```

### Exemple de Contenu:

```json
{
  "type": "service_account",
  "project_id": "epi-smpm-12345",
  "private_key_id": "1a2b3c4d5e6f7g8h9i0j",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQE...",
  "client_email": "epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/epi-smpm-bot%40epi-smpm-12345.iam.gserviceaccount.com"
}
```

---

## 🔗 Ajouter à Vercel

### 1. Aller à Vercel

https://vercel.com/dashboard

### 2. Sélectionner votre Project

Cliquer sur le project "epi-smpm-app" (ou son nom)

### 3. Settings → Environment Variables

```
Dashboard
  → Sélectionner project
    → Settings
      → Environment Variables
```

### 4. Ajouter la Clé

**Cliquer: "Add Environment Variable"**

Remplir:
```
Name: GOOGLE_SERVICE_ACCOUNT_KEY

Value: Coller TOUTE la clé JSON (étape précédente)
       (Entre guillemets simples pour Vercel)
```

**⚠️ IMPORTANT:**

- Copier/coller le JSON COMPLET
- Entre guillemets simples: `'{JSON_ICI}'`
- Tout sur UNE SEULE LIGNE (pas de retours à la ligne)
- Exemple:

```
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"epi-smpm-12345","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com",...}'
```

### 5. Sauvegarder

Cliquer: **"Save"** ou **"Add"**

---

## 👥 Donner Accès au Service Account

### Important!

Le service account ne peut pas lire votre Google Sheets **tant qu'on ne lui donne pas l'accès**.

### Étapes:

1. **Copier l'email du service account**
   
   Vous l'avez dans la clé JSON, c'est:
   ```
   "client_email": "epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com"
   ```

2. **Ouvrir votre Google Sheets**
   
   https://sheets.google.com → Votre fichier "EPI SMPM"

3. **Partager**
   
   Bouton bleu en haut à droite: **"Partager"**

4. **Ajouter l'email du service account**
   
   Coller: `epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com`
   (Remplacer par le vrai email de votre service account)

5. **Permission: ÉDITEUR**
   
   ⚠️ IMPORTANT! Doit être "**Éditeur**" pas "Lecteur"!
   
   Sinon Vercel ne peut pas sauvegarder/modifier les données.

6. **Envoyer**
   
   Cliquer: "Partager" ou "Envoyer"

7. **Attendre 30-60 secondes**
   
   Google met un peu de temps à activer l'accès.

---

## ✅ Vérification

### Checklist Complète:

```
Google Cloud:
✅ Projet créé
✅ Sheets API activée
✅ Service Account créé
✅ Clé JSON téléchargée

Vercel:
✅ GOOGLE_SERVICE_ACCOUNT_KEY ajoutée (Variable d'env)
✅ GOOGLE_SHEET_ID aussi ajoutée (autre variable d'env)

Google Sheets:
✅ Partagée avec email du service account
✅ Permission: Éditeur (pas Lecteur)
✅ Attente 30-60 sec après partage
```

### Tester:

```bash
# Redéployer
git push

# Attendre 2-3 min
# Puis tester l'app
```

---

## 🆘 Problèmes Courants

### ❌ "J'ai téléchargé le JSON mais j'ai perdu le fichier"

**Solution:**

1. Google Cloud Console
2. Service Accounts → Votre service account
3. Onglet "Keys"
4. Bouton: **Create Key → JSON**
5. Novo fichier se télécharge

### ❌ "La clé ne fonctionne pas"

**Vérifier:**

1. ✅ Toute la clé copié (pas juste une partie)
2. ✅ Entre guillemets simples dans Vercel
3. ✅ Email du service account partagé avec Google Sheets
4. ✅ Permission: Éditeur (pas Lecteur)
5. ✅ Attendu 60 secondes après partage

### ❌ "Erreur: Permission denied"

**Cause:** Service account n'a pas accès à la sheet

**Solution:**

1. Refaire le partage (étapes ci-dessus)
2. Vérifier email exact
3. Vérifier permission: **Éditeur**
4. Attendre 60 secondes
5. Tester

### ❌ "Erreur: 403 Forbidden"

**Même cause que ci-dessus**

Relancer le partage avec permission Éditeur

---

## 📸 Captures d'Écran Texte

### Google Cloud Console

```
┌─────────────────────────────────────┐
│ Google Cloud                    [≡] │
├─────────────────────────────────────┤
│ Projet: epi-smpm                    │
│ Services                            │
│ [Recherche] → Taper "Sheets API"   │
└─────────────────────────────────────┘
```

### Service Accounts

```
┌─────────────────────────────────────┐
│ Service Accounts                    │
├─────────────────────────────────────┤
│ [+ Créer un compte de service]      │
│                                     │
│ Compte: epi-smpm-bot               │
│  Email: epi-smpm-bot@epi-smpm-... │
│  ID: 123456789012345678901        │
│                                     │
│ [Voir clés JSON]                    │
└─────────────────────────────────────┘
```

### Vercel Environment Variables

```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ Name: GOOGLE_SHEET_ID               │
│ Value: 1A2B3C4D5E6F...             │
│                                     │
│ Name: GOOGLE_SERVICE_ACCOUNT_KEY    │
│ Value: '{"type":"service_account"..│
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

---

## 📋 Résumé Rapide

**3 Étapes:**

1. **Google Cloud Console:**
   - Créer Service Account
   - Télécharger clé JSON

2. **Vercel:**
   - Ajouter variable d'env: GOOGLE_SERVICE_ACCOUNT_KEY
   - Valeur = contenu du JSON

3. **Google Sheets:**
   - Partager avec email du service account
   - Permission: Éditeur
   - Attendre 60 sec

**Puis:** `git push` → Vercel redéploie → Tester ✅

---

## 🎥 Vidéo Tutoriel (Texte)

Si vous êtes bloqué, voici pas à pas:

```
1. Ouvrir https://console.cloud.google.com
   ↓
2. Créer/Sélectionner un projet
   ↓
3. Activer "Google Sheets API"
   ↓
4. Créer un Service Account
   (Nom: "epi-smpm-bot")
   ↓
5. Créer une clé JSON
   (Télécharge automatiquement)
   ↓
6. Ouvrir le fichier JSON avec Notepad
   ↓
7. Copier TOUT le contenu (Ctrl+A → Ctrl+C)
   ↓
8. Vercel Dashboard → Settings → Environment Variables
   ↓
9. Ajouter: GOOGLE_SERVICE_ACCOUNT_KEY = '{JSON_ICI}'
   ↓
10. Google Sheets → Partager → Ajouter email du service account
    (Permission: Éditeur)
   ↓
11. git push
   ↓
12. Attendre 2-3 min
   ↓
13. Tester l'app ✅
```

---

*Guide GOOGLE_SERVICE_ACCOUNT_KEY — Juillet 2026*

**Besoin d'aide? Relisez ce guide, c'est complet! ✅**
