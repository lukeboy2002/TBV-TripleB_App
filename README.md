# TripleB-app

De mobiele app (iPhone en Android) voor de spelers van TBV TripleB. Gebouwd met
[Expo](https://expo.dev) en React Native. De app praat met de API van de site
[tbv-tripleb.nl](https://tbv-tripleb.nl) (repo `TBV-TripleB`, map `routes/api.php`),
dus alles wat je in de app doet staat meteen op de site.

## Zelf draaien

Je hebt nodig: **Node.js (LTS)** op je computer en de app **Expo Go** op je telefoon.

```bash
cd ~/Herd
git clone https://github.com/lukeboy2002/TBV-TripleB_App.git
cd TBV-TripleB_App
npm install
cp .env.example .env      # en zet het juiste API-adres erin
npx expo start
```

Scan de QR-code met je camera (iPhone) of met Expo Go (Android). De app opent in Expo Go.
Elke keer dat je een bestand opslaat, ververst de app op je telefoon vanzelf.

### Tegen je lokale Herd-site testen

Je telefoon kan `tbv-tripleb.test` niet bereiken, dat adres bestaat alleen op je Mac.
Twee manieren:

1. `herd share` in de map van de site. Je krijgt een https-link; zet die in `.env`
   als `EXPO_PUBLIC_API_URL=https://...link.../api`.
2. Of gewoon tegen de live site testen (`https://tbv-tripleb.nl/api`), zodra de API daar staat.

Na het aanpassen van `.env` moet je `npx expo start` opnieuw starten.

## Handige commando's

| Commando | Wat het doet |
|---|---|
| `npx expo start` | Ontwikkelserver starten |
| `npm run typecheck` | TypeScript controleren (vangt typfouten) |
| `npm run lint` | Code-stijl controleren |
| `npx expo install <pakket>` | Pakket toevoegen in een versie die bij Expo SDK 58 past (gebruik dit in plaats van `npm install <pakket>`) |

## Hoe de code in elkaar zit

```
src/
  app/                    ← elk bestand is een scherm (Expo Router)
    _layout.tsx           ← buitenste laag: cache, login-status, inlog-bewaking
    login.tsx             ← inlogscherm
    (tabs)/               ← de tabbladen onderin (haakjes = niet in de URL)
      _layout.tsx         ← de tabbalk zelf
      index.tsx           ← Stand
      games/index.tsx     ← Uitslagen
      games/[id].tsx      ← één wedstrijd ([id] = parameter, zoals {game} in Laravel)
      live.tsx            ← wedstrijd starten, spelers af, bekerfoto
      agenda/index.tsx    ← Agenda
      agenda/[slug].tsx   ← één event
      profile.tsx         ← Mijn cijfers en uitloggen
  components/             ← herbruikbare stukjes (zoals Blade-componenten)
  constants/theme.ts      ← kleuren en afstanden (licht en donker)
  lib/
    api.ts                ← fetch naar Laravel, met token en foutafhandeling
    auth.tsx              ← inloggen, token in de kluis van de telefoon
    queries.ts            ← alle data-verzoeken (TanStack Query)
    types.ts              ← TypeScript-types die passen op de Laravel Resources
    config.ts             ← het API-adres
```

### Vergelijking met Laravel

| Laravel | Deze app |
|---|---|
| `routes/web.php` | de bestanden in `src/app/` |
| `auth`-middleware | `Stack.Protected` in `src/app/_layout.tsx` |
| Blade-component | React-component in `src/components/` |
| Livewire-property + `wire:model` | `useState` + `onChangeText` |
| `auth()->user()` | `useAuth().user` |
| Eloquent-query | `useQuery` in `src/lib/queries.ts` |
| Tailwind-classes | `StyleSheet.create({...})` |

## Naar de telefoons van de spelers

Later, met EAS Build (`npx eas-cli@latest build`): voor iPhone via TestFlight
(Apple Developer-account nodig), voor Android via Google Play internal testing
of een los installatiebestand.
