import { useLocation } from "react-router-dom";

// HOOK PERSONALIZADO

export function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}
