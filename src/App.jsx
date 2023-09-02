import { useState } from "react";
// import "./App.css";
import NavBar from "./Components/Navbar";
import PokemonList from "./Components/PokemonList";
import Index from "./Components/Index.jsx";
import { useTheme } from "./Components/themeContext.jsx";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { Box } from "@mui/material";

function App() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#333" : "#fceec8",
      },
      text: {
        primary: darkMode ? "#fff" : "#333",
      },
    },
  });
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Box
          sx={{
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <NavBar setSearchTerm={setSearchTerm} />
          <Index searchTerm={searchTerm} />
        </Box>
      </MuiThemeProvider>
    </>
  );
}

export default App;
