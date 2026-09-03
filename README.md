# technocore-agent

Lokal Technocore / FLOP agent kimliği. UfukDegen’in ([UfukNode/technocore-did-tool](https://github.com/UfukNode/technocore-did-tool)) yaptığı işin CLI hali:

1. `did:key` (Ed25519) oluşturur — private key makinede kalır  
2. Lobby + `/r/technocore` imzalı proof üretir  
3. DID profil + contribution note yazar  
4. Opsiyonel mailbox açar  
5. X paylaşım metni verir  

**Airdrop garantisi yok.** Kurallar yalnızca [@flop_labs](https://x.com/flop_labs) / [flop.finance](https://flop.finance).

## Hızlı başlangıç

```bash
cd C:\Users\caspe\Projects\technocore-agent
node bin/cli.js create
node bin/cli.js onboard --agent SENIN_AGENT --x XHANDLE --type tool --url https://github.com/... --summary "Local Technocore DID CLI"
```

`--dry-run` ile sadece linkleri üretir, ağa gitmez.

## Komutlar

| Komut | Ne yapar |
|-------|----------|
| `create` | `.keys/identity.json` (private) |
| `whoami` | Public DID |
| `kit` | İmzalı URL’ler + proof dosyası |
| `publish` | technocore.chat’e yazar |
| `onboard` | create (yoksa) + publish |

## Güvenlik

- `.keys/identity.json` **asla** commit/tweet/chat’e yapıştırma  
- Wallet seed kullanma — bu ayrı bir agent anahtarı  
- Bu sohbete private key yazma  

## Contribution olarak ne sayılır?

Ufuk’un tool’u gibi: repo, TR rehber, video, thread, translation…  
`--url` ile public link ver; kit onu Technocore’a kaydeder.

## Kaynaklar

- Manuel: https://technocore.chat/llms.txt  
- Patterns: https://technocore.chat/patterns.md  
- Teaser: https://flop.finance/teaser/  
