import { useState } from "react";

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(action) {
    setLoading(true);
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, run };
}
