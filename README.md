# Fitness Trainingsplan Web-App

Eine moderne Web-Anwendung zur Erstellung und Verwaltung von Trainingsplänen mit Cloud-Synchronisation und Benutzerauthentifizierung. Diese App ermöglicht es Nutzern, Trainingspläne zu erstellen, zu verwalten, ihren Fortschritt zu verfolgen und ihre Daten geräteübergreifend zu synchronisieren.

## 🚀 Neue Features

### ✅ Benutzerauthentifizierung
- **E-Mail/Passwort-Anmeldung** mit sicherer Registrierung
- **Social Login** mit Google und GitHub OAuth
- **Passwort-Reset** Funktionalität
- **Sichere Sitzungsverwaltung**

### ✅ Cloud-Datensynchronisation
- **Automatische Synchronisation** beim An- und Abmelden
- **Manuelle Sync-Optionen** im Benutzerprofil
- **Geräteübergreifender Zugriff** auf alle Trainingsdaten
- **Konfliktauflösung** bei gleichzeitigen Änderungen

### ✅ Backup-System
- **Automatische Backups** in der Cloud
- **Manuelle Backup-Erstellung**
- **Backup-Wiederherstellung**
- **Backup-Historie** mit Zeitstempel

## Installation

1. Stelle sicher, dass Node.js und npm auf deinem System installiert sind
2. Klone das Repository
3. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```
4. **Supabase Setup** (erforderlich für Authentifizierung und Datensync):
   - Folge der detaillierten Anleitung in `SUPABASE_SETUP.md`
   - Erstelle eine `.env` Datei mit deinen Supabase-Credentials
5. Starte die Entwicklungsumgebung:
   ```bash
   npm start
   ```
6. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser

## Umgebungsvariablen

Erstelle eine `.env` Datei im Projektverzeichnis:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## Features

### Kernfunktionen (Phase 1) ✅
- ✅ Trainingsplan-Erstellung und -Verwaltung
- ✅ Übungsbibliothek mit umfangreicher Sammlung
- ✅ Workout-Tracking mit Fortschrittsverfolgung
- ✅ Kalender-Integration
- ✅ Datenexport und -import
- ✅ **Benutzerauthentifizierung**
- ✅ **Cloud-Datensynchronisation**

### Erweiterte Funktionen (Phase 2) ✅
- ✅ Gamification-System mit Punkten und Abzeichen
- ✅ Ernährungsplanung und -tracking
- ✅ Erweiterte Analytik und Statistiken
- ✅ Körpermaße-Tracking
- ✅ Soziale Features (Grundlagen)

### Personalisierung (Phase 3) 🔄
- 🔄 KI-Trainingsassistent
- 🔄 Personalisierte Trainingspläne
- 🔄 Periodisierungs-Tools
- 🔄 Adaptive Empfehlungen

### Design & UX (Phase 4) ✅
- ✅ Responsive Design für alle Geräte
- ✅ Dark/Light Mode
- ✅ Moderne UI mit Styled Components
- ✅ PWA-Funktionalität
- ✅ Offline-Unterstützung

## Technologien

### Frontend
- **React.js** - Moderne UI-Bibliothek
- **React Router** - Client-side Routing
- **Styled Components** - CSS-in-JS Styling
- **React Calendar** - Kalenderfunktionen
- **React Icons** - Icon-Bibliothek
- **Chart.js** - Datenvisualisierung

### Backend & Authentifizierung
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relationale Datenbank
- **Row Level Security** - Datensicherheit
- **OAuth Integration** - Social Login

### Entwicklung & Deployment
- **Create React App** - Build-Tool
- **GitHub Pages** - Hosting
- **Service Worker** - PWA & Offline-Support
- **UUID** - Eindeutige ID-Generierung

## Sicherheit

- 🔒 **Row Level Security (RLS)** - Automatische Datenisolierung
- 🔒 **Sichere Authentifizierung** - JWT-basierte Sessions
- 🔒 **Input-Validierung** - Client- und serverseitig
- 🔒 **HTTPS-Verschlüsselung** - Sichere Datenübertragung
- 🔒 **Rate Limiting** - Schutz vor Missbrauch

## Deployment

### Entwicklung
```bash
npm start
```

### Produktion
```bash
npm run build
npm run deploy
```

Die App wird automatisch auf GitHub Pages deployed.

## Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne eine Pull Request

## Support

Bei Fragen oder Problemen:
1. Überprüfe die `SUPABASE_SETUP.md` für Setup-Hilfe
2. Schaue in die Browser-Konsole für Fehlermeldungen
3. Erstelle ein Issue im Repository

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. 