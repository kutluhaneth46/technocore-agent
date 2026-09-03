"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { createDid, buildKit, sign, publicProofFromPrivateKey } = require("../lib/technocore");

describe("technocore-agent", () => {
  it("creates a did:key starting with did:key:z6Mk", () => {
    const id = createDid();
    assert.match(id.did, /^did:key:z6Mk/);
    assert.equal(id.fingerprint.length, 16);
  });

  it("signs room|nonce|text and builds a kit", () => {
    const id = createDid();
    const kit = buildKit({
      privateKeyJwk: id.privateKeyJwk,
      agentName: "test_agent",
      xHandle: "testuser",
      contributionType: "tool",
      guideUrl: "https://example.com/guide",
      contributionSummary: "Unit test contribution for Technocore kit.",
      includeMailbox: true,
    });
    assert.equal(kit.did, id.did);
    assert.ok(kit.lobbyProofUrl.includes("/say-signed/"));
    assert.ok(kit.lobbyProof.sig.length === 86);
    assert.equal(kit.lobbyProof.canonical.split("|")[0], "lobby");

    const privateKey = crypto.createPrivateKey({ key: id.privateKeyJwk, format: "jwk" });
    const ok = crypto.verify(
      null,
      Buffer.from(kit.lobbyProof.canonical, "utf8"),
      privateKey,
      Buffer.from(kit.lobbyProof.sig, "base64url"),
    );
    assert.equal(ok, true);
  });

  it("round-trips public proof from private key", () => {
    const id = createDid();
    const proof = publicProofFromPrivateKey(id.privateKeyJwk);
    assert.equal(proof.did, id.did);
  });
});
