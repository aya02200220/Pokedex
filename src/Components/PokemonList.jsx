import { IconButton, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import React, { useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { motion } from "framer-motion";
import noImage from "../../public/images/question.png";
import { CircularProgress } from "@mui/material";

import { useTheme } from "./themeContext";

const PokemonList = ({ pokemon, onPokemonClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayImage, setDisplayImage] = useState(pokemon.front || noImage);
  const [isLoading, setIsLoading] = useState(true);

  const { darkMode } = useTheme();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#333" : "#f5f5f5",
      },
      border: {
        default: darkMode ? "solid 5px #747474" : "solid 5px #333",
      },
      text: {
        primary: darkMode ? "#fff" : "#333",
      },
    },
  });
  useEffect(() => {
    if (isHovered) {
      setDisplayImage(pokemon.back || pokemon.front || noImage);
    } else {
      setDisplayImage(pokemon.front || noImage);
    }
  }, [isHovered, pokemon.front, pokemon.back]);

  useEffect(() => {
    if (pokemon) {
      setIsLoading(false);
    }
  }, [pokemon]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
        <IconButton
          sx={{ borderRadius: 100, height: "150px", mt: 5 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onPokemonClick(pokemon.url)}
        >
          <Box
            sx={{
              height: "150px",
              width: "150px",
              backgroundColor: "#a51b13",
              border: theme.palette.border.default,
              // border: "solid 5px #333",
              display: "flex",
              borderRadius: "100px",
              position: "relative",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={pokemon.id}
          >
            <Box
              sx={{
                height: "150px",
                width: "150px",
                backgroundColor: alpha("#fff", 0.1),
                position: "absolute",
                borderRadius: "100px",
                zIndex: 1,
              }}
            ></Box>
            <Box
              sx={{
                height: "5px",
                width: "150px",
                position: "absolute",
              }}
            ></Box>
            <Box
              sx={{
                height: "75px",
                width: "150px",
                backgroundColor: "#fffefa",
                position: "absolute",
                bottom: 0,
                borderRadius: "0 0 100px 100px",
                zIndex: 0,
              }}
            ></Box>
            <Box
              sx={{
                fontSize: "20px",
                fontWeight: "900",
                position: "absolute",
                top: "-23%",
                left: "-16%",
                width: "220px",
                display: "flex",
                // color: "#333",
                color: theme.palette.text.primary,
              }}
            >
              <Typography
                fontSize={"17px"}
                sx={{ fontWeight: "500", textTransform: "capitalize" }}
              >
                {pokemon.id}: {pokemon.name}
              </Typography>
            </Box>
            <Box zIndex={1}>
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isHovered ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                onAnimationComplete={() => setIsHovered(false)}
              >
                <Box
                  sx={{
                    height: displayImage === noImage ? "130px" : "140px",
                    width: displayImage === noImage ? "130px" : "140px",
                  }}
                  component="img"
                  src={displayImage}
                  alt=""
                />
              </motion.div>
            </Box>
          </Box>
        </IconButton>
      </Box>
    </>
  );
};

export default PokemonList;
