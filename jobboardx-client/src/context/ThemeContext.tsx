import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode, CssBaseline } from "@mui/material";

// Create context for color mode
interface ColorModeContextType {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

// Theme provider wrapper
interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  // Read initial mode from localStorage or default to 'light'
  const storedMode =
    (localStorage.getItem("themeMode") as PaletteMode) || "light";
  const [mode, setMode] = useState<PaletteMode>(storedMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#7C3AED" }, // Violet
                secondary: { main: "#6366F1" }, // Indigo
                background: {
                  default: "#F3F4F6",
                  paper: "#FFFFFF",
                },
              }
            : {
                primary: { main: "#8B5CF6" },
                secondary: { main: "#818CF8" },
                background: {
                  default: "#121212",
                  paper: "#1E1E1E",
                },
              }),
        },
        typography: {
          fontFamily: "Kanit",
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#7C3AED" : "#1E1E1E",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
