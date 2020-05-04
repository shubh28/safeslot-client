import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  height: 100vh;
  width: ${({ open }) => (open ? '50%' : '1%')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  transition: width 0.3s ease-in-out;
  transition: visibility: 0.5s ease-in-out;

  @media (max-width: 576px) {
    width: ${({ open }) => (open ? '70%' : '0')};
  }

  a {
    display: ${({ open }) => (open ? 'static' : 'none')};
    font-size: 1 rem;
    text-transform: uppercase;
    padding: 1rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #17a2b8;
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: 576px) {
      font-size: 1 rem;
      text-align: center;
    }

    &:hover {
      color: gray;
    }
  }
`;
