import styled from "styled-components";
import { motion } from "framer-motion";
import { ImageGrid } from "./DynamicRender";

const FooterContainer = styled.footer`
  background: #2d3436;
  color: white;
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 40px;
      height: 3px;
      background: #00b894;
      border-radius: 2px;
    }
  }
`;

export const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.6;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 2rem;

  p {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

interface FooterProps {
  data: {
    addresses: string[];
    phones: string[];
    email: string;
    keyServices: {
      title: string;
      description: string;
      src: string;
    }[];
  };
}

const Footer = ({ data }: FooterProps) => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Key Services</h3>

          {data.keyServices.map((service, index) => (
            <ServiceCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img src={service.src} alt={service.title} />
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </ServiceCard>
          ))}
        </FooterSection>

        <FooterSection>
          <h3>Contact Us</h3>
          <ContactInfo>
            {data.addresses.map((address, index) => (
              <p key={index}>{address}</p>
            ))}
            {data.phones.map((phone, index) => (
              <p key={index}>{phone}</p>
            ))}
            <p>{data.email}</p>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
