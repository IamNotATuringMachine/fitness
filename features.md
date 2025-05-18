# Feature-Planung: Web-App für Trainingspläne

Dieses Dokument beschreibt die geplanten Features für eine Web-Anwendung zur Erstellung und Verwaltung von Trainingsplänen. Die Features sind in logische Entwicklungsphasen unterteilt, beginnend mit Kernfunktionen (Minimum Viable Product - MVP) bis hin zu erweiterten und innovativen Aspekten.

## Phase 1: Kernfunktionen (MVP - Minimum Viable Product) ✓

Ziel dieser Phase ist es, eine funktionierende Basis-Anwendung zu erstellen, mit der Nutzer einfache Trainingspläne erstellen und verwalten können.

### 1.1. Erstellung von Trainingsplänen ✓
* **Manuelle Planerstellung**:
    * Hinzufügen von Trainingstagen und -einheiten. ✓
    * Auswahl oder manuelle Eingabe von Übungen für jede Einheit. ✓
    * Festlegen von Parametern pro Übung: Sätze, Wiederholungen, Gewicht/Intensität, Dauer, Pausenzeiten. ✓
* **Notizfunktion (Basis)**:
    * Möglichkeit, Anweisungen oder Notizen zu einzelnen Übungen oder zum gesamten Plan hinzuzufügen. ✓

### 1.2. Übungsbibliothek (Basis) ✓
* **Grundlegende Datenbank**:
    * Eine initiale Datenbank mit gängigen Übungen. ✓
    * Pro Übung: Name, Angabe der primär trainierten Muskelgruppen. ✓
* **Benutzerdefinierte Übungen**:
    * Möglichkeit für Benutzer, eigene Übungen zur persönlichen Bibliothek hinzuzufügen. ✓

### 1.3. Speichern, Verwalten und Anzeigen von Plänen ✓
* **Speichern und Laden**:
    * Nutzer können ihre erstellten Pläne speichern und wiederfinden. ✓
* **Planverwaltung**:
    * Möglichkeit, Pläne zu bearbeiten, zu duplizieren oder zu löschen. ✓
* **Ansicht und Export (Basis)**:
    * Übersichtliche Darstellung der erstellten Trainingspläne. ✓
    * Möglichkeit, Pläne auszudrucken oder als PDF zu exportieren. (Teilweise implementiert über Browser-Druckfunktion)

### 1.4. Kalender- und Planungsfunktion (Basis) ✓
* **Darstellung im Kalender**:
    * Anzeige der geplanten Trainingstage in einer Kalenderansicht. ✓
* **Planungsinteraktion**:
    * Möglichkeit, Trainingseinheiten zu planen, zu verschieben und als erledigt zu markieren. ✓

### 1.5. Grundlegende Benutzerfreundlichkeit ✓
* **Responsive Design**:
    * Optimale Darstellung und Bedienbarkeit auf verschiedenen Geräten (Desktop, Tablet, Smartphone). ✓
* **Intuitive Navigation**:
    * Einfache und klare Menüführung. ✓

## Phase 2: Erweiterte Funktionen

Nachdem die Kernfunktionen etabliert sind, werden Funktionen hinzugefügt, die den Nutzen und Komfort für die Anwender erhöhen.

### 2.1. Vorlagen für Trainingspläne ✓
* **Vorlagenbasierte Erstellung**: ✓
    * Zugriff auf eine Bibliothek mit vordefinierten Trainingsplänen für verschiedene Ziele (z.B. Muskelaufbau, Fettverbrennung, Kraftsteigerung, Ausdauer) und Erfahrungslevel. ✓
* **Individualisierbare Vorlagen**: ✓
    * Nutzer können bestehende Vorlagen an ihre spezifischen Bedürfnisse anpassen. ✓

### 2.2. Fortschrittsverfolgung (Tracking) ✓
* **Protokollierung**: ✓
    * Möglichkeit für Nutzer, ihre tatsächlich absolvierten Trainingseinheiten zu protokollieren (Sätze, Wiederholungen, tatsächlich verwendete Gewichte etc.). ✓
* **Visualisierung**: ✓
    * Grafische Darstellung des Fortschritts (z.B. Kraftsteigerung bei bestimmten Übungen, Entwicklung des Körpergewichts). ✓
* **Körpermaße**: ✓
    * Möglichkeit, Körpermaße (z.B. Umfang von Armen, Brust, Taille, Gewicht, Körperfettanteil) und optional Fotos zu dokumentieren. ✓

### 2.3. Analyse und Auswertung ✓
* **Statistiken**: ✓
    * Auswertungen über das Trainingsvolumen, die Häufigkeit und die Einhaltung der Pläne. ✓
* **Feedback (Basis)**: ✓
    * Einfaches Feedback oder Vorschläge basierend auf den protokollierten Daten (z.B. Erinnerung an geplante Steigerungen). ✓

### 2.4. Erweiterte Übungsbibliothek ✓
* **Filterfunktionen**: ✓
    * Umfangreiche Filterung der Übungsdatenbank (z.B. nach Muskelgruppe, benötigtem Equipment, Schwierigkeitsgrad). ✓

