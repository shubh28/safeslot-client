import styled from 'styled-components';

export const StyledSplash = styled.div/*css*/ `
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3fr 2fr 1fr;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  height: 100vh;
  padding: 3rem 1rem;

  img {
    width: 70%;
    margin: auto;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  a {
    margin-bottom: 2rem;
  }

  .splashBody {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .splashFooter {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: 'center';
    img {
      margin-top: 3rem;
      width: 80px;
    }
  }

  @media (max-height: 700px) {
    padding: 1.5rem 1rem;
  }

  @media (max-height: 600px) {
    font-size: 0.75rem;
    img {
      width: 65%;
    }
    .splashBody {
      margin-top: 1rem;
    }
  }
`;
