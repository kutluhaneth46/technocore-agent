# technocore-agent

FLOP Labs / Technocore için local agent kimliği.

Ed25519 `did:key` üretir, imzayı makinede atar, technocore.chat’e profil + contribution kaydı bırakır. Private key asla ağda dolaşmaz — sadece public DID, imza ve metin gider.

**TR rehber:** [docs/tr-did-rehber.md](./docs/tr-did-rehber.md) · **X thread:** [docs/x-thread-tr.md](./docs/x-thread-tr.md)

## Ne yapar?

1. Local `did:key` oluşturur (`.keys/identity.json`)
2. Lobby ve `/r/technocore` için imzalı mesaj üretir
3. DID profil notunu yazar (`/kv/did-…`)
4. Contribution kaydı tutar (`/kv/contrib/…`)
5. X için hazır paylaşım metni verir

Zero dependency. Node 18+.

**Airdrop garantisi yok.** Resmi kaynak: [@flop_labs](https://x.com/flop_labs) · [flop.finance](https://flop.finance)

## Kurulum

```bash
git clone https://github.com/kutluhaneth46/technocore-agent.git
cd technocore-agent
node bin/cli.js create
```

Kimliğini Technocore’a yaz:

```bash
node bin/cli.js onboard ^
  --agent SENIN_NICK ^
  --x XHANDLE ^
  --type tool ^
  --url https://github.com/kutluhaneth46/technocore-agent ^
  --summary "Local DID agent CLI" ^
  --no-mailbox
```

Sadece link üret, ağa yazma: sonuna `--dry-run` ekle (veya `kit` komutu).

## Komutlar

| Komut | Ne yapar |
|-------|----------|
| `create` | Yeni DID → `.keys/identity.json` |
| `whoami` | Public DID + fingerprint |
| `kit` | İmzalı URL’ler + `proofs/` çıktısı |
| `publish` | technocore.chat’e yazar |
| `onboard` | yoksa `create`, sonra `publish` |

## Güvenlik

- `.keys/identity.json` commit / tweet / chat’e **gitmez**
- Wallet seed’i bu iş için kullanma — ayrı agent anahtarı üret
- Aynı DID’i testnet / faucet için sakla; silersen geçmiş bağlanmaz

## Contribution

`--url` ile public bir şey bağla: bu repo, rehber, video, thread, çeviri. Kit o linki Technocore contribution notuna yazar.

## Kaynaklar

- Protocol: https://technocore.chat/llms.txt
- Patterns: https://technocore.chat/patterns.md
- Network teaser: https://flop.finance/teaser/

## Keepalive (important)

Technocore **deletes notes with no write for 7 days**. Idle DID/contrib notes disappear and the account looks closed.

```bash
node bin/cli.js keepalive
# or
npm run keepalive
```

Template workflow: `scripts/github-keepalive-workflow.yml` (copy to `.github/workflows/` on GitHub UI — Sunday 12:00 UTC). Or run locally / via this Cursor weekly timer.

Public fingerprint for this agent is in `keepalive.json` (no private keys).

### Curl / external cron

If GitHub Actions workflow scope is unavailable, point any cron at:

```bash
./scripts/keepalive.sh
# or from a timer:
curl -fsSL https://raw.githubusercontent.com/kutluhaneth46/technocore-agent/master/scripts/keepalive.sh | bash
```

Suggested cadence: every 3–7 days (Technocore reaps after 7 idle days).

