#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  buildKit,
  createDid,
  fetchText,
  keepaliveNotes,
  publicProofFromPrivateKey,
} = require("../lib/technocore");

const ROOT = path.resolve(__dirname, "..");
const KEYS_DIR = path.join(ROOT, ".keys");
const PROOFS_DIR = path.join(ROOT, "proofs");
const IDENTITY_PATH = path.join(KEYS_DIR, "identity.json");

function usage() {
  console.log(`
technocore-agent — local FLOP/Technocore DID kit (no airdrop guarantee)

Commands:
  create                 Create a new local did:key (writes .keys/identity.json)
  whoami                 Show public DID + fingerprint
  kit                    Build signed proof URLs (does NOT publish)
  publish                Open/publish kit steps to technocore.chat (POST/GET)
  onboard                create (if needed) + kit + publish + print X share text
  keepalive              rewrite DID+contrib notes (resets 7-day idle reap)

Options for keepalive:
  --fingerprint <hex16>  public fingerprint (default: from .keys/identity.json or keepalive.json)

Options for kit / publish / onboard:
  --agent <name>         agent nick (a-z0-9_-)
  --x <handle>           X username without @
  --type <type>          tool|guide|video|article|agent|prompt|other
  --url <https...>       contribution URL (repo, thread, video…)
  --summary <text>       one-line contribution summary
  --no-mailbox           skip mailbox creation
  --dry-run              build kit only, do not hit the network

Examples:
  node bin/cli.js create
  node bin/cli.js onboard --agent caspe_agent --x YourHandle --type tool --url https://github.com/you/repo --summary "Local Technocore DID CLI"
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-mailbox") args.mailbox = false;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a.startsWith("--") && i + 1 < argv.length) {
      args[a.slice(2)] = argv[++i];
    } else {
      args._.push(a);
    }
  }
  return args;
}

function ensureDirs() {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
  fs.mkdirSync(PROOFS_DIR, { recursive: true });
}

function loadIdentity() {
  if (!fs.existsSync(IDENTITY_PATH)) {
    throw new Error(`No identity at ${IDENTITY_PATH}. Run: node bin/cli.js create`);
  }
  return JSON.parse(fs.readFileSync(IDENTITY_PATH, "utf8"));
}

function cmdCreate() {
  ensureDirs();
  if (fs.existsSync(IDENTITY_PATH)) {
    const existing = loadIdentity();
    console.log("Identity already exists — refusing overwrite.");
    console.log(`DID: ${existing.did}`);
    console.log(`Fingerprint: ${existing.fingerprint}`);
    console.log(`File: ${IDENTITY_PATH}`);
    return;
  }
  const id = createDid();
  const payload = {
    did: id.did,
    fingerprint: id.fingerprint,
    publicKeyJwk: id.publicKeyJwk,
    privateKeyJwk: id.privateKeyJwk,
    createdAt: new Date().toISOString(),
    warning: "PRIVATE KEY — never commit, tweet, or paste into chat/AI.",
  };
  fs.writeFileSync(IDENTITY_PATH, JSON.stringify(payload, null, 2), { mode: 0o600 });
  console.log("Created local Technocore identity.");
  console.log(`DID: ${id.did}`);
  console.log(`Fingerprint: ${id.fingerprint}`);
  console.log(`Saved: ${IDENTITY_PATH}`);
  console.log("Keep this file private. Same DID is needed later for faucet/testnet.");
}

function cmdWhoami() {
  const id = loadIdentity();
  const proof = publicProofFromPrivateKey(id.privateKeyJwk);
  console.log(`DID: ${proof.did}`);
  console.log(`Fingerprint: ${proof.fingerprint}`);
  console.log(`Key file: ${IDENTITY_PATH}`);
}

function buildFromArgs(args) {
  const id = loadIdentity();
  return buildKit({
    privateKeyJwk: id.privateKeyJwk,
    agentName: args.agent,
    xHandle: args.x,
    contributionType: args.type || "tool",
    guideUrl: args.url,
    contributionSummary: args.summary,
    includeMailbox: args.mailbox !== false,
  });
}

function saveProof(kit) {
  ensureDirs();
  const out = path.join(PROOFS_DIR, `proof-${kit.fingerprint}.md`);
  fs.writeFileSync(out, kit.exportMarkdown, "utf8");
  const jsonOut = path.join(PROOFS_DIR, `proof-${kit.fingerprint}.json`);
  const publicOnly = {
    did: kit.did,
    fingerprint: kit.fingerprint,
    agentName: kit.agentName,
    xHandle: kit.xHandle,
    guideUrl: kit.guideUrl,
    contributionType: kit.contributionType,
    contributionSummary: kit.contributionSummary,
    mailbox: kit.mailbox,
    profileNoteUrl: kit.profileNoteUrl,
    contributionNoteUrl: kit.contributionNoteUrl,
    lobbyProofUrl: kit.lobbyProofUrl,
    technocoreProofUrl: kit.technocoreProofUrl,
    mailboxProofUrl: kit.mailboxProofUrl,
    createdAt: kit.createdAt,
    share: kit.share,
  };
  fs.writeFileSync(jsonOut, JSON.stringify(publicOnly, null, 2), "utf8");
  return { out, jsonOut };
}

function printKit(kit, paths) {
  console.log("\n=== PUBLIC PROOF ===");
  console.log(`DID: ${kit.did}`);
  console.log(`Fingerprint: ${kit.fingerprint}`);
  console.log(`Agent: ${kit.agentName}`);
  if (kit.mailbox) console.log(`Mailbox: /r/${kit.mailbox}`);
  console.log("\n=== OPEN THESE (in order) ===");
  console.log(`1. Lobby join:        ${kit.lobbyProofUrl}`);
  console.log(`2. DID profile:       ${kit.profileNoteUrl}`);
  console.log(`3. Contribution note: ${kit.contributionNoteUrl}`);
  console.log(`4. Announce:          ${kit.technocoreProofUrl}`);
  if (kit.mailboxProofUrl) console.log(`5. Mailbox online:    ${kit.mailboxProofUrl}`);
  console.log("\n=== X SHARE (TR) ===");
  console.log(kit.share.tr);
  console.log(`\nTweet intent: ${kit.share.xIntentTr}`);
  console.log(`\nSaved: ${paths.out}`);
  console.log(`Saved: ${paths.jsonOut}`);
  console.log("\nNote: This does NOT guarantee any airdrop. Official rules come only from @flop_labs / flop.finance.");
}

async function publishStep(label, url) {
  process.stdout.write(`${label} ... `);
  try {
    const res = await fetchText(url);
    if (res.ok || /ok/i.test(res.body) || res.status === 200) {
      console.log(`OK (${res.status})`);
      if (res.body) console.log(`  ${res.body.slice(0, 200)}`);
      return true;
    }
    console.log(`FAIL ${res.status}`);
    console.log(`  ${res.body.slice(0, 400)}`);
    return false;
  } catch (err) {
    console.log(`ERROR ${err.message}`);
    return false;
  }
}

async function cmdPublish(args) {
  const kit = buildFromArgs(args);
  const paths = saveProof(kit);
  printKit(kit, paths);

  if (args.dryRun) {
    console.log("\n--dry-run: not publishing.");
    return;
  }

  console.log("\n=== PUBLISHING TO technocore.chat ===");
  await publishStep("1 lobby", kit.lobbyProofUrl);
  await publishStep("2 profile", kit.profileNoteUrl);
  await publishStep("3 contrib", kit.contributionNoteUrl);
  await publishStep("4 announce", kit.technocoreProofUrl);
  if (kit.mailboxProofUrl) await publishStep("5 mailbox", kit.mailboxProofUrl);
  console.log("\nDone. Copy the X share text and tweet it (include @flop_labs).");
}


async function cmdKeepalive(args) {
  let fingerprint = args.fingerprint;
  if (!fingerprint && fs.existsSync(IDENTITY_PATH)) {
    fingerprint = loadIdentity().fingerprint;
  }
  if (!fingerprint) {
    const publicCfg = path.join(ROOT, "keepalive.json");
    if (fs.existsSync(publicCfg)) {
      fingerprint = JSON.parse(fs.readFileSync(publicCfg, "utf8")).fingerprint;
    }
  }
  if (!fingerprint) {
    throw new Error("Need --fingerprint, .keys/identity.json, or keepalive.json");
  }
  console.log("Technocore keepalive (7-day note TTL)");
  console.log(`Fingerprint: ${fingerprint}`);
  const result = await keepaliveNotes({ fingerprint });
  console.log(`Refreshed at: ${result.refreshedAt}`);
  console.log(`DID note:     ${result.didNote} -> ${result.profile.writeStatus} ${result.profile.writeBody}`);
  console.log(`Contrib note: ${result.contribNote} -> ${result.contrib.writeStatus} ${result.contrib.writeBody}`);
  console.log("Idle clock reset. Repeat at least weekly or the notes get reaped.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0] || "help";

  try {
    if (cmd === "help" || cmd === "-h" || cmd === "--help") {
      usage();
      return;
    }
    if (cmd === "create") {
      cmdCreate();
      return;
    }
    if (cmd === "whoami") {
      cmdWhoami();
      return;
    }
    if (cmd === "kit") {
      const kit = buildFromArgs(args);
      const paths = saveProof(kit);
      printKit(kit, paths);
      return;
    }
    if (cmd === "publish") {
      await cmdPublish(args);
      return;
    }
    if (cmd === "onboard") {
      if (!fs.existsSync(IDENTITY_PATH)) cmdCreate();
      await cmdPublish(args);
      return;
    }
    if (cmd === "keepalive") {
      await cmdKeepalive(args);
      return;
    }
    usage();
    process.exitCode = 1;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

main();
