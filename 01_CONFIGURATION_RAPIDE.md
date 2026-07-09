# ⚡ CONFIGURATION RAPIDE - 15 Minutes

**Erreur 500? Suivez ce guide exactement!**

---

## 📋 ÉTAPE 1: Obtenir GOOGLE_SHEET_ID (2 min)

### A. Ouvrir Google Sheets

1. Aller à: https://sheets.google.com
2. Cliquer sur votre fichier **"EPI SMPM"**
3. Regarder l'URL en haut du navigateur

### B. Copier l'ID

L'URL ressemble à:
```
https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit
                                        ↑
                                   COPIER CECI
```

Entre `/d/` et `/edit`, copier la longue chaîne de caractères.

**Exemple ID:** `1mKm0t8pY9ZqLjK2vX3nP4aB5cD6eF7gH8iJ9kL0m`

✅ **SAUVEGARDEZ-LE QUELQUE PART** (Notepad, ou autre)

---

## 🔑 ÉTAPE 2: Obtenir GOOGLE_SERVICE_ACCOUNT_KEY (5 min)

### A. Google Cloud Console

1. Aller à: https://console.cloud.google.com
2. Se connecter

### B. Créer/Sélectionner un Projet

1. En haut à gauche, voir un sélecteur de projet
2. Cliquer dessus
3. Bouton **"Créer un projet"** ou sélectionner existant
   - Nom: "EPI-SMPM"
4. Cliquer "Créer"
5. Attendre quelques secondes

### C. Activer Google Sheets API

1. Barre de recherche (haut de page): Taper **"Sheets API"**
2. Cliquer sur **"Google Sheets API"**
3. Bouton bleu: **"ACTIVER"**
4. Attendre (30 secondes)

### D. Créer Service Account

1. Barre de recherche: Taper **"Service Accounts"**
2. Cliquer: **"Service Accounts"**
3. Bouton: **"+ CREATE SERVICE ACCOUNT"** (ou "Créer un compte de service")
   - Service account name: `epi-smpm-bot`
   - Cliquer: **Create and Continue**
4. Permissions: laisser vide, cliquer **Continue**
5. Voir un nouveau écran

### E. Créer et Télécharger la Clé JSON

1. Onglet: **"Keys"** (en haut)
2. Bouton: **"Add Key"** → **"Create new key"**
3. Type: **"JSON"**
4. Cliquer: **"Create"**
5. **Un fichier JSON se télécharge** automatiquement

### F. Copier la Clé

1. Ouvrir le fichier JSON téléchargé (avec Notepad ou VS Code)
2. Sélectionner TOUT: **Ctrl+A**
3. Copier: **Ctrl+C**

Vous avez maintenant la clé JSON dans votre presse-papiers ✅

---

## 🔗 ÉTAPE 3: Ajouter à Vercel (5 min)

### A. Vercel Dashboard

1. Aller à: https://vercel.com/dashboard
2. Cliquer sur votre projet **"epi-smpm-app"** (ou son nom)

### B. Settings → Environment Variables

```
Gauche de l'écran → Settings
Onglet en haut → Environment Variables
```

### C. Ajouter GOOGLE_SHEET_ID

1. Bouton: **"Add Environment Variable"**

Remplir:
```
Name: GOOGLE_SHEET_ID

Value: 1mKm0t8pY9ZqLjK2vX3nP4aB5cD6eF7gH8iJ9kL0m
       (Votre ID copié à l'étape 1)
```

3. Cliquer: **"Save"**

### D. Ajouter GOOGLE_SERVICE_ACCOUNT_KEY

1. Bouton: **"Add Environment Variable"** (à nouveau)

Remplir:
```
Name: GOOGLE_SERVICE_ACCOUNT_KEY

Value: '{JSON_COPIÉ}'
       (Votre JSON entre guillemets simples)
```

**IMPORTANT:** Guillemets simples autour! Pas guillemets doubles!

Exemple:
```
'{"type":"service_account","project_id":"epi-smpm-12345",...}'
```

3. Cliquer: **"Save"**

✅ **Les deux variables sont maintenant dans Vercel!**

---

## 👥 ÉTAPE 4: Partager Google Sheets (2 min)

### A. Obtenir Email du Service Account

Quand vous avez créé le service account, vous avez reçu un email:

```
epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com
```

**Ou retrouvez-le:**
1. Google Cloud Console → Service Accounts
2. Cliquer sur votre service account
3. Voir "Email" en haut

**Copier cet email** ✅

### B. Partager Google Sheets

1. Ouvrir votre Google Sheets **"EPI SMPM"**
2. Bouton bleu en haut droite: **"Partager"**
3. Coller l'email: `epi-smpm-bot@epi-smpm-12345.iam.gserviceaccount.com`
4. Permission: **⭐ "Éditeur"** (TRÈS IMPORTANT!)
   - Pas "Lecteur"
   - Pas "Commentateur"
   - Doit être "**Éditeur**"
5. Cliquer: **"Partager"**

✅ **L'accès est donné!**

---

## 🚀 ÉTAPE 5: Redéployer (1 min)

### A. Vercel Redéploiement

1. Aller à terminal / cmd
2. Taper:
   ```bash
   git push
   ```
3. Vercel redéploie automatiquement (2-3 minutes)

### B. Tester

1. Aller à votre app Vercel
2. Ouvrir DevTools (F12)
3. Console (Tab)
4. Rechercher erreurs (lignes rouges)
5. Recharger page (Ctrl+R ou Cmd+R)

✅ **Devrait fonctionner maintenant!**

---

## ✅ Checklist Finale

```
Google Sheets:
☐ Fichier "EPI SMPM" existe
☐ Feuille "EPI PERSONNELS SMPM" existe (exacte nom!)
☐ Partagée avec service account (email)
☐ Permission: Éditeur

Google Cloud:
☐ Projet créé
☐ Sheets API activée
☐ Service Account créé
☐ Clé JSON créée et téléchargée

Vercel:
☐ GOOGLE_SHEET_ID ajoutée (variable d'env)
☐ GOOGLE_SERVICE_ACCOUNT_KEY ajoutée (variable d'env)
☐ git push fait
☐ Redéploiement complété (2-3 min)

Tester:
☐ App chargée sans erreur 500
☐ Bouton "🔔 Alertes" visible
☐ Bouton "📍 FMPA" visible (si FMPA installé)
☐ Liste agents chargée
```

---

## 🆘 Si Encore 500

1. **Lire:** `DIAGNOSTIC_ERREUR_500.md`
2. **Voir logs:** `LOGS_VERCEL_GUIDE.md`
3. **Vérifier**: Toutes les variables d'env sont là?
4. **Attendre**: Vercel peut mettre 3 min après env change

---

## 📞 Questions?

### Revoir:

- **OBTENIR_GOOGLE_SHEET_ID.md** - Plus de détails sur l'ID
- **OBTENIR_SERVICE_ACCOUNT_KEY.md** - Plus de détails sur la clé
- **DIAGNOSTIC_ERREUR_500.md** - Si encore erreur
- **LOGS_VERCEL_GUIDE.md** - Comment voir les vrais erreurs

---

**Bon courage! Vous avez ça! ✅**

*Configuration Rapide — Juillet 2026*
