import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import { Tree } from 'react-d3-tree'; 

const PreviewModal = ({ isOpen, onClose, treeData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Preview Family Tree</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {treeData && (
            <Tree
              data={treeData}
              zoomable
              orientation="vertical"
              translate={{ x: 200, y: 200 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize={{ x: 200, y: 450 }}
              pathFunc="step"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreviewModal;
