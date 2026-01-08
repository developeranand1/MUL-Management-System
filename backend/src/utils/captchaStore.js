const store = new Map(); // captchaId -> { question, answer, expiresAt }

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createCaptcha() {
  const a = randomInt(1, 20);
  const b = randomInt(1, 20);
  const question = `${a} + ${b} = ?`;
  const answer = String(a + b);

  const captchaId = cryptoRandomId();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  store.set(captchaId, { question, answer, expiresAt });
  return { captchaId, question, expiresAt };
}

function verifyCaptcha(captchaId, userAnswer) {
  const entry = store.get(captchaId);
  if (!entry) return { ok: false, reason: "CAPTCHA_NOT_FOUND" };
  if (Date.now() > entry.expiresAt) {
    store.delete(captchaId);
    return { ok: false, reason: "CAPTCHA_EXPIRED" };
  }
  const ok = String(userAnswer || "").trim() === entry.answer;
  if (!ok) return { ok: false, reason: "CAPTCHA_INVALID" };
  store.delete(captchaId);
  return { ok: true };
}

function cryptoRandomId() {
  // no external deps
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}

module.exports = { createCaptcha, verifyCaptcha };
