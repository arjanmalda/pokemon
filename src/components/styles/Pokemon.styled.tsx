import styled from "styled-components";

export const PokemonPopup = styled.div`
  .info-icon {
    cursor: context-menu;
  }
  .pokemon-info {
    max-height: fit-content;
    width: 300px;
    color: black;
    border: solid black 2px;
    position: relative;
    z-index: 1;
    display: none;
    border-radius: 0px;
  }
  .info-icon:hover + .pokemon-info {
    display: block;
    border-radius: 25px;
    transition: border-radius 150ms;
  }
  .giphy-embed {
    border-radius: 25px;
    border: solid white 0px;
  }
`;
