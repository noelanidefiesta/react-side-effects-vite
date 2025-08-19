import { useEffect, useState } from "react";

function App() {
  // I’m keeping state simple and readable for a beginner setup:
  // - joke: the actual joke text to show in <p>
  // - isLoading: controls loading text and button disabled state
  // - error: shows a friendly message if the request fails
  const [joke, setJoke] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function fetches one programming joke from the given API.
  async function fetchJoke() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://v2.jokeapi.dev/joke/Programming?type=single"
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      // The API returns { joke: "..." } when type=single
      setJoke(data.joke || "No joke received from the server.");
    } catch (err) {
      // Beginner-friendly, non-technical message for the UI:
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Run once on mount to load the first joke.
  // Empty dependency array means "only when the component first renders".
  useEffect(() => {
    fetchJoke();
    // No cleanup is needed here because we are not subscribing to anything.
  }, []);

  return (
    <main
      style={{
        fontFamily: "system-ui, Arial, sans-serif",
        maxWidth: "700px",
        margin: "40px auto",
        padding: "16px",
        lineHeight: 1.5,
      }}
    >
      <h1>Programming Jokes</h1>

      {/* Only ONE button in the UI */}
      <button onClick={fetchJoke} disabled={isLoading} style={{ marginBottom: 12 }}>
        {isLoading ? "Loading..." : "New Joke"}
      </button>

      {/* Only ONE <p> that contains the joke (or loading/error message) */}
      <p aria-live="polite">
        {isLoading
          ? "Loading a programming joke..."
          : error
            ? error
            : joke}
      </p>
    </main>
  );
}

export default App;
