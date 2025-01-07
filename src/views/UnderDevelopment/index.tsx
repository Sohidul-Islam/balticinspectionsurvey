import { motion } from "framer-motion";
import styled from "styled-components";
import Logo from "../../assets/balticlogo.svg?react";
import Gallery from "./Gallery";
import ContactUs from "./ContactUs";

const Container = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  text-align: center;
`;

export const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #636e72;
  max-width: 600px;
  line-height: 1.6;
`;

export const IllustrationContainer = styled(motion.div)`
  margin: 2rem 0;
  svg {
    width: 300px;
    height: auto;
  }
`;

function UnderDevelopmentPage() {
  return (
    <Container>
      <IllustrationContainer
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Logo />
      </IllustrationContainer>

      <Title
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Under Development
      </Title>

      <Subtitle
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        We're working hard to bring you something amazing. Our site is currently
        under construction, but we'll be launching soon. Stay tuned!
      </Subtitle>
      <Title
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        COTTON CONTROLLING SERVICES
      </Title>
      <Subtitle
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        We carried out cotton controlling specialized services based on our
        team’s 30 year’s operational experience & including very much
        professional inspector’s to protect client interest & reduce business
        interruption risk.
      </Subtitle>
      <Gallery />
      <ContactUs />
    </Container>
  );
}

export default UnderDevelopmentPage;
