import { motion } from "framer-motion";
import styled from "styled-components";
import { FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  width: 100%;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled(motion.div)`
  padding: 2rem;
`;

const ContactTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  margin-right: 1rem;

  svg {
    font-size: 1.2rem;
    color: #2d3436;
  }
`;

const ContactText = styled.div`
  flex: 1;
`;

const Label = styled.h3`
  font-size: 0.9rem;
  color: #636e72;
  margin: 0;
  margin-bottom: 0.2rem;
`;

const Value = styled.p`
  font-size: 1.1rem;
  color: #2d3436;
  margin: 0;
  font-weight: 500;
`;

const MapContainer = styled(motion.div)`
  position: relative;
  height: 100%;
  min-height: 300px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const ContactUs = () => {
  const contactDetails = [
    {
      icon: <FaPhone />,
      label: "Phone",
      values: ["+88 01718410405", "+88 01716129057", "+88 01970432903"],
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      values: ["fiber@balticinspectionsurvey.com"],
    },
    {
      icon: <FaGlobe />,
      label: "Website",
      values: ["www.balticinspectionsurvey.com"],
    },
  ];

  return (
    <ContactContainer>
      <ContactGrid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
      >
        <ContactInfo>
          <ContactTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </ContactTitle>

          {contactDetails.map((item, index) => (
            <ContactItem
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <IconWrapper>{item.icon}</IconWrapper>
              <ContactText>
                <Label>{item.label}</Label>
                {item.values.map((value, idx) => (
                  <Value key={idx}>{value}</Value>
                ))}
              </ContactText>
            </ContactItem>
          ))}
        </ContactInfo>

        <MapContainer
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d767.7669201865201!2d90.43030097160892!3d23.742545697481635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9000950127d%3A0x83a66af4bbae3bfc!2z4Kau4Ka-4Kef4Ka-4KaV4Ka-4Kao4KaoIOCmpuCmvuCmsOCni-Cml-CmviDgpqzgpr7gp5zgpr8!5e0!3m2!1sen!2sbd!4v1731959789428!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </MapContainer>
      </ContactGrid>
    </ContactContainer>
  );
};

export default ContactUs;
