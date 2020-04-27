import styled from 'styled-components';
import { Spinner } from 'reactstrap';

export const LoaderWheel = styled(Spinner)`
  height: 3rem;
  width: 3rem;
  margin: 1rem;
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;

  h1 {
    color: #17a2b8;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction};
  width: 100%;
  align-items: center;
  padding: 1rem;
  text-align: center;
`;

FlexContainer.defaultProps = {
  direction: 'row'
};
