export async function scheduled(
  event: ScheduledEvent,
  env: { BABYBIO_API_SECRET: string; BABYBIO_BD_ALERT_URL: string },
) {
  const url = env.BABYBIO_BD_ALERT_URL;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.BABYBIO_API_SECRET,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${new Date().toISOString()}] Request failed:`, errorText);
      return;
    }

    const data = await res.json();
    console.log(`[${new Date().toISOString()}] API response:`, data);
  } catch (e) {
    console.error(`[${new Date().toISOString()}] Error sending request:`, e);
  }
}
