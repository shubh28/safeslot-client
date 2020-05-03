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
  align-items: ${props => props.alignItems};
  justify-content: ${props => props.justify};
  padding: 1rem;
  text-align: center;
`;

FlexContainer.defaultProps = {
  direction: 'row',
  alignItems: 'flex-start',
  justify: 'flex-start'
};

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 3fr;
  height: 90vh;
`;

export const HeaderDataContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'logo title'
    'logo address'
    'logo distance';

  .logo {
    grid-area: logo;
    width: 75px;
    height: 75px;
    margin: auto;
  }
  .title {
    grid-area: title;

    .badge {
      float: right;
    }
  }
  .address {
    grid-area: address;
    font-size: 1rem;
  }
  .distance {
    grid-area: distance;
    font-size: 0.8rem;
  }
`;

export const NoSlots = styled.h4`
  text-align: center;
  border: 1px lightgray solid;
  border-radius: 0.3rem;
  padding: 1rem;
`;
