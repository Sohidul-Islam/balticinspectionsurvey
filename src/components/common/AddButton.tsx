import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
}

const AddButton = ({
  onClick,
  label = "Add",
  icon = <FaPlus />,
}: AddButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <ButtonContent>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <span>{label}</span>
      </ButtonContent>
      <ButtonGlow />
    </StyledButton>
  );
};

const StyledButton = styled(motion.button)`
  position: relative;
  background: linear-gradient(135deg, #1a2b6d 0%, #2a4fa8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);

  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
`;

const ButtonGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;

  ${StyledButton}:hover & {
    opacity: 1;
  }
`;

export default AddButton;
