import styled from 'styled-components';

const Header = styled.div`
  display: grid;
  grid-template-columns: 10% 1fr min-content;
  width: 100%;
  height: 9vh;
  grid-gap: 10px;
  background-color: #17a2b8;

  padding: 0.8rem;
  justify-content: center;
  align-items: center;

  * {
    color: #fff;
  }

  a:hover {
    color: #fff;
  }
`;

export default Header;
