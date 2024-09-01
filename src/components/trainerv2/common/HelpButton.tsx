import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { IoHelpCircle } from "react-icons/io5";

export interface HelpButtonProps {
  title: string;
  children: React.ReactNode;
  ariaLabel: string;
}

export default function HelpButton({
  title,
  children,
  ariaLabel,
}: HelpButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        variant="ghost"
        colorScheme="blue"
        icon={<Icon as={IoHelpCircle} boxSize={6} />}
        aria-label={ariaLabel}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
