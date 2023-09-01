import React from "react";
import { Box, Container } from "@mui/material";

const PokemonList = ({ pokemon, onPokemonClick }) => {
  return (
    <>
      <li key={pokemon.id} onClick={() => onPokemonClick(pokemon.url)}>
        <p>{pokemon.name}</p>
        <p>{pokemon?.game_indices?.[0]?.game_index}</p>
      </li>

      <Box sx={{}}></Box>
    </>
  );
};

export default PokemonList;
