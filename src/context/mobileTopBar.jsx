// src/context/mobileTopBar.jsx
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

// 4. Export the setter for direct use in pages
export const useSetMobileTopBarTitle = () => {
  const { setTitle } = useContext(MobileTopBarContext);
  return setTitle;
};
