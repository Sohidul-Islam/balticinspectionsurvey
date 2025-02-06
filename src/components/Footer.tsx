/* eslint-disable no-unsafe-optional-chaining */
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import Logo from "../assets/balticlogowhite.svg?react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axios";

interface FooterData {
  id: string;
  emails: string[];
  phones: string[];
  addresses: string[];
  isActive: boolean;
}

const Footer = () => {
  const { data: footerData } = useQuery<FooterData>({
    queryKey: ["footer-data"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/footer");
      const { emails, phones, addresses, isActive, id } = response?.data?.data;
      return {
        id,
        emails: emails || [],
        phones: phones || [],
        addresses: addresses || [],
        isActive: isActive || false,
      };
    },
  });

  // if (!footerData?.isActive) {
  //   return null;
  // }

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <CompanyInfo>
            <LogoSection>
              <Logo width={100} height={100} />
              <p>Building dreams, delivering excellence.</p>
            </LogoSection>
            <SocialLinks>
              <SocialIcon href="#" target="_blank">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="#" target="_blank">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="#" target="_blank">
                <FaLinkedinIn />
              </SocialIcon>
              <SocialIcon href="#" target="_blank">
                <FaInstagram />
              </SocialIcon>
            </SocialLinks>
          </CompanyInfo>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <QuickLinks>
            <QuickLink to="/">Home</QuickLink>
            <QuickLink to="/about">About Us</QuickLink>
            <QuickLink to="/services">Services</QuickLink>
            <QuickLink to="/projects">Projects</QuickLink>
          </QuickLinks>
        </FooterSection>

        <FooterSection>
          <h3>Contact Info</h3>
          <ContactInfo>
            {footerData?.addresses?.map((address: any, index: any) => (
              <ContactItem key={`address-${index}`}>
                <IconWrapper>
                  <FaMapMarkerAlt />
                </IconWrapper>
                <span>{address}</span>
              </ContactItem>
            ))}
            {footerData?.phones?.map((phone: any, index: any) => (
              <ContactItem key={`phone-${index}`}>
                <IconWrapper>
                  <FaPhoneAlt />
                </IconWrapper>
                <span>{phone}</span>
              </ContactItem>
            ))}
            {footerData?.emails?.map((email: any, index: any) => (
              <ContactItem key={`email-${index}`}>
                <IconWrapper>
                  <FaEnvelope />
                </IconWrapper>
                <span>{email}</span>
              </ContactItem>
            ))}
          </ContactInfo>
          <ContactButton to="/contact">
            Contact Us
            <FaArrowRight />
          </ContactButton>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Copyright>
        <BottomLinks>
          <BottomLink to="/privacy">Privacy Policy</BottomLink>
          <BottomLink to="/terms">Terms of Service</BottomLink>
        </BottomLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

// background: linear-gradient(to right, #1a1c20, #2d3436);
const FooterContainer = styled.footer`
  background: linear-gradient(to right, #1a1c20, #2d3436);
  color: white;
  padding: 4rem 0 0;
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
    color: #ffffff;

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

const CompanyInfo = styled.div`
  margin-bottom: 2rem;
`;

const LogoSection = styled.div`
  margin-bottom: 1.5rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #00b894, #00cec9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #b2bec3;
    font-size: 1rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: #00b894;
    transform: translateY(-3px);
  }
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const QuickLink = styled(Link)`
  color: #b2bec3;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "→";
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
  }

  &:hover {
    color: #00b894;
    transform: translateX(5px);

    &:before {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #b2bec3;
`;

const IconWrapper = styled.span`
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00b894;
`;

const ContactButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #00b894;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  i {
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #00a884;
    transform: translateY(-2px);

    i {
      transform: translateX(5px);
    }
  }
`;

const FooterBottom = styled.div`
  margin-top: 4rem;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: #b2bec3;
  font-size: 0.9rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const BottomLink = styled(Link)`
  color: #b2bec3;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #00b894;
  }
`;

export default Footer;
