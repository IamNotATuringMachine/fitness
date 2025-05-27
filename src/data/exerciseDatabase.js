// Neue detaillierte deutsche Übungsdatenbank
export const exerciseDatabase = {
  "Brust": [
    {
      "übung_name": "Bankdrücken (Langhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Brust": 1.0,
        "Vordere Schulter": 0.5,
        "Trizeps": 0.5
      },
      "equipment": [
        "Langhantel",
        "Flachbank"
      ],
      "beschreibung": "Grundübung für die Brustmuskulatur.",
      "variationen": [
        {
          "name": "Kurzhantel-Bankdrücken",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 1.0,
            "Vordere Schulter": 0.5,
            "Trizeps": 0.4
          },
          "equipment": [
            "Kurzhanteln",
            "Flachbank"
          ],
          "beschreibung": "Erlaubt größeren Bewegungsumfang, etwas weniger Trizeps-Dominanz im Lockout durch freiere Bewegung."
        },
        {
          "name": "Enges Bankdrücken (Langhantel)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Trizeps": 1.0,
            "Brust (innere Anteile)": 0.6,
            "Vordere Schulter": 0.3
          },
          "equipment": [
            "Langhantel",
            "Flachbank"
          ],
          "beschreibung": "Stärkerer Fokus auf Trizeps und innere Brust."
        },
        {
          "name": "Multipresse Bankdrücken",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 1.0,
            "Vordere Schulter": 0.4,
            "Trizeps": 0.4
          },
          "equipment": [
            "Multipresse",
            "Flachbank"
          ],
          "beschreibung": "Geführte Bewegung, weniger Stabilisierungsarbeit."
        },
        {
          "name": "Bodenpressen",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 0.8,
            "Trizeps": 0.7,
            "Vordere Schulter": 0.4
          },
          "equipment": [
            "Langhantel oder Kurzhanteln",
            "Boden"
          ],
          "beschreibung": "Reduzierter Bewegungsumfang, Fokus auf Lockout und Trizeps."
        }
      ]
    },
    {
      "übung_name": "Schrägbankdrücken (Langhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Obere Brust": 1.0,
        "Vordere Schulter": 0.6,
        "Trizeps": 0.4
      },
      "equipment": [
        "Langhantel",
        "Schrägbank"
      ],
      "beschreibung": "Fokus auf obere Brust."
    },
    {
      "übung_name": "Schrägbankdrücken (Kurzhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Obere Brust": 1.0,
        "Vordere Schulter": 0.6,
        "Trizeps": 0.4
      },
      "equipment": [
        "Kurzhanteln",
        "Schrägbank"
      ],
      "beschreibung": "Fokus auf obere Brust mit größerem Bewegungsumfang."
    },
    {
      "übung_name": "Negativbankdrücken (Langhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Untere Brust": 1.0,
        "Vordere Schulter": 0.3,
        "Trizeps": 0.5
      },
      "equipment": [
        "Langhantel",
        "Negativbank"
      ],
      "beschreibung": "Fokus auf untere Brust."
    },
    {
      "übung_name": "Negativbankdrücken (Kurzhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Untere Brust": 1.0,
        "Vordere Schulter": 0.3,
        "Trizeps": 0.5
      },
      "equipment": [
        "Kurzhanteln",
        "Negativbank"
      ],
      "beschreibung": "Fokus auf untere Brust mit größerem Bewegungsumfang."
    },
    {
      "übung_name": "Brustpresse (Maschine)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Brust": 1.0,
        "Vordere Schulter": 0.4,
        "Trizeps": 0.4
      },
      "equipment": [
        "Brustpresse-Maschine"
      ],
      "beschreibung": "Geführte Druckbewegung für die Brustmuskulatur. Ideal für Anfänger oder als sichere Alternative zum freien Bankdrücken."
    },
    {
      "übung_name": "Multipresse Schrägbankdrücken",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Obere Brust": 1.0,
        "Vordere Schulter": 0.5,
        "Trizeps": 0.3
      },
      "equipment": [
        "Multipresse",
        "Schrägbank"
      ],
      "beschreibung": "Geführte Schrägbankdrücken-Bewegung für die obere Brust."
    },
    {
      "übung_name": "Multipresse Negativbankdrücken",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Untere Brust": 1.0,
        "Vordere Schulter": 0.2,
        "Trizeps": 0.4
      },
      "equipment": [
        "Multipresse",
        "Negativbank"
      ],
      "beschreibung": "Geführte Negativbankdrücken-Bewegung für die untere Brust."
    },
    {
      "übung_name": "Fliegende (Kurzhantel)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Brust": 1.0,
        "Vordere Schulter": 0.2
      },
      "equipment": [
        "Kurzhanteln",
        "Flach-, Schräg- oder Negativbank"
      ],
      "beschreibung": "Isolationsübung für die Brust, Vordere Schulter synergistisch, aber nicht primär.",
      "variationen": [
        {
          "name": "Kabelzug-Fliegende",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 1.0,
            "Vordere Schulter": 0.2
          },
          "equipment": [
            "Kabelzugturm"
          ],
          "beschreibung": "Konstanter Widerstand über den gesamten Bewegungsumfang."
        },
        {
          "name": "Maschinen-Fliegende (Butterfly-Maschine / Pec Deck)",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 1.0,
            "Vordere Schulter": 0.1
          },
          "equipment": [
            "Butterfly-Maschine"
          ],
          "beschreibung": "Geführte Bewegung."
        },
        {
          "name": "Fliegende auf der Schrägbank",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Obere Brust": 1.0,
            "Vordere Schulter": 0.3
          },
          "equipment": [
            "Kurzhanteln oder Kabelzug",
            "Schrägbank"
          ],
          "beschreibung": "Fokus auf obere Brust."
        },
        {
          "name": "Fliegende auf der Negativbank",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Untere Brust": 1.0,
            "Vordere Schulter": 0.1
          },
          "equipment": [
            "Kurzhanteln oder Kabelzug",
            "Negativbank"
          ],
          "beschreibung": "Fokus auf untere Brust."
        }
      ]
    },
    {
      "übung_name": "Liegestütze",
      "übungstyp": "Verbundübung (Körpergewicht)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Brust": 1.0,
        "Vordere Schulter": 0.5,
        "Trizeps": 0.5,
        "Rumpf": 0.2
      },
      "equipment": [
        "Eigengewicht"
      ],
      "beschreibung": "Grundlegende Körpergewichtsübung. Rumpf stabilisierend, geringer direkter Hypertrophie-Reiz im Vgl. zu direkten Rumpfübungen.",
      "variationen": [
        {
          "name": "Breite Liegestütze",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 1.0,
            "Vordere Schulter": 0.4,
            "Trizeps": 0.3
          },
          "equipment": [
            "Eigengewicht"
          ],
          "beschreibung": "Fokus auf Brust."
        },
        {
          "name": "Enge Liegestütze / Diamant-Liegestütze",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Trizeps": 1.0,
            "Brust (innere Anteile)": 0.6,
            "Vordere Schulter": 0.3
          },
          "equipment": [
            "Eigengewicht"
          ],
          "beschreibung": "Fokus auf Trizeps."
        },
        {
          "name": "Erhöhte Liegestütze (Füße erhöht)",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Obere Brust": 1.0,
            "Vordere Schulter": 0.6,
            "Trizeps": 0.4
          },
          "equipment": [
            "Eigengewicht",
            "Erhöhung für Füße"
          ],
          "beschreibung": "Fokus auf obere Brust."
        },
        {
          "name": "Schräge Liegestütze (Hände erhöht)",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust": 0.8,
            "Vordere Schulter": 0.4,
            "Trizeps": 0.4
          },
          "equipment": [
            "Eigengewicht",
            "Erhöhung für Hände"
          ],
          "beschreibung": "Erleichterte Variante."
        }
      ]
    },
    {
      "übung_name": "Dips (Brust-fokussiert)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Untere Brust": 1.0,
        "Trizeps": 0.6,
        "Vordere Schulter": 0.4
      },
      "equipment": [
        "Dip-Barren"
      ],
      "beschreibung": "Oberkörper vorgebeugt für stärkeren Brustfokus."
    },
    {
      "übung_name": "Überzüge",
      "übungstyp": "Je nach Fokus Verbund- oder Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Allgemein": 0.6,
        "Brust": 0.6,
        "Latissimus": 0.4,
        "Serratus": 0.3,
        "Trizeps": 0.2
      },
      "equipment": [
        "Kurzhantel",
        "Langhantel",
        "SZ-Stange",
        "Bank"
      ],
      "beschreibung": "Trainiert Brust und Latissimus, abhängig von der Ausführung.",
      "variationen": [
        {
          "name": "Überzüge (Fokus Brust)",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brust (insb. Dehnung)": 0.8,
            "Serratus anterior": 0.5,
            "Latissimus dorsi": 0.3,
            "Trizeps (langer Kopf, Dehnung)": 0.2
          },
          "equipment": [
            "Kurzhantel",
            "Langhantel",
            "SZ-Stange",
            "Bank"
          ],
          "beschreibung": "Ellenbogen leicht gebeugt, Fokus auf Brustdehnung."
        },
        {
          "name": "Überzüge (Fokus Latissimus, gestreckte Arme)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi": 0.8,
            "Brust": 0.4,
            "Serratus anterior": 0.4,
            "Trizeps (langer Kopf)": 0.3
          },
          "equipment": [
            "Kurzhantel",
            "Langhantel",
            "SZ-Stange",
            "Bank"
          ],
          "beschreibung": "Arme gestreckter, Fokus auf Latissimus."
        }
      ]
    }
  ],
  "Rücken": [
    {
      "übung_name": "Klimmzüge",
      "übungstyp": "Verbundübung (Körpergewicht)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Latissimus dorsi": 1.0,
        "Trapezmuskel (mittl./unt.)": 0.6,
        "Rhomboiden": 0.5,
        "Bizeps/Brachialis": 0.4,
        "Unterarme (Griffkraft)": 0.3
      },
      "equipment": [
        "Klimmzugstange"
      ],
      "beschreibung": "Grundübung für den oberen Rücken, hier als Obergriff-Variante gewichtet.",
      "variationen": [
        {
          "name": "Klimmzüge (Obergriff/Ristgriff)",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi": 1.0,
            "Trapezmuskel (mittl./unt.)": 0.6,
            "Rhomboiden": 0.5,
            "Bizeps/Brachialis": 0.4,
            "Unterarme (Griffkraft)": 0.3
          },
          "equipment": [
            "Klimmzugstange"
          ],
          "beschreibung": "Meist schulterbreit oder weiter. Fokus auf Latissimus."
        },
        {
          "name": "Klimmzüge (Untergriff/Kammgriff)",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi (untere Fasern)": 0.8,
            "Bizeps/Brachialis": 0.7,
            "Trapezmuskel (mittl./unt.)": 0.4,
            "Rhomboiden": 0.3,
            "Unterarme": 0.3
          },
          "equipment": [
            "Klimmzugstange"
          ],
          "beschreibung": "Enger Griff, Handflächen zum Körper. Stärkerer Fokus auf Bizeps und unteren Latissimus."
        }
      ]
    },
    {
      "übung_name": "Rudern (Langhantel vorgebeugt)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Latissimus dorsi": 1.0,
        "Trapezmuskel (alle Anteile)": 0.7,
        "Rhomboiden": 0.7,
        "Hintere Schulter": 0.5,
        "Bizeps/Brachialis": 0.3,
        "Rückenstrecker (isometrisch)": 0.3
      },
      "equipment": [
        "Langhantel"
      ],
      "beschreibung": "Grundübung für die Rückendicke, hier als Obergriff-Variante.",
      "variationen": [
        {
          "name": "Kurzhantelrudern einarmig",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi": 1.0,
            "Trapezmuskel/Rhomboiden": 0.6,
            "Hintere Schulter": 0.4,
            "Bizeps/Brachialis": 0.4,
            "Rumpf (Anti-Rotation)": 0.3
          },
          "equipment": [
            "Kurzhantel",
            "Bank"
          ],
          "beschreibung": "Ermöglicht größeren Bewegungsumfang und unilaterales Training."
        },
        {
          "name": "Sitzendes Kabelrudern (enger Griff)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi (innere/untere Fasern)": 1.0,
            "Trapezmuskel (mittlere Fasern)": 0.8,
            "Rhomboiden": 0.8,
            "Bizeps/Brachialis": 0.5,
            "Hintere Schulter": 0.3
          },
          "equipment": [
            "Kabelzugturm",
            "Enger Griff"
          ],
          "beschreibung": "Fokus auf die inneren und unteren Bereiche des Latissimus."
        },
        {
          "name": "T-Stangen-Rudern",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi": 1.0,
            "Trapezmuskel (mittlere/obere)": 0.8,
            "Rhomboiden": 0.7,
            "Hintere Schulter": 0.4,
            "Bizeps/Brachialis": 0.4
          },
          "equipment": [
            "T-Stange Vorrichtung oder Maschine"
          ],
          "beschreibung": "Kann mit verschiedenen Griffen ausgeführt werden."
        },
        {
          "name": "Multipresse Rudern vorgebeugt",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Latissimus dorsi": 1.0,
            "Trapezmuskel": 0.6,
            "Rhomboiden": 0.6,
            "Hintere Schulter": 0.4,
            "Bizeps/Brachialis": 0.3
          },
          "equipment": [
            "Multipresse"
          ],
          "beschreibung": "Geführte Bewegung, weniger Stabilisation nötig."
        }
      ]
    },
    {
      "übung_name": "Latzug (Breiter Griff zur Brust)",
      "übungstyp": "Verbundübung (maschinenbasiert)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Latissimus dorsi": 1.0,
        "Trapezmuskel (mittl./unt.)": 0.5,
        "Rhomboiden": 0.4,
        "Bizeps/Brachialis": 0.4
      },
      "equipment": [
        "Latzugmaschine",
        "Breiter Latzuggriff"
      ],
      "beschreibung": "Alternative zu Klimmzügen, um die Rückenbreite zu trainieren."
    },
    {
      "übung_name": "Rudergerät mit Bruststütze",
      "übungstyp": "Verbundübung (maschinenbasiert)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Latissimus dorsi": 1.0,
        "Trapezmuskel (mittlere Fasern)": 0.8,
        "Rhomboiden": 0.8,
        "Hintere Schulter": 0.5,
        "Bizeps/Brachialis": 0.4
      },
      "equipment": [
        "Rudergerät mit Bruststütze"
      ],
      "beschreibung": "Stabilisierte Ruderübung für optimale Rückendicke. Die Bruststütze eliminiert Schwung und ermöglicht perfekte Isolation der Rückenmuskulatur."
    },
    {
      "übung_name": "Kreuzheben (Konventionell)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Rückenstrecker": 1.0,
        "Gesäß": 0.8,
        "Beinbeuger": 0.7,
        "Quadrizeps (initial)": 0.5,
        "Trapezmuskel (oberer)": 0.6,
        "Latissimus dorsi (stabilisierend)": 0.4,
        "Unterarme (Griffkraft)": 0.5
      },
      "equipment": [
        "Langhantel"
      ],
      "beschreibung": "Ganzkörperübung mit starkem Fokus auf die gesamte hintere Kette und den Rückenstrecker.",
      "variationen": [
        {
          "name": "Rumänisches Kreuzheben",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Beinbeuger": 1.0,
            "Gesäß": 0.8,
            "Rückenstrecker (isometrisch/dynamisch)": 0.7
          },
          "equipment": [
            "Langhantel",
            "Kurzhanteln"
          ],
          "beschreibung": "Fokus auf Beinbeuger und Gesäß, Knie nur leicht gebeugt."
        },
        {
          "name": "Sumo-Kreuzheben",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gesäß": 1.0,
            "Quadrizeps": 0.8,
            "Adduktoren": 0.7,
            "Rückenstrecker": 0.7,
            "Beinbeuger": 0.5
          },
          "equipment": [
            "Langhantel"
          ],
          "beschreibung": "Breiterer Stand, stärkerer Fokus auf Gesäß und Adduktoren."
        }
      ]
    },
    {
      "übung_name": "Rückenstrecken (Hyperextensions)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Rückenstrecker": 1.0,
        "Gesäß": 0.3,
        "Beinbeuger": 0.2
      },
      "equipment": [
        "Rückenstrecker-Bank (45° oder horizontal)"
      ],
      "beschreibung": "Fokus auf den unteren Rücken (Rückenstrecker).",
      "variationen": [
        {
          "name": "Rückenstrecken (Fokus Gesäß)",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gesäß": 1.0,
            "Rückenstrecker": 0.4,
            "Beinbeuger": 0.3
          },
          "equipment": [
            "Rückenstrecker-Bank (45° oder horizontal)"
          ],
          "beschreibung": "Durch Abrunden des oberen Rückens wird der Fokus auf das Gesäß verlagert."
        }
      ]
    },
    {
      "übung_name": "Good Mornings (Guten-Morgen-Übung)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Beinbeuger": 1.0,
        "Rückenstrecker": 0.8,
        "Gesäß": 0.7
      },
      "equipment": [
        "Langhantel"
      ],
      "beschreibung": "Assistierende Übung mit starkem Fokus auf die hintere Kette."
    }
  ],
  "Schultern": [
    {
      "übung_name": "Überkopfdrücken (Langhantel)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Vordere Schulter": 1.0,
        "Seitliche Schulter": 0.6,
        "Trizeps": 0.7,
        "Oberer Trapezmuskel": 0.3,
        "Serratus anterior": 0.3
      },
      "equipment": [
        "Langhantel"
      ],
      "beschreibung": "Grundübung für die Schultermuskulatur.",
      "variationen": [
        {
          "name": "Überkopfdrücken (Kurzhantel)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Vordere Schulter": 1.0,
            "Seitliche Schulter": 0.7,
            "Trizeps": 0.6,
            "Oberer Trapezmuskel": 0.3,
            "Serratus anterior": 0.4
          },
          "equipment": [
            "Kurzhanteln"
          ],
          "beschreibung": "Ermöglicht natürlichere Bewegung und mehr Stabilisation."
        },
        {
          "name": "Arnold Press",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Vordere Schulter": 1.0,
            "Seitliche Schulter": 0.8,
            "Hintere Schulter (durch Rotation)": 0.3,
            "Trizeps": 0.5
          },
          "equipment": [
            "Kurzhanteln"
          ],
          "beschreibung": "Mit Rotation für Beanspruchung aller Schulteranteile."
        },
        {
          "name": "Multipresse Überkopfdrücken",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Vordere Schulter": 1.0,
            "Seitliche Schulter": 0.5,
            "Trizeps": 0.6
          },
          "equipment": [
            "Multipresse"
          ],
          "beschreibung": "Geführte Bewegung."
        }
      ]
    },
    {
      "übung_name": "Seitheben",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Seitliche Schulter": 1.0
      },
      "equipment": [
        "Kurzhanteln"
      ],
      "beschreibung": "Isolationsübung für die seitliche Schulter. Andere Muskeln minimal oder nur stabilisierend.",
      "variationen": [
        {
          "name": "Seitheben am Kabelzug",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Seitliche Schulter": 1.0
          },
          "equipment": [
            "Kabelzugturm",
            "Einzelgriff"
          ],
          "beschreibung": "Konstanter Widerstand."
        }
      ]
    },
    {
      "übung_name": "Frontheben",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Vordere Schulter": 1.0,
        "Obere Brust": 0.2
      },
      "equipment": [
        "Kurzhanteln",
        "Langhantelscheibe",
        "Kabelzug"
      ],
      "beschreibung": "Isolationsübung für die vordere Schulter."
    },
    {
      "übung_name": "Vorgebeugtes Seitheben (Reverse Flyes)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Hintere Schulter": 1.0,
        "Trapezmuskel (mittlere Anteile)": 0.4,
        "Rhomboiden": 0.3
      },
      "equipment": [
        "Kurzhanteln",
        "Kabelzug",
        "Butterfly-Reverse-Maschine"
      ],
      "beschreibung": "Isolationsübung für die hintere Schulter."
    },
    {
      "übung_name": "Aufrechtes Rudern",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Seitliche Schulter": 0.8,
        "Oberer Trapezmuskel": 0.5,
        "Bizeps": 0.2
      },
      "equipment": [
        "Langhantel",
        "SZ-Stange",
        "Kurzhanteln",
        "Kabelzug"
      ],
      "beschreibung": "Mit Isolationscharakter für seitliche Schulter/Trapez, hier mit breitem Griff für Schulterfokus.",
      "variationen": [
        {
          "name": "Aufrechtes Rudern (enger Griff, Fokus Trapez)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Oberer Trapezmuskel": 0.8,
            "Seitliche Schulter": 0.4,
            "Bizeps": 0.3
          },
          "equipment": [
            "Langhantel",
            "SZ-Stange",
            "Kurzhanteln",
            "Kabelzug"
          ],
          "beschreibung": "Enger Griff für stärkeren Fokus auf den Trapezmuskel."
        }
      ]
    },
    {
      "übung_name": "Gesichtszüge (Face Pulls)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Hintere Schulter": 1.0,
        "Mittlerer/Unterer Trapezmuskel": 0.7,
        "Rhomboiden": 0.6,
        "Rotatorenmanschette (Außenrotatoren)": 0.5
      },
      "equipment": [
        "Kabelzug mit Seilgriff oder Band"
      ],
      "beschreibung": "Fokussiert auf hintere Schulter und Rotatorenmanschette, wichtig für Schultergesundheit."
    },
    {
      "übung_name": "Schulterheben (Shrugs)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Oberer Trapezmuskel": 1.0
      },
      "equipment": [
        "Langhantel",
        "Kurzhanteln",
        "Multipresse",
        "Trap-Bar"
      ],
      "beschreibung": "Isolationsübung für den oberen Trapezmuskel."
    }
  ],
  "Bizeps": [
    {
      "übung_name": "Langhantel-Bizepscurls",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Bizeps": 1.0,
        "Brachialis": 0.6,
        "Brachioradialis": 0.3
      },
      "equipment": [
        "Langhantel",
        "SZ-Stange"
      ],
      "beschreibung": "Grundübung für den Bizepsaufbau."
    },
    {
      "übung_name": "Kurzhantel-Bizepscurls (supinierend)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Bizeps": 1.0,
        "Brachialis": 0.5,
        "Brachioradialis": 0.2
      },
      "equipment": [
        "Kurzhanteln"
      ],
      "beschreibung": "Mit Auswärtsdrehung (Supination) für volle Bizepsstimulation.",
      "variationen": [
        {
          "name": "Hammercurls",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Brachialis": 0.8,
            "Brachioradialis": 0.7,
            "Bizeps (langer Kopf)": 0.5
          },
          "equipment": [
            "Kurzhanteln"
          ],
          "beschreibung": "Neutralgriff, Fokus auf Brachialis und Brachioradialis."
        },
        {
          "name": "Konzentrationscurls",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Bizeps": 1.0,
            "Brachialis": 0.4
          },
          "equipment": [
            "Kurzhantel",
            "Bank"
          ],
          "beschreibung": "Sitzend, Arm am Oberschenkel abgestützt, für maximale Isolation."
        },
        {
          "name": "Schrägbank-Kurzhantelcurls",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Bizeps (langer Kopf)": 1.0,
            "Brachialis": 0.5
          },
          "equipment": [
            "Kurzhanteln",
            "Schrägbank"
          ],
          "beschreibung": "Für maximale Dehnung und Stimulation des langen Bizepskopfes."
        }
      ]
    },
    {
      "übung_name": "Scottcurls / Preacher Curls (Prediger-Curls)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Bizeps (kurzer Kopf)": 1.0,
        "Brachialis": 0.7
      },
      "equipment": [
        "Scottcurl-Bank",
        "SZ-Stange",
        "Kurzhanteln"
      ],
      "beschreibung": "Isoliert den Bizeps, besonders den kurzen Kopf."
    },
    {
      "übung_name": "Kabel-Bizepscurls",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Bizeps": 1.0,
        "Brachialis": 0.5
      },
      "equipment": [
        "Kabelzugturm",
        "Stange, Seilgriff oder Einzelgriffe"
      ],
      "beschreibung": "Konstanter Widerstand durch den Kabelzug."
    }
  ],
  "Trizeps": [
    {
      "übung_name": "Enges Bankdrücken",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Trizeps": 1.0,
        "Brust (innere Anteile)": 0.6,
        "Vordere Schulter": 0.3
      },
      "equipment": [
        "Langhantel",
        "Flachbank",
        "Multipresse"
      ],
      "beschreibung": "Grundübung für den Trizeps, assistierend für Brust und Schulter."
    },
    {
      "übung_name": "Dips (Trizeps-fokussiert)",
      "übungstyp": "Verbundübung (Körpergewicht)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Trizeps": 1.0,
        "Vordere Schulter": 0.4,
        "Brust (untere Anteile)": 0.4
      },
      "equipment": [
        "Dip-Barren",
        "Bank (für Bank-Dips)"
      ],
      "beschreibung": "Oberkörper aufrecht für stärkeren Trizepsfokus."
    },
    {
      "übung_name": "Trizepsdrücken am Kabelzug (Stange/V-Griff)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Trizeps (lateraler & medialer Kopf)": 1.0,
        "Trizeps (langer Kopf)": 0.3
      },
      "equipment": [
        "Kabelzugturm",
        "Stange oder V-Griff"
      ],
      "beschreibung": "Isoliert den lateralen und medialen Kopf des Trizeps.",
      "variationen": [
        {
          "name": "Trizepsdrücken am Kabelzug (Seilgriff)",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Trizeps (lateraler Kopf)": 1.0,
            "Trizeps (medialer Kopf)": 0.8,
            "Trizeps (langer Kopf)": 0.4
          },
          "equipment": [
            "Kabelzugturm",
            "Seilgriff"
          ],
          "beschreibung": "Stärkerer Fokus auf den lateralen Kopf und erlaubt mehr Ellenbogenbewegung."
        }
      ]
    },
    {
      "übung_name": "Stirndrücken (Liegend / French Press)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Trizeps (langer & medialer Kopf)": 1.0,
        "Trizeps (lateraler Kopf)": 0.7
      },
      "equipment": [
        "Langhantel",
        "SZ-Stange",
        "Kurzhanteln",
        "Bank"
      ],
      "beschreibung": "Effektive Übung für alle Trizepsköpfe, besonders den langen und medialen.",
      "variationen": [
        {
          "name": "Überkopf-Trizepsdrücken",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Trizeps (langer Kopf)": 1.0,
            "Trizeps (medialer/lateraler Kopf)": 0.6
          },
          "equipment": [
            "Kurzhantel",
            "SZ-Stange",
            "Kabelzug"
          ],
          "beschreibung": "Starker Fokus auf den langen Trizepskopf durch die Überkopfposition."
        }
      ]
    },
    {
      "übung_name": "Trizeps-Kickbacks (Kurzhantel)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Trizeps (lateraler Kopf)": 1.0
      },
      "equipment": [
        "Kurzhanteln"
      ],
      "beschreibung": "Isoliert den lateralen Kopf des Trizeps. Andere Köpfe weniger stark beteiligt."
    }
  ],
  "Beine": [
    {
      "übung_name": "Kniebeugen (Langhantel, High Bar)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Quadrizeps": 1.0,
        "Gesäß": 0.7,
        "Adduktoren": 0.4,
        "Rückenstrecker (isometrisch)": 0.3,
        "Beinbeuger (synergistisch)": 0.2
      },
      "equipment": [
        "Langhantel",
        "Kniebeugenständer"
      ],
      "beschreibung": "Grundübung für die Beine, Fokus auf Quadrizeps.",
      "variationen": [
        {
          "name": "Kniebeugen (Langhantel, Low Bar)",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gesäß": 1.0,
            "Quadrizeps": 0.8,
            "Beinbeuger": 0.5,
            "Adduktoren": 0.4,
            "Rückenstrecker (isometrisch)": 0.4
          },
          "equipment": [
            "Langhantel",
            "Kniebeugenständer"
          ],
          "beschreibung": "Stärkerer Fokus auf die hintere Kette (Gesäß, Beinbeuger)."
        },
        {
          "name": "Frontkniebeugen",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Quadrizeps": 1.0,
            "Gesäß": 0.5,
            "Oberer Rücken/Rumpf (Anti-Flexion)": 0.4,
            "Adduktoren": 0.3
          },
          "equipment": [
            "Langhantel",
            "Kniebeugenständer"
          ],
          "beschreibung": "Starker Fokus auf Quadrizeps und Rumpfstabilität."
        },
        {
          "name": "Bulgarische Split-Kniebeugen",
          "übungstyp": "Verbundübung (unilateral)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Quadrizeps (Standbein)": 1.0,
            "Gesäß (Standbein)": 0.9,
            "Adduktoren": 0.4
          },
          "equipment": [
            "Kurzhanteln oder Langhantel",
            "Bank"
          ],
          "beschreibung": "Unilaterale Übung, stark für Quadrizeps und Gesäß des Standbeins."
        },
        {
          "name": "Multipresse Kniebeugen",
          "übungstyp": "Verbundübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Quadrizeps": 1.0,
            "Gesäß": 0.6
          },
          "equipment": [
            "Multipresse"
          ],
          "beschreibung": "Geführte Bewegung, verschiedene Fußpositionen möglich."
        }
      ]
    },
    {
      "übung_name": "Beinpresse",
      "übungstyp": "Verbundübung (maschinenbasiert)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Quadrizeps": 1.0,
        "Gesäß": 0.6,
        "Adduktoren": 0.3,
        "Beinbeuger": 0.2
      },
      "equipment": [
        "Beinpresse-Maschine"
      ],
      "beschreibung": "Grundübung für die Beine an der Maschine, hier mit mittlerer Fußstellung.",
      "variationen": [
        {
          "name": "Beinpresse (hohe/breite Fußstellung)",
          "übungstyp": "Verbundübung (maschinenbasiert)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gesäß": 1.0,
            "Beinbeuger": 0.7,
            "Adduktoren": 0.5,
            "Quadrizeps": 0.5
          },
          "equipment": [
            "Beinpresse-Maschine"
          ],
          "beschreibung": "Stärkerer Fokus auf Gesäß und Beinbeuger."
        }
      ]
    },
    {
      "übung_name": "Beinstrecker",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Quadrizeps": 1.0
      },
      "equipment": [
        "Beinstrecker-Maschine"
      ],
      "beschreibung": "Isolationsübung für den Quadrizeps."
    },
    {
      "übung_name": "Ausfallschritte",
      "übungstyp": "Verbundübung (unilateral)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Quadrizeps (Standbein)": 1.0,
        "Gesäß (Standbein)": 0.8,
        "Beinbeuger (synergistisch)": 0.3,
        "Adduktoren (Stabilisation)": 0.3
      },
      "equipment": [
        "Eigengewicht",
        "Kurzhanteln",
        "Langhantel"
      ],
      "beschreibung": "Unilaterale Übung für die gesamte Beinmuskulatur."
    },
    {
      "übung_name": "Rumänisches Kreuzheben",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Beinbeuger": 1.0,
        "Gesäß": 0.8,
        "Rückenstrecker (isometrisch/dynamisch)": 0.7
      },
      "equipment": [
        "Langhantel",
        "Kurzhanteln",
        "Multipresse"
      ],
      "beschreibung": "Fokus auf die hintere Oberschenkelmuskulatur und das Gesäß."
    },
    {
      "übung_name": "Kreuzheben mit gestreckten Beinen",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Beinbeuger": 1.0,
        "Gesäß (obere Anteile)": 0.5,
        "Rückenstrecker": 0.6
      },
      "equipment": [
        "Langhantel",
        "Kurzhanteln"
      ],
      "beschreibung": "Starker Fokus auf Dehnung der Beinbeuger."
    },
    {
      "übung_name": "Beinbeuger (Liegend/Sitzend)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Beinbeuger": 1.0
      },
      "equipment": [
        "Beinbeuger-Maschine"
      ],
      "beschreibung": "Isolationsübung für die Beinbeuger.",
      "variationen": [
        {
          "name": "Nordische Beincurls / Glute-Ham Raises (GHR)",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Beinbeuger": 1.0,
            "Gesäß": 0.4,
            "Rückenstrecker": 0.3
          },
          "equipment": [
            "GHR-Maschine oder Fixierung für Füße"
          ],
          "beschreibung": "Sehr anspruchsvolle Körpergewichtsübung für die Beinbeuger."
        }
      ]
    },
    {
      "übung_name": "Beckenheben (Glute Bridges) / Hüftstoßen (Hip Thrusts)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gesäß": 1.0,
        "Beinbeuger": 0.4,
        "Rückenstrecker (stabilisierend)": 0.2
      },
      "equipment": [
        "Eigengewicht",
        "Langhantel",
        "Bank"
      ],
      "beschreibung": "Fokussierte Übung für das Gesäß."
    },
    {
      "übung_name": "Kettlebell-Schwünge",
      "übungstyp": "Verbundübung (explosiv)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gesäß": 1.0,
        "Beinbeuger": 0.7,
        "Rückenstrecker": 0.6,
        "Rumpf (Anti-Flexion)": 0.5
      },
      "equipment": [
        "Kettlebell"
      ],
      "beschreibung": "Explosive Ganzkörperübung mit Fokus auf die Hüftextension."
    },
    {
      "übung_name": "Abduktorenmaschine",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gesäß (Medius/Minimus)": 1.0
      },
      "equipment": [
        "Abduktorenmaschine"
      ],
      "beschreibung": "Isoliert die äußere Hüftmuskulatur."
    },
    {
      "übung_name": "Adduktorenmaschine",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Adduktoren": 1.0
      },
      "equipment": [
        "Adduktorenmaschine"
      ],
      "beschreibung": "Isoliert die innere Oberschenkelmuskulatur."
    },
    {
      "übung_name": "Wadenheben stehend",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gastrocnemius": 1.0,
        "Soleus": 0.2
      },
      "equipment": [
        "Wadenhebe-Maschine stehend",
        "Multipresse",
        "Langhantel"
      ],
      "beschreibung": "Isoliert den zweiköpfigen Wadenmuskel."
    },
    {
      "übung_name": "Wadenheben sitzend",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Soleus": 1.0
      },
      "equipment": [
        "Wadenhebe-Maschine sitzend"
      ],
      "beschreibung": "Isoliert den Schollenmuskel."
    }
  ],
  "Bauch_Rumpf": [
    {
      "übung_name": "Bauchpressen (Crunches)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gerade Bauchmuskulatur (obere Anteile)": 1.0
      },
      "equipment": [
        "Eigengewicht",
        "Matte"
      ],
      "beschreibung": "Grundübung für die oberen Bauchmuskeln."
    },
    {
      "übung_name": "Beinheben (Liegend)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gerade Bauchmuskulatur (untere Anteile)": 0.8,
        "Hüftbeuger": 0.7,
        "Schräge Bauchmuskeln (stabilisierend)": 0.2
      },
      "equipment": [
        "Eigengewicht",
        "Matte"
      ],
      "beschreibung": "Fokus auf untere Bauchmuskeln, Hüftbeuger oft stark beteiligt.",
      "variationen": [
        {
          "name": "Hängendes Beinheben",
          "übungstyp": "Isolationsübung",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gerade Bauchmuskulatur (untere Anteile)": 1.0,
            "Hüftbeuger": 0.6
          },
          "equipment": [
            "Klimmzugstange",
            "Beinhebe-Station"
          ],
          "beschreibung": "Anspruchsvollere Variante für die unteren Bauchmuskeln."
        },
        {
          "name": "Dragon Flags",
          "übungstyp": "Verbundübung (Körpergewicht)",
          "gewichtete_muskelbeteiligung_pro_satz": {
            "Gerade Bauchmuskulatur": 1.0,
            "Hüftbeuger": 0.5,
            "Latissimus (exzentrisch)": 0.4
          },
          "equipment": [
            "Stabile Bank oder Fixierung"
          ],
          "beschreibung": "Sehr anspruchsvolle Ganzkörper-Rumpfübung."
        }
      ]
    },
    {
      "übung_name": "Unterarmstütz (Plank)",
      "übungstyp": "Verbundübung (isometrisch)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Quere Bauchmuskulatur (Transversus)": 0.5,
        "Gerade Bauchmuskulatur": 0.3,
        "Rückenstrecker": 0.3,
        "Schräge Bauchmuskeln": 0.3
      },
      "equipment": [
        "Eigengewicht",
        "Matte"
      ],
      "beschreibung": "Isometrische Übung für den gesamten Rumpf. Hypertrophie-Fokus gering, da isometrisch und oft lange Dauer. Quere Bauchmuskulatur für Stabilisation."
    },
    {
      "übung_name": "Russische Drehungen (Russian Twists)",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Schräge Bauchmuskeln": 1.0,
        "Gerade Bauchmuskulatur": 0.4
      },
      "equipment": [
        "Eigengewicht",
        "Medizinball",
        "Kurzhantel"
      ],
      "beschreibung": "Fokus auf Rotation und schräge Bauchmuskeln."
    },
    {
      "übung_name": "Holzfäller-Übung (Wood Chops / Kabelrotationen)",
      "übungstyp": "Verbundübung (funktional)",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Schräge Bauchmuskeln": 1.0,
        "Quere Bauchmuskulatur": 0.5,
        "Gerade Bauchmuskulatur (stabilisierend)": 0.3
      },
      "equipment": [
        "Kabelzug",
        "Medizinball",
        "Widerstandsband"
      ],
      "beschreibung": "Funktionale Übung für Rumpfrotation und -stabilität."
    },
    {
      "übung_name": "Bauchroller-Ausrollen (Ab Wheel Rollouts)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Gerade Bauchmuskulatur": 1.0,
        "Quere Bauchmuskulatur": 0.7,
        "Latissimus dorsi (exzentrisch)": 0.5,
        "Schultern (stabilisierend)": 0.3
      },
      "equipment": [
        "Bauchroller (Ab Wheel)"
      ],
      "beschreibung": "Sehr anspruchsvolle Übung für den gesamten vorderen Rumpf."
    },
    {
      "übung_name": "Hängende Scheibenwischer (Hanging Windshield Wipers)",
      "übungstyp": "Verbundübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Schräge Bauchmuskeln": 1.0,
        "Gerade Bauchmuskulatur (untere Anteile)": 0.8,
        "Hüftbeuger": 0.6
      },
      "equipment": [
        "Klimmzugstange"
      ],
      "beschreibung": "Sehr anspruchsvolle Übung für schräge und untere Bauchmuskeln."
    },
    {
      "übung_name": "Seitbeugen",
      "übungstyp": "Isolationsübung",
      "gewichtete_muskelbeteiligung_pro_satz": {
        "Schräge Bauchmuskeln (ipsilateral)": 1.0,
        "Quadratus Lumborum (ipsilateral)": 0.7
      },
      "equipment": [
        "Kurzhantel",
        "Kabelzug"
      ],
      "beschreibung": "Isoliert die seitliche Rumpfmuskulatur."
    }
  ]
};