### 2.5. Komplexere Trainingsmethoden ✓
* **Abbildung von Spezialtechniken**: ✓
    * Funktionen, um komplexere Trainingsmethoden wie Supersätze, Dropsets oder Zirkeltraining einfach im Plan abzubilden und zu protokollieren. ✓

### 2.6. Erweiterte Notizfunktion ✓
* **Detaillierte Notizen**: ✓
    * Möglichkeit, spezifische Notizen zu einzelnen Übungen innerhalb einer Trainingseinheit, zu ganzen Trainingstagen oder zum gesamten Plan hinzuzufügen und zu historisieren. ✓

## Phase 3: Personalisierung und Intelligenz

Diese Phase fokussiert sich auf intelligente Funktionen, die dem Nutzer helfen, seine Trainingsplanung weiter zu optimieren.

### 3.1. Personalisierte Planvorschläge ✓
* **Fitness-Check**: ✓
    * Optionaler Fragebogen oder Test zur Einschätzung des aktuellen Fitnesslevels, der Ziele und Präferenzen. ✓
* **Algorithmus-basierte Vorschläge**: ✓
    * Algorithmen, die Trainingspläne basierend auf Nutzerdaten (Ziele, Erfahrungslevel, verfügbare Zeit/Ausrüstung, Fortschritt) anpassen oder vorschlagen. ✓

### 3.2. Periodisierungstools ✓
* **Zyklusplanung**: ✓
    * Tools zur Planung von Trainingszyklen (Makro-, Meso-, Mikrozyklen) mit variierender Intensität und Volumen. ✓

### 3.3. KI-gestützte Anpassungen ✓
* **Dynamische Anpassung**: ✓
    * Ein intelligenter Algorithmus, der Pläne dynamisch an den Fortschritt und das Feedback des Nutzers anpasst. ✓
* **Regenerationsberücksichtigung**: ✓
    * Berücksichtigung von Muskelregeneration und Vorschläge zur Vermeidung von Übertraining durch Analyse der Trainingshistorie. ✓
* **Übungsbewertung und Alternativen**: ✓
    * Bewertung von Übungen hinsichtlich ihrer Effektivität für bestimmte Muskelgruppen. ✓
    * Vorschläge für alternative Übungen bei Überlastung, Verletzungen oder fehlender Ausrüstung. ✓

## Phase 4: Benutzerfreundlichkeit und Design (UX/UI Optimierung)

Parallel und nach den Funktionserweiterungen erfolgt eine kontinuierliche Optimierung der Nutzererfahrung.

### 4.1. Optimierte Benutzeroberfläche ✓
* **Ansprechendes Design**:
    * Modernes und motivierendes Design. ✓
* **Drag-and-Drop-Funktionalität**:
    * Insbesondere für die Planerstellung und Übungsanordnung. ✓

### 4.2. Individualisierung der Oberfläche ✓
* **Anpassbare Ansichten**:
    * Möglichkeit für Nutzer, bestimmte Ansichten anzupassen. ✓
* **Themes**:
    * Optionale Themes zur Personalisierung des Erscheinungsbildes. ✓

## Phase 5: Weitere Potenziale und Integrationen

Funktionen, die über die reine Trainingsplanung hinausgehen oder die Plattform erweitern.

### 5.1. Ernährungsintegration ✓
* **Planerstellung/Integration**: ✓
    * Möglichkeit, Ernährungspläne zu erstellen oder zu integrieren, die auf die Trainingsziele abgestimmt sind. ✓
* **Tracking (Basis)**: ✓
    * Optionales Kalorien- und Nährstofftracking. ✓

### 5.2. Gamification
* **Motivations-Elemente**:
    * Einführung von spielerischen Elementen wie Abzeichen, Punktesystemen oder Herausforderungen zur Steigerung der Motivation.

### 5.3. Import/Export von Daten (erweitert)
* **Datenportabilität**:
    * Möglichkeit, Trainingsdaten oder Pläne in gängigen Formaten (z.B. CSV, JSON) zu importieren oder zu exportieren für Nutzung in anderen Tools oder zur Archivierung.

## Übergreifende Aspekte (Kontinuierlich zu berücksichtigen)

Diese Punkte sind während des gesamten Entwicklungszyklus relevant.

* **Datensicherheit und Datenschutz**:
    * Besonders wichtig beim Umgang mit persönlichen Gesundheitsdaten. Umsetzung der DSGVO und anderer relevanter Datenschutzrichtlinien. Sichere Speicherung und Übertragung von Daten.
* **Skalierbarkeit**:
    * Die Architektur sollte so gewählt werden, dass die App mit wachsender Nutzerzahl und Datenmenge umgehen kann.
* **Performance**:
    * Schnelle Ladezeiten und eine flüssige Bedienung sind essenziell für eine gute User Experience.
* **Monetarisierung (falls geplant)**:
    * Frühzeitige Überlegungen, ob und wie die App monetarisiert werden soll (z.B. Freemium-Modell, Abonnements, einmaliger Kauf für bestimmte Features).
* **Nutzerfeedback**:
    * Kontinuierliches Sammeln und Auswerten von Nutzerfeedback zur Priorisierung und Verbesserung von Funktionen. Der MVP-Ansatz sollte iterativ weitergeführt werden.