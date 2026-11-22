import assert from "node:assert/strict";
import test from "node:test";
import { parseTweetLink } from "../src/dataPreparation/parseTweetLink.mjs";

test("Twitter and X links preserve the exact post ID and username", () => {
  for (const domain of ["twitter.com", "x.com"]) {
    assert.deepEqual(parseTweetLink(`[post](https://${domain}/some_user/status/1888888888888888888?s=20)`), {
      url: "https://x.com/some_user/status/1888888888888888888",
      username: "some_user",
    });
  }
});

test("authorless links have no username and unrelated sites are ignored", () => {
  assert.equal(parseTweetLink("https://example.com/status/123"), null);
  assert.equal(parseTweetLink("https://x.com/user/status/no-id"), null);
  assert.deepEqual(parseTweetLink("https://twitter.com/i/web/status/123"), {
    url: "https://x.com/i/web/status/123",
    username: null,
  });
});

test("a note with multiple posts yields only the first tweet URL", () => {
  assert.deepEqual(
    parseTweetLink("Meeting note: https://twitter.com/first/status/123 then https://x.com/second/status/456 — follow up"),
    { url: "https://x.com/first/status/123", username: "first" }
  );
});
