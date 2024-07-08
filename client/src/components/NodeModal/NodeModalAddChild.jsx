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
import { parse, isAfter, isValid } from 'date-fns';
import classes from "./NodeModal.module.css"

const parseDate = (value, originalValue) => {
  const formats = ['dd/MM/yyyy', 'yyyy', 'MM/yyyy'];
  let date = null;

  for (const formatStr of formats) {
    date = parse(originalValue, formatStr, new Date());
    if (isValid(date)) {
      return date;
    }
  }

  return new Date('');
};

const schema = yup.object().shape({
  name: yup.string()
    .required('Họ tên người dùng là bắt buộc')
    .max(50, 'Họ tên không được vượt quá 50 ký tự'),
  gender: yup.string().required('Giới tính là bắt buộc'),
  relationship: yup.string().required('Quan hệ là bắt buộc'),
  isAlive: yup.string().required('Tình trạng là bắt buộc'),
  deathOfBirth: yup.string()
    .nullable()
    .test(
      'is-greater',
      'Ngày mất phải sau ngày sinh',
      function (value) {
        const { dateOfBirth, isAlive } = this.parent;
        if (isAlive === 'false' && value) {
          const dateOfBirthParsed = parseDate(dateOfBirth, dateOfBirth);
          const deathOfBirthParsed = parseDate(value, value);
          return isAfter(deathOfBirthParsed, dateOfBirthParsed);
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
    const formData = {
      ...data,
      avatar: data.avatar && data.avatar.length > 0 ? data.avatar[0] : null, 
    };
    onSubmit(formData);
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
            <FormControl>
              <FormLabel>Ảnh</FormLabel>
              <Input
                sx={{border: 'none'}}
                type="file"
                name="avatar"
                {...register('avatar')}
              />
            </FormControl>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Họ tên <span className={classes.required}>*</span></FormLabel>
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
              <FormLabel>Ngày sinh (Nhập theo định dạng ngày/tháng/năm)</FormLabel>
              <Input
                type="text"
                name="dateOfBirth"
                {...register('dateOfBirth')}
              />
              {errors.dateOfBirth && <p className={classes.error}>{errors.dateOfBirth.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.gender}>
              <FormLabel>Giới tính</FormLabel>
              <Select
                placeholder="-Chọn giới tính-"
                name="gender"
                {...register('gender')}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Select>
              {errors.gender && <p className={classes.error}>{errors.gender.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.relationship}>
              <FormLabel>Quan hệ</FormLabel>
              <Select
                placeholder="-Chọn quan hệ-"
                name="relationship"
                {...register('relationship')}
              >
                <option value="Con đẻ">Con đẻ</option>
                <option value="Con nuôi">Con nuôi</option>
              </Select>
              {errors.relationship && <p className={classes.error}>{errors.relationship.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.isAlive}>
              <FormLabel>Tình trạng</FormLabel>
              <Select
                placeholder="-Chọn tình trạng-"
                name="isAlive"
                {...register('isAlive')}
                onChange={handleIsAliveChange}
              >
                <option value="true">Còn sống</option>
                <option value="false">Đã mất</option>
              </Select>
              {errors.isAlive && <p className={classes.error}>{errors.isAlive.message}</p>}
            </FormControl>
            {isAlive === 'false' ? (
              <FormControl>
                <FormLabel>Ngày mất</FormLabel>
                <Input
                  type="text"
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
