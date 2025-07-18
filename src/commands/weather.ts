import { sendTelegramMessage } from "../utils/send-tele-msg";

interface WeatherCondition {
  temp_C: string;
  weatherDesc: { value: string }[];
  humidity: string;
}

interface WttrResponse {
  current_condition: WeatherCondition[];
}

async function fetchWeather(city: string) {
  const res = await fetch(
    `https://wttr.in/${encodeURIComponent(city)}?format=j1`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");

  const data = (await res.json()) as WttrResponse;

  const current = data.current_condition[0];
  return {
    tempC: current.temp_C,
    desc: current.weatherDesc[0].value,
    humidity: current.humidity,
  };
}

export async function handleWeatherCommand(
  c: any,
  text: string,
  chatId: number,
  token: string
) {
  const parts = text.trim().split(" ");
  const city = parts.length >= 2 ? parts.slice(1).join(" ") : "Phnom Penh";

  try {
    const weather = await fetchWeather(city);

    const reply = `👋 Sur sdey! Here's the weather in ${city}:

    🌤️ Condition: ${weather.desc}
    🌡️ Temperature: ${weather.tempC}°C
    `;

    await sendTelegramMessage(chatId, reply, token);
    return c.text("Weather sent");
  } catch (error) {
    await sendTelegramMessage(
      chatId,
      "Sorry, I couldn't get the weather for that city.",
      token
    );
    return c.text("Error fetching weather");
  }
}
