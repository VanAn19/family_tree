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
import { FormControl, FormLabel, Input, Select, Image } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { parse, isAfter, isValid } from 'date-fns';
import React, { useEffect } from "react";
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
  dateOfBirth: yup.string()
    .test(
      'is-valid-date',
      'Ngày sinh không hợp lệ',
      function (value) {
        const date = parseDate(value, value);
        return isValid(date);
      }
    ),
  gender: yup.string().required('Giới tính là bắt buộc'),
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

const NodeModalEditInfo = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: "",
      name: "",
      citizenIdentification: "",
      dateOfBirth: "",
      gender: "",
      job: "",
      isAlive: "",
      deathOfBirth: "",
      familyTreeId: "",
      fatherId: "" 
    },
  });

  useEffect(() => {
    if (initialData) {
      for (const key in initialData) {
        setValue(key, initialData[key]);
      }
      setValue('isAlive', initialData.isAlive ? "true" : "false");
    }
  }, [initialData, setValue]);

  const isAlive = watch('isAlive');

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      avatar: data.avatar && data.avatar.length > 0 ? data.avatar[0] : null, 
    };
    onSubmit(formData);
    reset();
  };

  const handleClose = () => {
    reset(initialData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader sx={{ borderBottom: '1px solid #ccc' }}>Sửa thông tin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl>
              <FormLabel>Ảnh</FormLabel>
              {initialData?.avatar && (
                <Image src={`http://localhost:4000/${initialData.avatar}`} alt="" boxSize="100px" objectFit="cover" marginLeft="17px" />
              )}
              <Input
                sx={{border: 'none', marginTop: '5px'}}
                type="file"
                name="avatar" 
                {...register('avatar')}
              />
            </FormControl>
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
                placeholder=" "
                name="gender"
                {...register('gender')}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Select>
              {errors.gender && <p className={classes.error}>{errors.gender.message}</p>}
            </FormControl>
            {!initialData?.isAncestor && (
              <FormControl isInvalid={errors.relationship}>
                <FormLabel>Quan hệ</FormLabel>
                <Select
                  placeholder=" "
                  name="relationship"
                  {...register('relationship')}
                >
                  <option value="Con đẻ">Con đẻ</option>
                  <option value="Con nuôi">Con nuôi</option>
                </Select>
                {errors.relationship && <p className={classes.error}>{errors.relationship.message}</p>}
              </FormControl>
            )}
            <FormControl isInvalid={errors.isAlive}>
              <FormLabel>Tình trạng</FormLabel>
              <Select
                placeholder=" "
                name="isAlive"
                {...register('isAlive')}
              >
                <option value="true">Còn sống</option>
                <option value="false">Đã mất</option>
              </Select>
              {errors.isAlive && <p className={classes.error}>{errors.isAlive.message}</p>}
            </FormControl>
            {isAlive === 'false' ? (
              <FormControl>
                <FormLabel>Ngày mất (Nhập theo định dạng ngày/tháng/năm)</FormLabel>
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
                Sửa
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NodeModalEditInfo;