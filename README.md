# NT Inventar Frontend

Frontend für das Inventar des [Nächtlichen Theater e.V.](https://naechtlichestheater.de/)

## Features

- Auflistung des Inventars des Nächtlichen Theater
- Masken zum Anlegen, Aktualisieren und Löschen von Inventareinträgen
- Userprofile für jeden Anwender inklusive Profilbild(-upload)
- Mailversand bei Registrierung, Passwortzurücksetzung etc.
- Tabellen-Export als .csv-Datei
- Login via Discord, Twitch und Github möglich (OAuth)
- Bereinigte Print-Ansicht um die verschiedenen Tabellen zu drucken
- Theme-Selector für angemeldete User

## Roadmap

- Bestellmöglichkeit von Kisten & Gegenständen für die Spielleitung

## Umgebungsvariablen

Um das Projekt zu starten muss die folgende Umgebungsvariable gesetzt werden.

`PUBLIC_PB_BASE_URL` (URL zur [pocketbase](https://pocketbase.io)-Instanz)

## Lokal starten

Projekt klonen

```bash
  git clone https://github.com/ItsNothingPersonal/nt-inventar-frontend.git
```

Ins Verzeichnis wechseln

```bash
  cd nt-inventar-frontend
```

Abhängigkeiten installieren

```bash
  pnpm install
```

Server starten

```bash
  pnpm run dev
```

## Unterstützung

Hilfe wird immer gern gesehen! Einfach das Projekt forken, Änderungen einfügen und dann einen Pullrequest stellen!

Bitte haltet euch dabei an den [Verhaltenscodex](CODE_OF_CONDUCT.md).

## Acknowledgements

- [svelte](https://svelte.dev/)
- [sveltekit](https://kit.svelte.dev/)
- [pocketbase](https://pocketbase.io/)
- [tailwindcss](https://tailwindcss.com/)
- [daiysUI](https://daisyui.com/)

## Author
[Sebastian Tremmel](https://www.github.com/ItsNothingPersonal)

## License

[MIT](https://choosealicense.com/licenses/mit/)
