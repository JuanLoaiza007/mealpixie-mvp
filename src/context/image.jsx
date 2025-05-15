import { createContext, useState, useContext } from "react";

// 1. Export the context
export const ImageContext = createContext();

// 2. Create the provider
export function ImageProvider({ children }) {
  const [imageUrl, setImageUrl] = useState(null);
  return (
    <ImageContext.Provider value={{ imageUrl, setImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
}

// 3. Export the hook
export const useImage = () => useContext(ImageContext);
