# Techniker-Planungs-System

Ein vollständiges System zur Steuerung des Techniker-Planungs-Workflows für ALMAS Industries.

## 🎯 Features

### N8N Workflow
- **Phase 1:** Automatisches Laden der Kundenliste aus Google Sheets
- **Phase 2:** Intelligente Tourenplanung mit Kalender-Check, geografischem Clustering und Routenberechnung
- **Phase 3:** Automatischer Versand von Terminanfragen per E-Mail
- **Phase 4:** Verarbeitung von Kundenantworten (Bestätigung/Absage/Änderung)
- **Phase 5:** Status-Updates und Benachrichtigungen

### Web-Dashboard
- 📊 **Status-Übersicht:** Alle offenen, bestätigten und abgesagten Termine auf einen Blick
- 📅 **Wochenansicht:** Visuelle Darstellung aller Techniker-Termine (Mo-Fr, 08:00-17:00)
- 👨‍🔧 **Techniker-Karten:** Pro Techniker: aktuelle Tour, nächster Termin, Fahrzeiten
- 📧 **E-Mail-Queue:** Status aller zu sendenden/gesendeten E-Mails
- ▶️ **Workflow-Steuerung:** Buttons zum Starten/Stoppen des Workflows

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+
- N8N (self-hosted oder Cloud)
- Google Workspace (Sheets, Calendar)
- SMTP-Zugang für E-Mail-Versand

### Installation

```bash
# Repository klonen
git clone https://github.com/jlanger-blip/techniker-planung.git
cd techniker-planung

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft dann unter `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Projektstruktur

```
techniker-planung/
├── src/
│   ├── components/
│   │   ├── StatusOverview.tsx    # Übersichts-Dashboard
│   │   ├── WeekView.tsx          # Wochenkalender
│   │   ├── TechnicianCard.tsx    # Techniker-Karten
│   │   └── EmailQueue.tsx        # E-Mail-Queue
│   ├── App.tsx                   # Hauptkomponente
│   ├── types.ts                  # TypeScript-Typen
│   └── main.tsx                  # Entry Point
├── n8n/
│   └── techniker-planung-workflow.json  # N8N Workflow Export
├── public/
└── package.json
```

## ⚙️ N8N Workflow Setup

### 1. Workflow importieren
1. In N8N: Settings → Import Workflow
2. `n8n/techniker-planung-workflow.json` auswählen
3. Workflow aktivieren

### 2. Credentials einrichten

**Google Sheets API:**
- API Key aus Google Cloud Console
- Sheet-ID: `1K0vBkaeVWs8FLxNvZQ5Hckv7gFhKP1L8Wpf3EErha-U`

**Google Calendar OAuth:**
- OAuth2 Credentials für Kalender-Zugriff
- Scopes: `calendar.events`, `calendar.readonly`

**SMTP (E-Mail):**
- Host: `smtp.ionos.de`
- Port: `587` (TLS)
- User: `chatbot@almas-industries.de`

**IMAP (E-Mail lesen):**
- Host: `imap.ionos.de`
- Port: `993` (SSL)
- User: `chatbot@almas-industries.de`

### 3. Umgebungsvariablen

```env
WEBHOOK_NOTIFICATION_URL=https://your-app.vercel.app/api/webhook
GOOGLE_SHEETS_API_KEY=your-api-key
```

## 📊 Google Sheet Struktur

### Blatt "Kundenliste"
| Spalte | Inhalt |
|--------|--------|
| A | ID |
| B | Name |
| C | E-Mail |
| D | Adresse |
| E | PLZ |
| F | Stadt |
| G | Status (offen/abgeschlossen) |
| H | Lat (Koordinate) |
| I | Lng (Koordinate) |

### Blatt "Techniker"
| Spalte | Inhalt |
|--------|--------|
| A | ID |
| B | Name |
| C | E-Mail |
| D | Kalender-ID |

### Blatt "Termine"
| Spalte | Inhalt |
|--------|--------|
| A | Kunden-ID |
| B | Kundenname |
| C | Techniker-ID |
| D | Technikername |
| E | Datum/Uhrzeit |
| F | Status |
| G | Kunden-E-Mail |
| H | Letzte Aktualisierung |

## 🔧 Konfiguration

### Arbeitszeiten
- Montag - Freitag
- 08:00 - 17:00 Uhr
- Max. 8 Stunden pro Tag

### Startpunkt
- Frankfurt am Main (50.1109, 8.6821)

### Termin-Dauer
- Standard: 60 Minuten + 60 Minuten Puffer

## 🌐 Deployment

### Vercel (empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

Oder über GitHub Integration:
1. Repository mit GitHub verbinden
2. Vercel importiert automatisch

### Umgebungsvariablen in Vercel
```
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook
VITE_API_BASE_URL=/api
```

## 📝 API Endpoints (N8N Webhooks)

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/techniker-status` | GET | Aktuellen Status abrufen |
| `/api/techniker-start` | POST | Workflow manuell starten |

## 🔒 Sicherheit

- Alle API-Keys nur serverseitig verwenden
- CORS-Einstellungen in N8N beachten
- OAuth Refresh Tokens sicher speichern

## 📞 Support

Bei Fragen: chatbot@almas-industries.de

---

Made with ❤️ for ALMAS Industries
