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

// 3. Export the hook to get the title
export const useMobileTopBarTitle = () => {
  const { title } = useContext(MobileTopBarContext);
  return title;
};

// 4. Export the hook to set the title
export const useSetMobileTopBarTitle = () => {
  const { setTitle } = useContext(MobileTopBarContext);
  return setTitle;
};
