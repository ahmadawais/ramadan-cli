import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateCommand } from "../commands/update.js";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock console methods
const mockLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockError = vi.spyOn(console, "error").mockImplementation(() => {});

describe("updateCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show message when up to date", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        "dist-tags": {
          latest: "6.2.0",
        },
      }),
    });

    await updateCommand("6.2.0");

    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining("latest version"),
    );
    expect(mockError).not.toHaveBeenCalled();
  });

  it("should show update message when new version available", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        "dist-tags": {
          latest: "7.0.0",
        },
      }),
    });

    await updateCommand("6.2.0");

    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining("Update available"),
    );
    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining("npm install -g ramadan-cli@latest"),
    );
  });

  it("should handle fetch errors gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await updateCommand("6.2.0");

    expect(mockError).toHaveBeenCalled();
  });

  it("should handle network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await updateCommand("6.2.0");

    expect(mockError).toHaveBeenCalledWith(expect.stringContaining("Error"));
  });
});
