import { createContext, useState } from 'react';

export const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [lastLocation, setLastLocation] = useState(false);

  return (
    <LocationContext.Provider value={{ lastLocation, setLastLocation }}>
      {children}
    </LocationContext.Provider>
  );
}