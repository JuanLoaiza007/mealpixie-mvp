import { createContext, useState, useContext } from "react";

// 1. Export the context
export const MobileTopBarContext = createContext();

// 2. Create the provider
export function MobileTopBarProvider({ children }) {
  const [title, setTitle] = useState(null);

  return (
    <MobileTopBarContext.Provider value={{ title, setTitle }}>
      {children}
    </MobileTopBarContext.Provider>
  );
}

// 3. Export the hook
export const useMobileTopBar = () => useContext(MobileTopBarContext);
