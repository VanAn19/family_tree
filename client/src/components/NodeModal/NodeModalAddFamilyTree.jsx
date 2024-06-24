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
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import classes from "./NodeModal.module.css";

const schema = yup.object().shape({
  name: yup.string()
    .required('Tên gia phả là bắt buộc')
    .max(50, 'Tên gia phả không được vượt quá 50 ký tự'),
  ancestorName: yup.string().required('Họ tên tổ tiên là bắt buộc')
});

const NodeModalAddFamilyTree = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader sx={{ borderBottom: '1px solid #ccc' }}>Tạo cây mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Tên gia phả</FormLabel>
              <Input
                name="name"
                {...register('name')}
              />
              {errors.name && <p className={classes.error}>{errors.name.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.ancestorName}>
              <FormLabel>Họ tên tổ tiên</FormLabel>
              <Input
                name="ancestorName"
                {...register('ancestorName')}
              />
              {errors.ancestorName && <p className={classes.error}>{errors.ancestorName.message}</p>}
            </FormControl>
            <ModalFooter>
              <Button
                color="blue.500"
                variant="solid"
                type="submit"
              >
                Thêm
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NodeModalAddFamilyTree;
