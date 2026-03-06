"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  fontSize: "normal" | "large" | "xlarge";
  setFontSize: (size: "normal" | "large" | "xlarge") => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType | undefined>(undefined);

export const SeniorModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [fontSize, setFontSizeState] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("seniorMode");
    const savedFontSize = localStorage.getItem("fontSize");
    const savedContrast = localStorage.getItem("highContrast");
    
    if (saved) setIsSeniorMode(JSON.parse(saved));
    if (savedFontSize) setFontSizeState(JSON.parse(savedFontSize));
    if (savedContrast) setHighContrast(JSON.parse(savedContrast));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("seniorMode", JSON.stringify(isSeniorMode));
  }, [isSeniorMode]);

  useEffect(() => {
    localStorage.setItem("fontSize", JSON.stringify(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("highContrast", JSON.stringify(highContrast));
  }, [highContrast]);

  const toggleSeniorMode = () => setIsSeniorMode(!isSeniorMode);
  const setFontSize = (size: "normal" | "large" | "xlarge") => setFontSizeState(size);
  const toggleHighContrast = () => setHighContrast(!highContrast);

  return (
    <SeniorModeContext.Provider
      value={{
        isSeniorMode,
        toggleSeniorMode,
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = (): SeniorModeContextType => {
  const context = useContext(SeniorModeContext);
  if (!context) {
    throw new Error("useSeniorMode must be used within SeniorModeProvider");
  }
  return context;
};
