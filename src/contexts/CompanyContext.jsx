import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { company as fallback } from "../data/defaultCompany";

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(fallback);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/company")
      .then(({ data }) => {
        if (!isMounted) return;
        setCompany({ ...fallback, ...data });
      })
      .catch(() => {
        // fallback silencieux
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

// ✅ IMPORTANT: export nommé obligatoire
export function useCompany() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("useCompany must be used inside CompanyProvider");
  }

  return context;
}