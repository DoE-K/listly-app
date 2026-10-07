# Listly

Eine moderne, visuelle Web-App zum Erstellen, Ranken und Teilen von Listen zu beliebigen Themen – inspiriert vom Prinzip von Letterboxd, aber universell einsetzbar (Filme, Bücher, Reiseziele, Rezepte, uvm.).

**[Live-Demo ansehen →](https://listly-app.vercel.app/)**

> Die Registrierung ist aktuell öffentlich deaktiviert (Portfolio-Projekt ohne Moderations-Overhead). Zugang über: **E-Mail:** `listly@demo.de` **Passwort:** `listlydemo`

---

## Features

- **Auth** – E-Mail/Passwort-Registrierung und Login via Supabase Auth
- **Feed** – Öffentlicher Feed aller geteilten Listen
- **Profile** – Öffentliche Nutzerprofile mit allen eigenen Listen
- **Listen-Editor** – Titel, Beschreibung, Cover-Bild, Ranked/Unranked-Umschalter, Public/Private-Sichtbarkeit
- **Dynamische Items** – Hinzufügen, Entfernen und Umsortieren per Drag & Drop
- **Bild-Upload** – Cover- und Item-Bilder, automatisch quadratisch zugeschnitten
- **Dark Mode** – Umschaltbar in den Einstellungen
- **Mehrsprachigkeit** – Deutsch & Englisch (next-intl)
- **Vollständiges CRUD** – inkl. Löschen mit Sicherheitsabfrage

## Tech-Stack

|Bereich|Technologie|
|---|---|
|Frontend|Next.js (App Router), React, TypeScript|
|Styling|Tailwind CSS, shadcn/ui|
|Backend|Supabase (PostgreSQL, Auth, Storage)|
|Sicherheit|Row Level Security (RLS), Middleware-basierte Route-Protection|
|Drag & Drop|dnd-kit|
|i18n|next-intl|
|Validierung|Zod|
|Deployment|Vercel|

## Architektur-Highlights

- **Row Level Security** auf Datenbank- und Storage-Ebene – Zugriffsschutz läuft direkt in Postgres, nicht nur in der Anwendungslogik
- **Server Actions** statt klassischer API-Routen für alle Schreiboperationen (Next.js App Router)
- **Middleware-basierte Auth-Kontrolle** – zentrale Route-Protection statt verteilter Checks pro Seite
- **Server/Client-Component-Trennung** nach Next.js-Best-Practices: Datenabruf serverseitig, Interaktivität (Drag & Drop, Bild-Upload, Formulare) gezielt client-seitig

## Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/<dein-username>/listly-app.git
cd listly-app

# Abhängigkeiten installieren
npm install

# .env.local anlegen (siehe .env.example)
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY eintragen

# Dev-Server starten
npm run dev
```

Die App läuft anschließend unter [http://localhost:3000](http://localhost:3000/).

### Supabase-Setup

Das vollständige SQL-Schema (Tabellen, RLS-Policies, Storage-Bucket-Konfiguration) liegt unter [`supabase/schema.sql`](./supabase/schema.sql) und kann direkt im Supabase SQL Editor ausgeführt werden.

## Projektstruktur

```
src/
├── app/                  # Next.js App Router (Pages, Layouts, Server Actions)
│   ├── (auth)/           # Login & Signup
│   ├── feed/             # Öffentlicher Feed
│   ├── lists/            # Listen erstellen, bearbeiten, Detailansicht
│   ├── profile/          # Öffentliche Nutzerprofile
│   └── settings/         # Dark Mode & Sprache
├── components/           # Wiederverwendbare React-Komponenten
│   └── ui/               # shadcn/ui-Komponenten
├── lib/
│   ├── supabase/         # Supabase-Client (Browser, Server, Middleware)
│   ├── queries/          # Zentrale Datenbank-Queries
│   └── validations.ts    # Zod-Schemas
└── i18n/                 # Übersetzungsdateien (DE/EN)
```

## Lizenz

Privates Portfolio-Projekt.