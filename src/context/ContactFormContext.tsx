"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface ContactFormContextType {
  isInfoCollapsed: boolean;
  showClickButton: boolean;
  toggleInfoCollapsed: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | null>(null);

export function ContactFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);
  const [showClickButton, setShowClickButton] = useState(true);

  const toggleInfoCollapsed = useCallback(() => {
    setIsInfoCollapsed((prev) => !prev);
  }, []);

  // Delay showing the click button after animation completes
  useEffect(() => {
    if (isInfoCollapsed) {
      // Hide button immediately when collapsing info (showing form)
      setShowClickButton(false);
    } else {
      // Show button after animation finishes (500ms)
      const timer = setTimeout(() => {
        setShowClickButton(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInfoCollapsed]);

  return (
    <ContactFormContext.Provider
      value={{
        isInfoCollapsed,
        showClickButton,
        toggleInfoCollapsed,
      }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error("useContactForm must be used within ContactFormProvider");
  }
  return context;
}
