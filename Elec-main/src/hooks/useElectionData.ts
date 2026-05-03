import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function useElectionData(country = "us") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    api.elections.getPhases(country)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, [country]);

  return { data, loading, error };
}
