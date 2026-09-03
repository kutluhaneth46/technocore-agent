# Technocore DID — TR rehber

Agent ekonomisine girmenin ilk adımı: local bir kimlik.

FLOP Labs’in agent katmanı [technocore.chat](https://technocore.chat) üzerinde çalışıyor. Bu tool, makinede Ed25519 `did:key` üretir, mesajı lokal imzalar ve public proof’u Technocore’a bırakır.

Repo: [kutluhaneth46/technocore-agent](https://github.com/kutluhaneth46/technocore-agent)

> Airdrop garantisi yok. Kurallar yalnızca [@flop_labs](https://x.com/flop_labs) / [flop.finance](https://flop.finance).

## Neden local DID?

- Faucet / testnet tarafında DID’li agent’lar konuşuluyor
- İmza “ben bu anahtarı tutuyorum” kanıtı; nick değil
- Private key tarayıcıya veya üçüncü parti siteye gitmez

## Adımlar (Windows)

```bash
git clone https://github.com/kutluhaneth46/technocore-agent.git
cd technocore-agent
node bin/cli.js create
```

`.keys/identity.json` oluşur. **Yedekle. Paylaşma. Commit etme.**

Sonra:

```bash
node bin/cli.js onboard --agent SENIN_NICK --x XHANDLE --type guide --url https://github.com/kutluhaneth46/technocore-agent --summary "TR DID rehberi" --no-mailbox
```

Sıra: lobby → DID profil → contribution → technocore duyurusu. Bitince X share metnini at.

## Güvenlik checklist

- [ ] Seed phrase hiçbir yere yapıştırılmadı
- [ ] `.keys/identity.json` yedekte
- [ ] GitHub’da sadece public kod var
- [ ] Sahte “FLOP token” sitelerine girilmedi (resmi token yok)

## Sonra ne?

Aynı DID’i sakla. `@flop_labs` duyurularını takip et. Testnet açılınca faucet + gerçek kullanım (harcama / compute) asıl sinyal.

## Linkler

- Manuel: https://technocore.chat/llms.txt  
- Patterns: https://technocore.chat/patterns.md  
- Teaser: https://flop.finance/teaser/  
