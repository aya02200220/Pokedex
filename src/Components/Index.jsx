import React, { useState, useEffect } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PokemonInfo from "./PokemonInfo";
import PokemonList from "./PokemonList";
import Pokedex from "../../public/images/Pokedex.png";
import { motion } from "framer-motion";
import { animate } from "framer-motion";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Skeleton from "@mui/material/Skeleton";

let allPokemonData = [];

async function fetchAllPokemonData(offset = 0, limit = 20) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    if (response.ok) {
      const data = await response.json();

      const detailedDataPromises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const detailedData = await res.json();
        return {
          id: detailedData.id,
          ...pokemon,
          front: detailedData.sprites.front_default,
          back: detailedData.sprites.back_default,
        };
      });

      const detailedData = await Promise.all(detailedDataPromises);

      allPokemonData = allPokemonData.concat(detailedData);

      if (data.next !== null) {
        await fetchAllPokemonData(offset + limit, limit);
      }
    } else {
      console.log("Response was not ok:", response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState([]);
  const pageSize = 20; // 1ページに表示する項目数
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchAllPokemonData().then(() => {
      displayPage(1); // 初期ページを表示
      setIsLoading(false);
    });
  }, []);

  async function handlePokemonClick(pokemonUrl) {
    try {
      const response = await fetch(pokemonUrl);
      if (response.ok) {
        const data = await response.json();
        setSelectedPokemon(data); // stateを更新
      } else {
        console.log("Response was not ok:", response);
      }
    } catch (error) {
      console.error("Error fetching individual pokemon data:", error);
    }
  }

  function displayPage(pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    setDisplayData(allPokemonData.slice(startIndex, endIndex));
  }

  // ページ番号が変更されたときに呼び出される
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    displayPage(value);
  };

  const scrollDown = () => {
    const container = document.getElementById("scrollable-container");
    if (container) {
      container.scrollBy(0, 500); // 100px下にスクロール
    }
  };

  const smoothScroll = (amount) => {
    const container = document.getElementById("scrollable-container");
    if (container) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const target = container.scrollTop + amount;
        container.scrollTop += (amount * progress) / 300;

        if (progress < 300) {
          window.requestAnimationFrame(step);
        } else {
          container.scrollTop = target; // 終了時に目的地に強制移動
        }
      };

      window.requestAnimationFrame(step);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        minHeight: "100vh",
        width: "100vw",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mt: 5,
            width: "95%",
            height: "80vh",
            display: "flex",
            position: "relative",
          }}
        >
          {/* Pokemon Lists */}
          <Box
            id="scrollable-container"
            sx={{
              // border: "solid 1px red", // Border
              pl: 2,
              width: "60%",
              overflow: "scroll",
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              pt: 6,
            }}
          >
            {isLoading ? (
              <Box mt={5} sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {Array.from({ length: 20 }, (_, index) => (
                  <Skeleton
                    key={index}
                    animation="wave"
                    variant="circular"
                    width={170}
                    height={170}
                  />
                ))}
              </Box>
            ) : (
              displayData.map((pokemon, index) => (
                <PokemonList
                  key={index}
                  onPokemonClick={handlePokemonClick}
                  pokemon={pokemon}
                />
              ))
            )}

            <IconButton
              onClick={() => smoothScroll(-100)}
              sx={{
                position: "absolute",
                bottom: "50%",
                left: "57%",
                zIndex: 1,
                cursor: "pointer",
                border: "solid 1px gray",
              }}
            >
              <ArrowDropUpIcon />
            </IconButton>
            <IconButton
              onClick={() => smoothScroll(100)}
              sx={{
                position: "absolute",
                bottom: "40%",
                left: "57%",
                zIndex: 1,
                cursor: "pointer",
                border: "solid 1px gray",
              }}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          <Box sx={{ width: "40%", textAlign: "center", mt: 8 }}>
            {selectedPokemon ? (
              <PokemonInfo pokemon={selectedPokemon} />
            ) : (
              <Box mt={10} p={3}>
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Box component="img" src={Pokedex} sx={{ width: "50%" }} />
                </motion.div>
                <Typography
                  sx={{
                    fontSize: "30px",
                    fontWeight: "800",
                    lineHeight: "30px",
                    mt: 4,
                    // color: theme.palette.text.primary,
                  }}
                >
                  Select a Pokémon
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(allPokemonData.length / pageSize)}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
