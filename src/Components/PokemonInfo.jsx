import React from "react";

const PokemonInfo = ({ pokemon }) => {
  return (
    <>
      <h1>{pokemon.name}</h1>
      <p>Experience: {pokemon.base_experience}</p>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Game Index: {pokemon.game_indices[0]?.game_index}</p>
    </>
  );
};

export default PokemonInfo;
