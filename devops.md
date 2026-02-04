# MAXESIS DevOps

## Stack

- **Framework:** Next.js 16.1.6
- **Runtime:** Node.js 20 (Alpine)
- **Styling:** Tailwind CSS 4
- **3D/Animation:** React Three Fiber, Three.js, Framer Motion, GSAP
- **Containerization:** Docker + Docker Compose

## Server

- **Provider:** Hetzner
- **IP:** 46.224.182.151
- **OS:** Ubuntu/Debian
- **Web Directory:** `/var/www/maxesis`

## SSH Access

```bash
ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151
```

## Deployment

### Quick Deploy (fra lokal maskine)

```bash
# 1. Commit og push ændringer
cd ~/maxesis
git add -A
git commit -m "Din commit besked"
git push origin main

# 2. SSH ind og deploy
ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151 "cd /var/www/maxesis && git pull origin main && docker-compose down && docker-compose build && docker-compose up -d"
```

### One-liner Deploy

```bash
cd ~/maxesis && git add -A && git commit -m "Update" && git push origin main && ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151 "cd /var/www/maxesis && git pull origin main && docker-compose down && docker-compose build && docker-compose up -d"
```

## Docker Commands (på server)

```bash
# Se kørende containers
docker ps

# Se logs
docker-compose logs -f

# Genstart
docker-compose restart

# Stop
docker-compose down

# Rebuild og start (bruger layer caching - hurtigt)
docker-compose build && docker-compose up -d

# Fuld rebuild uden cache (kun ved større ændringer/problemer)
docker-compose build --no-cache && docker-compose up -d
```

## URLs

- **Production:** https://www.maxesis.com
- **Direct IP:** http://46.224.182.151:3000
- **GitHub:** https://github.com/jonesjitter/maxesis

## Ports

- **3000** - Next.js app (exposed via Docker)

## Filer

- `Dockerfile` - Multi-stage build for Next.js
- `docker-compose.yml` - Container orchestration
- `next.config.ts` - Next.js config (standalone output)
