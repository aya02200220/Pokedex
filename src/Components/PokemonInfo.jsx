import React, { useState, useEffect } from "react";
import { Box, Typography, Switch, Container } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
// import "../App.css";
import { motion } from "framer-motion";
import { useTheme } from "./themeContext";
import noImage from "../../public/images/no-image.png";
import pokedexFlame from "../../public/images/pokedexFlame.png";

const PokemonInfo = ({ pokemon }) => {
  const { darkMode } = useTheme();
  const [showShiny, setShowShiny] = useState(false);
  const [showHome, setShowHome] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#333" : "#f5f5f5",
      },
      backgroundType: {
        default: darkMode ? "#4b63d8" : "#b74555",
      },
      border: {
        default: darkMode ? "solid 5px #747474" : "solid 5px #333",
      },
      text: {
        primary: darkMode ? "#fff" : "#333",
      },
    },
  });

  const toggleShiny = () => {
    setShowShiny(!showShiny);
  };
  const toggleHome = () => {
    setShowHome(!showHome);
  };

  const label_1 = { inputProps: { "aria-label": "Switch" } };
  const label_2 = { inputProps: { "aria-label": "Switch" } };

  const defaultImage =
    pokemon.sprites?.other?.["official-artwork"]?.front_default;
  const shinyImage = pokemon.sprites?.other?.["official-artwork"]?.front_shiny;

  const defaultImageHome = pokemon.sprites?.other?.home?.front_default;
  const shinyImageHome = pokemon.sprites?.other?.home?.front_shiny;

  let currentImage;
  if (showHome) {
    currentImage = showShiny ? shinyImageHome : defaultImageHome;
  } else {
    currentImage = showShiny ? shinyImage : defaultImage;
  }

  useEffect(() => {
    if (showHome && !defaultImageHome && !shinyImageHome) {
      setShowHome(false); // 3D画像が存在しない場合、自動的に2Dに切り替え
    }
  }, [showHome, defaultImageHome, shinyImageHome]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "75%",
          overflow: "auto",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
          ml: 1,
          pt: "3px",
          border: "solid 1px #cac6ba",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <Box sx={{ height: { xs: "62px", sm: "38px" } }}>
          {shinyImage && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                ml: 2,
                mr: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography>Normal</Typography>
                <Switch
                  {...label_1}
                  checked={showShiny}
                  onChange={toggleShiny}
                />
                <Typography>Shiny</Typography>
              </Box>
              {defaultImageHome && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    ml: 3,
                  }}
                >
                  <Typography>2D</Typography>
                  <Switch
                    {...label_2}
                    checked={showHome}
                    onChange={toggleHome}
                  />
                  <Typography>3D</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            pl: 2,
            pr: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              textTransform: "uppercase",
              // width: "100%",
              fontSize: "30px",
              fontWeight: "600",
              maxHeight: "70px",
              height: "70px",
              wordWrap: "break-word",
            }}
          >
            {pokemon.name}
          </Typography>
          {/* {console.log(pokemon)} */}
        </Box>

        {currentImage ? (
          <Box
            component="img"
            sx={{
              width: "100%",
              maxHeight: "50%",
              objectFit: "contain",
              maxWidth: "100%",
              height: "auto",
              objectFit: "scale-down",
            }}
            src={currentImage}
            alt={`${pokemon.name} ${showShiny ? "Shiny" : "Default"} ${
              showHome ? "Home" : "Artwork"
            } Image`}
          />
        ) : (
          <Box>
            <Box
              component="img"
              src={noImage}
              alt="No available image"
              sx={{ width: "50%" }}
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          // flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          height: "25%",
          overflow: "auto",
        }}
      >
        {/* ///////////// Type & Height/Weight /////////////// */}
        <Box sx={{ width: "40%", mt: 1 }}>
          <Box
            sx={{
              lineHeight: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "row",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <Typography>Type:</Typography> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              {pokemon.types
                ? pokemon.types.map((typeObj, index) => (
                    <Typography key={index}>
                      {typeObj.type.name}
                      {index < pokemon.types.length - 1 ? ", " : ""}
                    </Typography>
                  ))
                : "Unknown"}
            </Box>
          </Box>

          <Box
            sx={{
              lineHeight: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ lineHeight: "20px" }}>
              Height: {pokemon.height}
            </Typography>
            <Typography sx={{ lineHeight: "20px" }}>
              Weight: {pokemon.weight}
            </Typography>
          </Box>
        </Box>

        {/* ///////////// Ability /////////////// */}
        <Box sx={{ width: "60%" }}>
          <Box
            mt={1}
            display="flex"
            flexDirection="row"
            flexWrap="wrap"

            // sx={{ position: "absolute", bottom: 5 }}
          >
            {pokemon.stats.map((item) => {
              return (
                <Box
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: "capitalize",
                    display: "flex",
                    width: "auto",
                    ml: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: "500", lineHeight: "20px" }}>
                    {item.stat.name}
                  </Typography>
                  <Typography sx={{ fontWeight: "400", lineHeight: "20px" }}>
                    :{item.base_stat}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PokemonInfo;
