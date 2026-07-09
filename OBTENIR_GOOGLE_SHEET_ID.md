# 🆔 COMMENT OBTENIR GOOGLE_SHEET_ID

## C'est Quoi?

L'**ID unique** de votre Google Sheets.

Exemple: `1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P`

C'est un long code alphanumérique qui identifie votre fichier.

---

## 📋 Comment L'Obtenir (3 Secondes!)

### Méthode 1: Depuis l'URL (Plus Facile) ✅

1. **Ouvrir votre Google Sheets**
   
   https://sheets.google.com → Cliquer sur votre fichier "EPI SMPM"

2. **Regarder l'URL dans la barre d'adresse**
   
   ```
   https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P/edit#gid=0
                                          ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                          C'EST LE SHEET ID
   ```

3. **Copier ce code**
   
   De après `/d/` jusqu'à `/edit`
   
   ```
   1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P
   ```

4. **Voilà! C'est votre GOOGLE_SHEET_ID** ✅

---

## 🔍 Explication Détaillée

### L'URL Complète

```
https://docs.google.com/spreadsheets/d/ID_SHEET/edit#gid=SHEET_NUMBER
```

Décomposition:
```
https://docs.google.com/spreadsheets/d/
  ↑ Domaine Google Sheets

1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P
  ↑ GOOGLE_SHEET_ID (ce qu'on cherche!)

/edit#gid=0
  ↑ Le reste (pas important)
```

### Où Copier (Exemple Réel)

Si votre URL est:
```
https://docs.google.com/spreadsheets/d/1mKm0t8pY9ZqLjK2vX3nP4aB5cD6eF7gH8iJ9kL0m/edit#gid=0
```

Alors GOOGLE_SHEET_ID est:
```
1mKm0t8pY9ZqLjK2vX3nP4aB5cD6eF7gH8iJ9kL0m
```

---

## 📝 Ajouter à Vercel

### 1. Aller à Vercel

https://vercel.com/dashboard

### 2. Sélectionner votre Project

Cliquer sur "epi-smpm-app" (ou son nom)

### 3. Settings → Environment Variables

```
Dashboard
  → Sélectionner project
    → Settings
      → Environment Variables
```

### 4. Ajouter l'ID

**Cliquer: "Add Environment Variable"**

Remplir:
```
Name: GOOGLE_SHEET_ID

Value: 1mKm0t8pY9ZqLjK2vX3nP4aB5cD6eF7gH8iJ9kL0m
       (Sans guillemets, juste la valeur)
```

### 5. Sauvegarder

Cliquer: **"Save"** ou **"Add"**

---

## ✅ Vérification

### Checklist:

```
✅ Ouvert Google Sheets
✅ Copié l'ID depuis l'URL
✅ Ajouté dans Vercel (Settings → Environment Variables)
✅ Nommé exactement: GOOGLE_SHEET_ID (majuscules!)
✅ Valeur: L'ID sans guillemets
```

### Tester:

```bash
git push

# Attendre 2-3 min
# Tester l'app
```

---

## 🆘 Problèmes Courants

### ❌ "Je ne vois pas l'ID dans l'URL"

**Cause:** Vous n'êtes pas dans Google Sheets

**Solution:**

1. Aller à: https://sheets.google.com
2. Cliquer sur votre fichier "EPI SMPM"
3. Regarder l'URL → Copier l'ID

### ❌ "L'ID est trop court / trop long"

**Vérifier:**

```
Bon format: 1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P (33 caractères environ)
Mauvais: "edit" (c'est pas ça!)
Mauvais: "https://docs.google..." (copier que l'ID)
```

### ❌ "Erreur: Sheet not found"

**Cause:** ID incorrect ou feuille supprimée

**Solution:**

1. Vérifier l'ID (recopier depuis l'URL)
2. Vérifier que le fichier Google Sheets existe
3. Vérifier que vous avez accès (pas privé)

---

## 📋 Résumé Rapide

**1 Étape:**

1. Ouvrir Google Sheets
2. Regarder URL
3. Copier l'ID (entre `/d/` et `/edit`)
4. Ajouter dans Vercel: GOOGLE_SHEET_ID = {ID}
5. `git push`

**Voilà!** ✅

---

*Guide GOOGLE_SHEET_ID — Juillet 2026*
