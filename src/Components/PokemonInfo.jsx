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
import { CircularProgress } from "@mui/material";

const PokemonInfo = ({ pokemon }) => {
  const { darkMode } = useTheme();
  const [showShiny, setShowShiny] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [previousState, setPreviousState] = useState({});

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

  const typeColors = {
    normal: "#b3afaf",
    fire: "#db4242",
    water: "#6969f1",
    electric: "#e1d624",
    grass: "#2ba72b",
    ice: "lightblue",
    fighting: "#a84e4e",
    poison: "#9d5a9d",
    ground: "#c08339",
    flying: "skyblue",
    psychic: "#ff98aa",
    bug: "#a3c6a3",
    rock: "darkgrey",
    ghost: "#6c176c",
    dragon: "darkblue",
    dark: "black",
    steel: "silver",
    fairy: "lightpink",
  };

  function getTextColor(backgroundColor) {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    // 背景色の明るさを計算
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // 明るさに応じて文字色を返す
    return brightness > 155 ? "black" : "white";
  }

  useEffect(() => {
    setImageLoading(true); // ポケモンが変わったらローディング状態をリセット
  }, [pokemon]);

  // 画像がロードされたら、ローディングを非表示に
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  useEffect(() => {
    const currentState = { pokemon, showShiny, showHome };
    if (JSON.stringify(currentState) !== JSON.stringify(previousState)) {
      setImageLoading(true);
      setPreviousState(currentState);
    } else {
      setImageLoading(false); // 同じポケモン・同じ画像の場合は強制的にローディングを停止
    }
  }, [pokemon, showShiny, showHome]);

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
          height: "85%",
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

        {imageLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {currentImage ? (
          <Box
            component="img"
            onLoad={handleImageLoad}
            sx={{
              width: "100%",
              maxHeight: "70%",
              objectFit: "contain",
              maxWidth: "100%",
              height: "auto",
              objectFit: "scale-down",
              display: imageLoading ? "none" : "block",
            }}
            src={currentImage}
            alt={`${pokemon.name} ${showShiny ? "Shiny" : "Default"} ${
              showHome ? "Home" : "Artwork"
            } Image`}
          />
        ) : (
          <>
            <Box
              component="img"
              src={noImage}
              alt="No available image"
              sx={{ width: "30%", display: imageLoading ? "none" : "block" }}
            />
            {imageLoading && setImageLoading(false)}
          </>
        )}
      </Box>

      <Box
        sx={{
          // flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          height: "20%",
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
              <Typography>Type:</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              {pokemon.types
                ? pokemon.types.map((typeObj, index) => {
                    const bgColor = typeColors[typeObj.type.name] || "grey";
                    const textColor = getTextColor(bgColor);
                    return (
                      <Typography
                        key={index}
                        sx={{
                          backgroundColor: bgColor,
                          color: textColor, // 文字色を設定
                          borderRadius: 2,
                          padding: "0 5px",
                          marginLeft: "2px",
                        }}
                      >
                        {typeObj.type.name}
                        {/* {index < pokemon.types.length - 1 ? ", " : ""} */}
                      </Typography>
                    );
                  })
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
