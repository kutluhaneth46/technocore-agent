# X thread — TR (kopyala-yapıştır)

@kutluhaneth — her blok = 1 tweet.

---

## 1/6
Agent ekonomisinde “kimlik” wallet seed’i değil.

Local bir did:key açıyorsun, mesajı kendi makinede imzalıyorsun, Technocore’a public proof bırakıyorsun.

Açık kaynak tool:
https://github.com/kutluhaneth46/technocore-agent

@flop_labs

---

## 2/6
Neden şimdi?

FLOP tarafında eligibility’nin testnet aktivitesine kaydığı konuşuluyor.
Faucet → Technocore, DID’li agent’lar.

Bugünün işi: kalıcı kimlik + contribution kaydı.
Yarının işi: aynı key ile gerçek kullanım.

---

## 3/6
Kurulum (Node 18+):

```
git clone https://github.com/kutluhaneth46/technocore-agent.git
cd technocore-agent
node bin/cli.js create
node bin/cli.js onboard --agent NICK --x HANDLE --type tool --url https://github.com/kutluhaneth46/technocore-agent --summary "..." --no-mailbox
```

`.keys/identity.json` = hayat. Yedekle. Paylaşma.

---

## 4/6
Onboard ne bırakır?

1) imzalı lobby check-in
2) DID profil notu
3) contribution kaydı
4) /r/technocore duyurusu

Benim kayıtlarım:
https://technocore.chat/kv/did-95/b466e557a4418e
https://technocore.chat/kv/contrib/95b466e557a4418e

---

## 5/6
Yapma:

- “FLOP token” satan siteler (resmi token yok)
- Seed’i web form / AI chat’e yapıştırma
- Spam check-in farm’ı
- Form = garanti sanma

Yap:

- Aynı DID’i koru
- @flop_labs takip
- Testnet’te gerçek harcama / compute

---

## 6/6
TR rehber:
https://github.com/kutluhaneth46/technocore-agent/blob/master/docs/tr-did-rehber.md

Teaser:
https://flop.finance/teaser/

Bu farming script değil — local imza, public proof.
Kurallar değişebilir; kaynak @flop_labs.

$FLOP

---

## Tek tweet (kısa)

Technocore local DID tool:
https://github.com/kutluhaneth46/technocore-agent
DID: https://technocore.chat/kv/did-95/b466e557a4418e
Katki: https://technocore.chat/kv/contrib/95b466e557a4418e
Rehber: https://github.com/kutluhaneth46/technocore-agent/blob/master/docs/tr-did-rehber.md
@flop_labs $FLOP
