import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { footerService } from "../../services/api";

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: #2d3436;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 1rem;
`;

const ServiceCard = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

interface FooterData {
  addresses: string[];
  phones: string[];
  email: string;
  keyServices: {
    title: string;
    description: string;
    image: string;
  }[];
}

const FooterManager = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    addresses: [""],
    phones: [""],
    email: "",
    keyServices: [],
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await footerService.getFooterData();
      setFooterData(response.data);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  const handleAddAddress = () => {
    setFooterData({
      ...footerData,
      addresses: [...footerData.addresses, ""],
    });
  };

  const handleAddPhone = () => {
    setFooterData({
      ...footerData,
      phones: [...footerData.phones, ""],
    });
  };

  const handleAddService = () => {
    setFooterData({
      ...footerData,
      keyServices: [
        ...footerData.keyServices,
        { title: "", description: "", image: "" },
      ],
    });
  };

  const handleSave = async () => {
    try {
      await footerService.updateFooterData(footerData);
      alert("Footer data saved successfully!");
    } catch (error) {
      console.error("Error saving footer data:", error);
      alert("Error saving footer data");
    }
  };

  return (
    <Container>
      <h2>Footer Management</h2>

      <FormSection>
        <h3>Addresses</h3>
        {footerData.addresses.map((address, index) => (
          <FormGroup key={index}>
            <Label>Address {index + 1}</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => {
                const newAddresses = [...footerData.addresses];
                newAddresses[index] = e.target.value;
                setFooterData({ ...footerData, addresses: newAddresses });
              }}
            />
          </FormGroup>
        ))}
        <Button
          onClick={handleAddAddress}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Address
        </Button>
      </FormSection>

      <FormSection>
        <h3>Contact Information</h3>
        {footerData.phones.map((phone, index) => (
          <FormGroup key={index}>
            <Label>Phone {index + 1}</Label>
            <Input
              type="text"
              value={phone}
              onChange={(e) => {
                const newPhones = [...footerData.phones];
                newPhones[index] = e.target.value;
                setFooterData({ ...footerData, phones: newPhones });
              }}
            />
          </FormGroup>
        ))}
        <Button
          onClick={handleAddPhone}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Phone
        </Button>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={footerData.email}
            onChange={(e) =>
              setFooterData({ ...footerData, email: e.target.value })
            }
          />
        </FormGroup>
      </FormSection>

      <FormSection>
        <h3>Key Services</h3>
        {footerData.keyServices.map((service, index) => (
          <ServiceCard key={index}>
            <FormGroup>
              <Label>Service Title</Label>
              <Input
                type="text"
                value={service.title}
                onChange={(e) => {
                  const newServices = [...footerData.keyServices];
                  newServices[index] = {
                    ...service,
                    title: e.target.value,
                  };
                  setFooterData({ ...footerData, keyServices: newServices });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={service.description}
                onChange={(e) => {
                  const newServices = [...footerData.keyServices];
                  newServices[index] = {
                    ...service,
                    description: e.target.value,
                  };
                  setFooterData({ ...footerData, keyServices: newServices });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image URL</Label>
              <Input
                type="text"
                value={service.image}
                onChange={(e) => {
                  const newServices = [...footerData.keyServices];
                  newServices[index] = {
                    ...service,
                    image: e.target.value,
                  };
                  setFooterData({ ...footerData, keyServices: newServices });
                }}
              />
            </FormGroup>
          </ServiceCard>
        ))}
        <Button
          onClick={handleAddService}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Service
        </Button>
      </FormSection>

      <Button
        onClick={handleSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Footer Data
      </Button>
    </Container>
  );
};

export default FooterManager;
