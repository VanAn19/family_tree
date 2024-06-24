import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { Box, List, ListItem, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, Input, Button } from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import NodeModalAddFamilyTree from '../NodeModal/NodeModalAddFamilyTree';
import classes from "./navbar.module.css"

const NavBar = () => {
  const [familyTrees, setFamilyTrees] = useState([]);
  const [isAddFamilyTreeModalOpen, setIsAddFamilyTreeModalOpen] = useState(false);
  const [editingTreeId, setEditingTreeId] = useState(null);
  const [editingTreeName, setEditingTreeName] = useState('');
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);

  const openAddFamilyTreeModal = () => {
    setIsAddFamilyTreeModalOpen(true);
  };
  
  const closeAddFamilyTreeModal = () => {
    setIsAddFamilyTreeModalOpen(false);
  };

  const handleSubmitAddFamilyTree = async (formData) => {
    try {
      await axios.post(`http://localhost:4000/v1/api/family-tree/create`, {...formData}, {
        headers: {
          "x-client-id": `${user.id}`,
          "Authorization": `${token}`
        }
      });
      fetchFamilyTrees();
      closeAddFamilyTreeModal();
    } catch (error) {
      console.error("Error adding family tree:", error);
    }
  }

  const fetchFamilyTrees = async () => {
    try {
      const response = await axios.get('http://localhost:4000/v1/api/family-tree', {
        headers: {
          'x-client-id': `${user.id}`,
          'Authorization': `${token}`
        }
      });
      setFamilyTrees(response.data.metadata.familyTree);
    } catch (error) {
      console.error('Error fetching family trees:', error);
    }
  };

  useEffect(() => {
    fetchFamilyTrees();
  }, [user.id, token]);

  const handleSelectTree = (id) => {
    setSelectedTreeId(id);
    navigate(`/home/${id}`);
  };

  const handleEditTree = (id, name) => {
    setEditingTreeId(id);
    setEditingTreeName(name);
  };

  const handleSaveEditTree = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/v1/api/family-tree/update/${id}`, { name: editingTreeName }, {
        headers: {
          'x-client-id': `${user.id}`,
          'Authorization': `${token}`
        }
      });
      fetchFamilyTrees();
      setEditingTreeId(null);
    } catch (error) {
      console.error('Error updating family tree:', error);
    }
  };

  const handleDeleteTree = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/v1/api/family-tree/delete/${id}`, {
        headers: {
          'x-client-id': `${user.id}`,
          'Authorization': `${token}`
        }
      });
      fetchFamilyTrees();
    } catch (error) {
      console.error('Error deleting family tree:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:4000/v1/api/logout`, {}, {
        headers: {
          "x-client-id": `${user.id}`,
          "Authorization": `${token}`
        }
      });
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box w="250px" h="100vh" p="4" bg="gray.200" sx={{borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <Box>
        <div className={classes.user}>Xin chào, {user.name}</div>
        <div className={classes.icon} onClick={openAddFamilyTreeModal}>        
          <AddIcon/>
        </div>
        <List spacing={3}>
          {familyTrees.map(tree => (
            <ListItem 
              key={tree.id} 
              className={`${classes.node} ${selectedTreeId === tree.id ? classes.selectedNode : ''}`}
            >
              {editingTreeId === tree.id ? (
                <Input
                  value={editingTreeName}
                  onChange={(e) => setEditingTreeName(e.target.value)}
                  onBlur={() => handleSaveEditTree(tree.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEditTree(tree.id);
                    }
                  }}
                />
              ) : (
                <Link className={classes.nodeChild} onClick={() => handleSelectTree(tree.id)}>
                  {tree.name}
                </Link>
              )}
              <Menu>
                <MenuButton as={IconButton} icon={<SettingsIcon />} variant="none" />
                <MenuList>
                  <MenuItem onClick={() => handleEditTree(tree.id)}>Đổi tên</MenuItem>
                  <MenuItem onClick={() => handleDeleteTree(tree.id)}>Xóa</MenuItem>
                </MenuList>
              </Menu>
            </ListItem>
          ))}
        </List>
        <NodeModalAddFamilyTree
          isOpen={isAddFamilyTreeModalOpen}
          onClose={closeAddFamilyTreeModal}
          onSubmit={handleSubmitAddFamilyTree}
        />
      </Box>
      <Button onClick={handleLogout} colorScheme="red" mt="auto">
        Đăng xuất
      </Button>
    </Box>
  );
};

export default NavBar;
