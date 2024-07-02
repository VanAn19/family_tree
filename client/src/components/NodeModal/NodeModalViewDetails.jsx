import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import axios from "axios";
import { FormControl, FormLabel, Flex, Box, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import images from "../../assets";

const NodeModalViewDetails = ({ isOpen, onClose, node }) => {

  const [partner, setPartner] = useState('')
  const { familyTreeId } = useParams(); 
  const { user, token } = useSelector(state => state.auth);

  const fetchPartner = async (partnerId, familyTreeId) => {
    try {
        const response = await axios.get(`http://localhost:4000/v1/api/family-member/${familyTreeId}/${partnerId}`, {
            headers: {
                "x-client-id": `${user.id}`,
                "Authorization": `${token}`
            }
        });
        setPartner(response.data.metadata);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (node?.partnerId) {
      fetchPartner(node.partnerId, familyTreeId);
    }
  }, [node]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#e8c77b">
        <ModalHeader sx={{borderBottom: '1px solid #000'}}>Thông tin chi tiết</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flex="1">
              <FormControl>
                <FormLabel>Tên: { node.name ? node.name : 'Không có' }</FormLabel>
                <FormLabel>Căn cước công dân: { node.citizenIdentification ? node.citizenIdentification : 'Không có' }</FormLabel>
                <FormLabel>Giới tính: { node.gender ? node.gender : 'Không có' }</FormLabel>
                <FormLabel>Quan hệ: { node.relationship ? node.relationship : 'Không có' }</FormLabel>
                <FormLabel>Ngày sinh: { node.dateOfBirth ? format(new Date(node.dateOfBirth), 'dd/MM/yyyy') : 'Không có' }</FormLabel>
                <FormLabel>Tình trạng: { node.isAlive === 1 ? 'Còn sống' : 'Đã mất' }</FormLabel>
                {!node.isAlive && (
                    <FormLabel>Ngày mất: {node.deathOfBirth ? format(new Date(node.deathOfBirth), 'dd/MM/yyyy') : 'Không có' }</FormLabel>
                )}
                {node.gender === "Nam" && (
                    <FormLabel>{ partner ? `Vợ: ${partner.name}` : 'Vợ: Không có' }</FormLabel>
                )}
                {node.gender === "Nữ" && (
                    <FormLabel>{ partner ? `Chồng: ${partner.name}` : 'Chồng: Không có' }</FormLabel>
                )}
              </FormControl>
            </Box>
            <Box>
              {node.avatar && (
                <Image src={`http://localhost:4000/${node.avatar}`} alt="" boxSize="100px" objectFit="cover" />
              )}
              {!node.avatar && node.gender === "Nam" && (
                <Image src={images.defaultMaleAvatar} alt="" boxSize="100px" objectFit="cover"  />
              )}
              {!node.avatar && node.gender === "Nữ" && (
                <Image src={images.defaultFemaleAvatar} alt="" boxSize="100px" objectFit="cover"  />
              )}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NodeModalViewDetails;