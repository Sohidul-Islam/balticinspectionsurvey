import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const SpinnerContainer = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #74b9ff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  &:before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border: 3px solid transparent;
    border-top-color: #0984e3;
    border-radius: 50%;
    animation: ${spin} 2s linear infinite;
  }

  &:after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    border: 3px solid transparent;
    border-top-color: #0052cc;
    border-radius: 50%;
    animation: ${spin} 3s linear infinite;
  }
`;

export const Loader = () => (
  <LoaderWrapper>
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  </LoaderWrapper>
);
