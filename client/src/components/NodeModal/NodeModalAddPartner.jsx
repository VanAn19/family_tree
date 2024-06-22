import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import React, { useState } from "react";

const NodeModalAddPartner = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    citizenIdentification: "",
    dateOfBirth: "",
    gender: "",
    job: "",
    isAlive: "",
    deathOfBirth: "",
    familyTreeId: "",
    partnerId: "" 
  });

  const clearForm = () => {
    setFormData({
      name: "",
      citizenIdentification: "",
      dateOfBirth: "",
      gender: "",
      job: "",
      isAlive: "",
      deathOfBirth: "",
      familyTreeId: "",
      fatherId: "" 
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    clearForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader sx={{borderBottom: '1px solid #ccc'}}>Thêm vợ/chồng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Họ tên</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Căn cước công dân</FormLabel>
            <Input
              name="citizenIdentification"
              value={formData.citizenIdentification}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Ngày sinh</FormLabel>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Giới tính</FormLabel>
            <Select placeholder=' ' name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Tình trạng</FormLabel>
            <Select placeholder=' ' name="isAlive" value={formData.isAlive} onChange={handleChange}>
              <option value="true">Còn sống</option>
              <option value="false">Đã mất</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Ngày mất</FormLabel>
            <Input
              type="date"
              name="deathOfBirth"
              value={formData.deathOfBirth}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="blue.500"
            variant="solid"
            onClick={handleSubmit}
            disabled={!formData.name}
          >
            Thêm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NodeModalAddPartner;
