# Claude Code Instructions

## Projekt
MAXESIS - Streamer website for maxesis09

## Vigtige filer
- `devops.md` - Server info, deployment, SSH, **sikkerhedsplan**
- `.env.local` - Lokale environment variabler (TWITCH_CLIENT_ID, etc.)
- `.env.production` - Production environment variabler

## Server
- **IP:** 46.224.182.151
- **SSH:** `ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151`
- **Deploy:** Se `devops.md` for one-liner deploy kommando

## Sikkerhed
**VIGTIGT:** Før der laves ændringer til server-sikkerhed (firewall, SSH config), følg planen i `devops.md` under "Server Sikkerhed" for at undgå at blive lukket ude.

## API'er
- Twitch API bruges til: status, clips, schedule, videos
- NextAuth bruges til Twitch login (til ideas voting)

## Konventioner
- Dansk UI tekst
- Tailwind CSS 4
- Accent farver: `#00ff88` (grøn), `#9146ff` (Twitch lilla), `#ff0080` (pink)
