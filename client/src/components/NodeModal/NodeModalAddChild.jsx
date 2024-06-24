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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import classes from "./NodeModal.module.css"

const schema = yup.object().shape({
  name: yup.string()
    .required('Họ tên người dùng là bắt buộc')
    .max(50, 'Họ tên không được vượt quá 100 ký tự'),
  dateOfBirth: yup.date().required('Ngày sinh là bắt buộc'),
  gender: yup.string().required('Giới tính là bắt buộc'),
  isAlive: yup.string().required('Tình trạng là bắt buộc'),
  deathOfBirth: yup.date()
    .nullable()
    .test(
      'is-greater',
      'Ngày mất phải sau ngày sinh',
      function (value) {
        const { dateOfBirth, isAlive } = this.parent;
        if (isAlive === 'false' && value) {
          return value > dateOfBirth;
        }
        return true;
      }
    )
    .test(
      'is-not-allowed',
      'Ngày mất không thể có vì tình trạng hiện là còn sống',
      function (value) {
        const { isAlive } = this.parent;
        if (isAlive === 'true' && value) {
          return false;
        }
        return true;
      }
    ),
});

const NodeModalAddChild = ({ isOpen, onClose, onSubmit }) => {
  const [isAlive, setIsAlive] = useState('true');

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

  const handleIsAliveChange = (e) => {
    setIsAlive(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader sx={{ borderBottom: '1px solid #ccc' }}>Thêm con</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Họ tên</FormLabel>
              <Input
                name="name"
                {...register('name')}
              />
              {errors.name && <p className={classes.error}>{errors.name.message}</p>}
            </FormControl>
            <FormControl>
              <FormLabel>Căn cước công dân</FormLabel>
              <Input
                name="citizenIdentification"
                {...register('citizenIdentification')}
              />
            </FormControl>
            <FormControl isInvalid={errors.dateOfBirth}>
              <FormLabel>Ngày sinh</FormLabel>
              <Input
                type="date"
                name="dateOfBirth"
                {...register('dateOfBirth')}
              />
              {errors.dateOfBirth && <p className={classes.error}>{errors.dateOfBirth.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.gender}>
              <FormLabel>Giới tính</FormLabel>
              <Select
                placeholder=" "
                name="gender"
                {...register('gender')}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Select>
              {errors.gender && <p className={classes.error}>{errors.gender.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.isAlive}>
              <FormLabel>Tình trạng</FormLabel>
              <Select
                placeholder=" "
                name="isAlive"
                {...register('isAlive')}
                onChange={handleIsAliveChange}
              >
                <option value="true">Còn sống</option>
                <option value="false">Đã mất</option>
              </Select>
              {errors.isAlive && <p className={classes.error}>{errors.isAlive.message}</p>}
            </FormControl>
            {/* <FormControl>
              <FormLabel>Ngày mất</FormLabel>
              <Input
                type="date"
                name="deathOfBirth"
                {...register('deathOfBirth')}
                disabled={isAlive === 'true'}
              />
              {errors.deathOfBirth && <p className={classes.error}>{errors.deathOfBirth.message}</p>}
            </FormControl> */}
            {isAlive === 'false' ? (
              <FormControl>
                <FormLabel>Ngày mất</FormLabel>
                <Input
                  type="date"
                  name="deathOfBirth"
                  {...register('deathOfBirth')}
                  disabled={isAlive === 'true'}
                />
                {errors.deathOfBirth && <p className={classes.error}>{errors.deathOfBirth.message}</p>}
              </FormControl>
            ) : (
              <div></div>
            )}
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

export default NodeModalAddChild;
