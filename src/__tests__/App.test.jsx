import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App structure and behavior", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Mock fetch to return a predictable joke
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ joke: "This is a test joke." }),
      })
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("renders exactly one button and one paragraph", () => {
    const { container } = render(<App />);
    const buttons = screen.getAllByRole("button");
    const paragraphs = container.querySelectorAll("p");
    expect(buttons.length).toBe(1);
    expect(paragraphs.length).toBe(1);
  });

  it("shows loading on mount, then displays a joke after fetch resolves", async () => {
    render(<App />);

    // Be specific: loading state appears both on the button and in the paragraph
    expect(
      screen.getByRole("button", { name: /loading/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/loading a programming joke/i)
    ).toBeInTheDocument();

    // Wait for the mocked fetch to resolve and the UI to update
    expect(await screen.findByText("This is a test joke.")).toBeInTheDocument();

    // After load, the button label should switch back
    expect(
      screen.getByRole("button", { name: /new joke/i })
    ).toBeInTheDocument();
  });
});
