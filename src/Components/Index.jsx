import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PokemonInfo from "./PokemonInfo";
import PokemonList from "./PokemonList";
import Pokedex from "../../public/images/Pokedex.png";
import { motion } from "framer-motion";

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

  useEffect(() => {
    fetchAllPokemonData().then(() => {
      displayPage(1); // 初期ページを表示
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
          }}
        >
          {/* Pokemon Lists */}
          <Box
            sx={{
              pl: 2,
              width: "60%",
              // border: "solid 1px red",
              overflow: "scroll",
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              pt: 6,
            }}
          >
            {displayData.map((pokemon, index) => (
              <PokemonList
                key={index}
                onPokemonClick={handlePokemonClick}
                pokemon={pokemon}
              />
            ))}
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