// Hilfsfunktion um die detaillierte Struktur in das flache Format zu konvertieren
export const convertToFlatExerciseList = (detailedDatabase) => {
  const exercises = [];
  
  Object.keys(detailedDatabase).forEach(muscleGroup => {
    detailedDatabase[muscleGroup].forEach(exercise => {
      // Hauptübung hinzufügen
      const mainExercise = {
        id: generateId(exercise.übung_name),
        name: exercise.übung_name,
        muscleGroups: [muscleGroup],
        equipment: exercise.equipment || [],
        übungstyp: exercise.übungstyp,
        gewichtete_muskelbeteiligung_pro_satz: exercise.gewichtete_muskelbeteiligung_pro_satz,
        beschreibung: exercise.beschreibung
      };
      exercises.push(mainExercise);
      
      // Variationen hinzufügen
      if (exercise.variationen) {
        exercise.variationen.forEach(variation => {
          const variationExercise = {
            id: generateId(variation.name, true, exercise.übung_name),
            name: variation.name,
            muscleGroups: [muscleGroup],
            equipment: variation.equipment || [],
            übungstyp: variation.übungstyp,
            gewichtete_muskelbeteiligung_pro_satz: variation.gewichtete_muskelbeteiligung_pro_satz,
            beschreibung: variation.beschreibung,
            isVariation: true,
            parentExercise: exercise.übung_name
          };
          exercises.push(variationExercise);
        });
      }
    });
  });
  
  return exercises;
};

// Hilfsfunktion zur ID-Generierung - deterministic based on exercise name
const generateId = (exerciseName, isVariation = false, parentName = '') => {
  // Create a deterministic ID based on the exercise name
  // This ensures the same exercise always gets the same ID
  const baseString = isVariation ? `${parentName}-${exerciseName}` : exerciseName;
  
  // Simple hash function to create consistent IDs
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a positive base36 string and ensure minimum length
  const hashString = Math.abs(hash).toString(36);
  return `ex_${hashString}_${baseString.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20)}`;
}; 