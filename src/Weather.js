import { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      if (!apiKey) {
        throw new Error("API key is missing. Please check your .env file.");
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&appid=${apiKey}&units=metric`;

      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Please enter a valid city name.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key or the key is not active yet.");
      } else {
        setError(
          err.message?.includes("API key is missing")
            ? err.message
            : "Unable to fetch weather. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-500 via-blue-700 to-indigo-950 px-4 py-12">
      <section className="mx-auto max-w-2xl">
        <header className="mb-8 text-center text-white">
          <div className="mb-3 text-6xl">🌤️</div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Weather Report
          </h1>
          <p className="mt-3 text-blue-100">
            Discover the weather in your city
          </p>
        </header>

        <form
          onSubmit={searchWeather}
          className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex-row"
        >
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city name (e.g. Chennai)"
            aria-label="City name"
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-100 p-4 text-center font-medium text-red-700"
          >
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-6 text-center text-white">
            Fetching weather data...
          </p>
        )}

        {weather && (
          <article className="mt-8 rounded-3xl bg-white/95 p-6 text-center shadow-2xl sm:p-10">
            <h2 className="text-3xl font-bold text-gray-800">
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto h-28 w-28"
            />

            <p className="text-6xl font-extrabold text-blue-700">
              {Math.round(weather.main.temp)}°C
            </p>

            <p className="mt-3 text-xl capitalize text-gray-600">
              {weather.weather[0].description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-sky-100 p-4">
                <p className="text-2xl">🌡️</p>
                <p className="mt-2 text-sm text-gray-600">Feels Like</p>
                <p className="text-xl font-bold text-gray-800">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>

              <div className="rounded-2xl bg-blue-100 p-4">
                <p className="text-2xl">💧</p>
                <p className="mt-2 text-sm text-gray-600">Humidity</p>
                <p className="text-xl font-bold text-gray-800">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-100 p-4">
                <p className="text-2xl">💨</p>
                <p className="mt-2 text-sm text-gray-600">Wind Speed</p>
                <p className="text-xl font-bold text-gray-800">
                  {weather.wind.speed} m/s
                </p>
              </div>
            </div>
          </article>
        )}

        <footer className="mt-8 text-center text-sm text-blue-100">
          Weather data provided by OpenWeatherMap
        </footer>
      </section>
    </main>
  );
}

export default Weather;