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
- **GitHub:** https://github.com/jonesjitter/maxesis

## Ports (ekstern)

- **22** - SSH (kun key auth)
- **80** - HTTP (redirect til HTTPS)
- **443** - HTTPS (nginx → localhost:3000)

## Filer

- `Dockerfile` - Multi-stage build for Next.js
- `docker-compose.yml` - Container orchestration
- `next.config.ts` - Next.js config (standalone output)

---

## Server Sikkerhed

### Nuværende status (5. feb 2026) ✓ SIKRET
- UFW firewall: **AKTIV** (kun port 22, 80, 443)
- Password login: **DEAKTIVERET** (kun SSH key)
- Fail2ban: **AKTIV** (Bahnhof whitelistet)
- Port 3000: **KUN LOCALHOST** (via nginx)
- Kernel: 6.8.0-94-generic

### Sikkerhedsplan - UDEN at blive lukket ude

**KRITISK: Følg trinene i rækkefølge. Hold altid en SSH-session åben som backup.**

#### Fase 1: Forberedelse (ingen risiko)
```bash
# 1. Åbn TO terminaler med SSH til serveren
ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151

# 2. I terminal 1: Hold denne åben som backup hele tiden
# 3. I terminal 2: Udfør alle kommandoer nedenfor
```

#### Fase 2: Opdatering (lav risiko)
```bash
# Installer sikkerhedsopdateringer
apt update && apt upgrade -y
```

#### Fase 3: Fail2ban med Bahnhof whitelist (ingen risiko)
```bash
# Installer brute-force beskyttelse
apt install fail2ban -y

# Opret lokal config med Bahnhof whitelist
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# Whitelist Bahnhof IP-range (98.128.0.0/17 dækker na.cust.bahnhof.se)
ignoreip = 127.0.0.1/8 ::1 98.128.0.0/17

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
bantime = 3600
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Verificer whitelist er aktiv
fail2ban-client get sshd ignoreip
```

#### Fase 4: Fix Docker port binding (før firewall)
```bash
# Docker bypasser UFW - så vi binder til localhost i stedet
cd /var/www/maxesis

# Ændr "3000:3000" til "127.0.0.1:3000:3000" i docker-compose.yml
sed -i 's/"3000:3000"/"127.0.0.1:3000:3000"/' docker-compose.yml

# Verificer ændringen
grep -A1 'ports:' docker-compose.yml

# Genstart containers
docker-compose down && docker-compose up -d

# Test at port 3000 IKKE er tilgængelig eksternt (fra lokal maskine)
curl -s --connect-timeout 3 http://46.224.182.151:3000 && echo "FEJL: Port stadig åben" || echo "OK: Port lukket"

# Test at nginx stadig virker
curl -s -o /dev/null -w "%{http_code}" https://www.maxesis.com
# Skal returnere 200
```

#### Fase 5: Firewall (HØJTRISIKO - følg nøje)
```bash
# 1. Konfigurer regler INDEN aktivering
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# 2. VIGTIGT: Dobbelttjek SSH er tilladt
ufw show added

# 3. Aktiver med --force (undgår prompt)
ufw --force enable

# 4. STRAKS: Test SSH i backup-terminal
# Åbn NY terminal og test: ssh -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151
# HVIS det fejler: I backup-terminal kør: ufw disable

# 5. Verificer status
ufw status verbose
```

#### Fase 6: SSH hardening (HØJRISIKO)
```bash
# 0. FØRST: Verificer at key login virker (i NY terminal)
ssh -o PreferredAuthentications=publickey -i ~/.ssh/"Hetzner - Maxexis" root@46.224.182.151 "echo 'Key auth virker!'"
# SKAL returnere "Key auth virker!" - STOP hvis det fejler!

# 1. Tag backup af config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 2. Deaktiver password login
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config

# 3. Verificer ændringen
grep PasswordAuthentication /etc/ssh/sshd_config

# 4. Test config INDEN restart
sshd -t
# Skal returnere uden fejl

# 5. Genstart SSH (Ubuntu bruger 'ssh' ikke 'sshd')
systemctl restart ssh

# 6. STRAKS: Test SSH i NY terminal (IKKE backup-terminal)
# HVIS det fejler: I backup-terminal kør:
#   cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
#   systemctl restart ssh
```

#### Fase 7: Verificering
```bash
# Tjek alt virker
ufw status
systemctl status fail2ban
systemctl status ssh

# Test at password login er blokeret (skal fejle)
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no root@46.224.182.151
```

### Nødprocedure hvis låst ude
1. **Hetzner Console:** Log ind på Hetzner Cloud → Server → Console (browser-baseret)
2. **Rollback firewall:** `ufw disable`
3. **Rollback SSH:** `cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config && systemctl restart ssh`

### Efter sikring
- Port 3000 er nu blokeret eksternt (kun via nginx/443)
- Password brute-force er beskyttet via fail2ban
- Kun SSH key login tilladt
- Bahnhof IPs (98.128.0.0/17) er whitelistet i fail2ban

### Bahnhof whitelist info
- **Range:** 98.128.0.0/17 (dækker *.na.cust.bahnhof.se)
- **Din IP (feb 2026):** 98.128.181.58
- Bahnhof har dynamiske IPs, men de ligger typisk inden for samme range

```bash
# Tjek din nuværende IP
curl -s ifconfig.me

# Hvis IP skifter til anden range, opdater whitelist:
nano /etc/fail2ban/jail.local
systemctl restart fail2ban

# Se hvem der er banned
fail2ban-client status sshd

# Unban en IP manuelt
fail2ban-client set sshd unbanip <IP>
```
