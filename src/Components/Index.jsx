import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PokemonInfo from "./PokemonInfo";
import PokemonList from "./PokemonList";
import Pokedex from "../../public/images/Pokedex.png";

let allPokemonData = [];

async function fetchAllPokemonData(offset = 0, limit = 20) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    if (response.ok) {
      const data = await response.json();
      allPokemonData = allPokemonData.concat(data.results);

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
            mt: 12,
            // border: "solid 1px black",
            width: "95%",
            height: "75vh",
            // minHeight: "95%",
            display: "flex",
          }}
        >
          {/* Pokemon Lists */}
          <Box
            sx={{ width: "60%", border: "solid 1px red", overflow: "scroll" }}
          >
            <ul>
              {displayData.map((pokemon, index) => (
                <PokemonList
                  key={index}
                  onPokemonClick={handlePokemonClick}
                  pokemon={pokemon}
                />
              ))}
            </ul>
          </Box>
          <Box sx={{ width: "40%", textAlign: "center" }}>
            {selectedPokemon ? (
              <PokemonInfo pokemon={selectedPokemon} />
            ) : (
              <Box mt={10} p={3}>
                <Box component="img" src={Pokedex} sx={{ width: "80%" }} />
                <Typography
                  sx={{
                    fontSize: "30px",
                    fontWeight: "800",
                    lineHeight: "30px",
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
