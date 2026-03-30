const INDICTRANS_URL = "http://indictrans:8000";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForHealth(retries = 30, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(`${INDICTRANS_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        console.log(`IndicTrans connected. Device: ${data.device}\n`);
        return;
      }
      console.log(`Health check returned ${res.status} (${i}/${retries})`);
    } catch (err) {
      console.log(`Waiting for IndicTrans (${i}/${retries}): ${err.message}`);
    }
    await sleep(delayMs);
  }
  throw new Error("IndicTrans did not become healthy in time");
}

async function translate(text) {
  const response = await fetch(`${INDICTRANS_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`IndicTrans returned ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.translation;
}

async function main() {
  await waitForHealth();

  const testText = "രില്‍ പലക്കം വളരെ പ്രയാസമാണ്‌. എനാല്‍ പ്രകൃതി ശരിയായി കണക്കു കൂട്ടുന്നു.";
  console.log("Input:", testText);
  console.log("Translating...");
  const result = await translate(testText);
  console.log("Output:", result);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});