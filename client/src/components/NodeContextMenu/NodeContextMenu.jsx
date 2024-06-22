import React, { useRef } from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button, Box } from "@chakra-ui/react";

const NodeContextMenu = ({ x, y, onAddPartner, onAddChild, onViewDetails, onEdit, onDelete, onClose }) => {
  const menuRef = useRef();

  const handleBlur = (event) => {
    if (!menuRef.current.contains(event.relatedTarget)) {
      onClose();
    }
  };

  return (
    <Box position="absolute" top={`${y}px`} left={`${x}px`} ref={menuRef} onBlur={handleBlur} tabIndex={-1}>
      <Menu isOpen={true}>
        <MenuList>
          <MenuItem onClick={onViewDetails}>Xem chi tiết</MenuItem>
          <MenuItem onClick={onAddPartner}>Thêm vợ/chồng</MenuItem>
          <MenuItem onClick={onAddChild}>Thêm con</MenuItem>
          <MenuItem onClick={onEdit}>Sửa</MenuItem>
          <MenuItem onClick={onDelete}>Xóa</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default NodeContextMenu;
