import React, { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { Box, Stack } from "@chakra-ui/layout";
import NodeModalViewDetails from "../NodeModal/NodeModalViewDetails";
import NodeModalAddParent from "../NodeModal/NodeModalAddParent";
import NodeModalAddPartner from "../NodeModal/NodeModalAddPartner";
import NodeModalAddChild from "../NodeModal/NodeModalAddChild";
import NodeModalEditInfo from "../NodeModal/NodeModalEditInfo";
import NodeContextMenu from "../NodeContextMenu/NodeContextMenu";
import NavBar from "../navbar/NavBar";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useDisclosure, Button } from "@chakra-ui/react"; 
import classes from "../login/login.module.css"
import images from "../../assets";

const Tree = lazy(() => import("react-d3-tree"));

// const convertToTree = (data) => {
//   const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));
//   let root = null;

//   data.forEach(item => {
//     if (!item.fatherId && !item.motherId && item.isAncestor) {
//       root = map.get(item.id);
//     } else {
//       const father = map.get(item.fatherId);
//       const mother = map.get(item.motherId);
//       if (father && !father.children.includes(map.get(item.id))) {
//         father.children.push(map.get(item.id));
//       }
//       if (mother && !mother.children.includes(map.get(item.id))) {
//         mother.children.push(map.get(item.id));
//       }
//     }
//     if (item.partnerId) {
//       const partner = map.get(item.partnerId);
//       if (partner) {
//         map.get(item.id).partner = partner;
//       }
//     }
//   });
//   return root;
// };

const convertToTree = (data) => {
  const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));
  let root = null;
  data.forEach(item => {
    if (!item.fatherId && !item.motherId && item.isAncestor) {
      root = map.get(item.id);
    } else {
      const father = map.get(item.fatherId);
      const mother = map.get(item.motherId);
      if (father && !father.children.includes(map.get(item.id))) {
        father.children.push(map.get(item.id));
      }
      if (mother && !mother.children.includes(map.get(item.id))) {
        mother.children.push(map.get(item.id));
      }
    }
    if (item.partnerId) {
      const partner = map.get(item.partnerId);
      if (partner) {
        const node = map.get(item.id);
        node.partner = { ...partner, partner: null }; 
        map.set(item.id, node);
      }
    }
  });

  return root;
};

const Home = () => {
  const [tree, setTree] = useState(null);
  const [node, setNode] = useState(null);
  const [avatars, setAvatars] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errors, setErrors] = useState(false);
  const { user, token } = useSelector(state => state.auth);
  const { familyTreeId } = useParams(); 
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchFamilyTree = async (familyTreeId) => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/api/family-member/${familyTreeId}`, {
        // headers: {
        //   "x-client-id": `${user.id}`,
        //   "Authorization": `${token}`
        // }
      });
      const convertedTree = convertToTree(response.data.metadata);
      setTree(convertedTree);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAvatar = async (familyTreeId) => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/api/upload/get-avatar/${familyTreeId}`, {});
      setAvatars(response.data.metadata);
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  useEffect(() => {
    if (familyTreeId) {
      fetchFamilyTree(familyTreeId);
      fetchAvatar(familyTreeId);
    }
  }, [familyTreeId]);

  const handleNodeClick = (datum, event) => {
    setNode(datum);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    onOpen();
  };

  const handleSubmitAddParent = async (formData) => {
    try {
      if (node.isAncestor) {
        await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-parent`,
          {
            ...formData,
            familyTreeId,
            id: node.id 
          },
        {
            headers: {
              "x-client-id": `${user.id}`,
              "Authorization": `${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        fetchFamilyTree(familyTreeId);
        fetchAvatar(familyTreeId);
        closeAddParentModal();
      } 
    } catch (error) {
      console.error("Error adding parent:", error);
    }
  };

  const openAddParentModal = () => {
    setIsAddParentModalOpen(true);
  };
  
  const closeAddParentModal = () => {
    setIsAddParentModalOpen(false);
  };
  
  const handleSubmitAddPartner = async (formData) => {
    try {
      const res = await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-partner`,
        {
          ...formData,
          familyTreeId,
          partnerId: node.id 
        },
      {
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      fetchFamilyTree(familyTreeId);
      fetchAvatar(familyTreeId);
      closeAddPartnerModal();
    } catch (error) {
      console.error("Error adding partner:", error);
    }
  };

  const openAddPartnerModal = () => {
    setIsAddPartnerModalOpen(true);
  };
  
  const closeAddPartnerModal = () => {
    setIsAddPartnerModalOpen(false);
  };

  const handleSubmitAddChild = async (formData) => {
    try {
      const res = await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-child`,
  {
          ...formData,
          familyTreeId,
          id: node.id 
        },
{
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      fetchFamilyTree(familyTreeId);
      fetchAvatar(familyTreeId);
      closeAddChildModal();
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  const openAddChildModal = () => {
    setIsAddChildModalOpen(true);
  };
  
  const closeAddChildModal = () => {
    setIsAddChildModalOpen(false);
  };

  const handleViewDetails = () => {
    setSelectedNode(node);
    onOpen();
  };

  const handleEditInfo = async (formData) => {
    try {
      await axios.patch(`http://localhost:4000/v1/api/family-member/${familyTreeId}/update-member/${node.id}`,
        {
          ...formData,
          familyTreeId
        },
        {
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      fetchFamilyTree(familyTreeId);
      fetchAvatar(familyTreeId);
      closeEditInfoModal();
    } catch (error) {
      console.error("Error updating info:", error);
    }
  };

  const openEditInfoModal = () => {
    setIsEditInfoModalOpen(true);
  };
  
  const closeEditInfoModal = () => {
    setIsEditInfoModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/v1/api/family-member/${familyTreeId}/delete-member/${node.id}`,
{
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`
          }
        }
      );
      fetchFamilyTree(familyTreeId);
      onClose();
    } catch (error) {
      console.error("Error delete member:", error);
    }
  };

  const openPreviewModal = () => {
    setIsPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
  };

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  
  const renderRectSvgNode = ({ nodeDatum }, click) => (
    <g>
      <g onClick={(event) => click(nodeDatum, event)}>
        {nodeDatum.partner && (
          <line
            x1="0"
            y1="0"
            x2="150"
            y2="0"
            stroke="black"
            strokeWidth="1"
          />
        )}
        {nodeDatum.gender === "Nam" ? (<image href={images.nodeMale} width="250" height="150" x="-125" y="-75" />) : (<image href={images.nodeFemale} width="250" height="150" x="-125" y="-75" />) }
        {avatars?.map((data) => {
          if (data.id === nodeDatum.id) {
            if (data.avatar) {
              return (
                <image key={data.id} href={`http://localhost:4000/${data.avatar}`} alt="" width="250" height="100" x="-125" y="-75" />
              )
            } else {
              return (
                <image key={data.id} href={data.gender === "Nam" ? images.defaultMaleAvatar : images.defaultFemaleAvatar} alt="" width="250" height="100" x="-125" y="-75" />
              )
            }
          }
        })}
        {nodeDatum.isAlive == false && (
          <image href={images.rip} width="60" height="150" x="-58" y="-80" />
        )}
        <foreignObject x="-125" y="30" width="250" height="30">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: "12px",
              color: "black",
              textAlign: "center"
            }}
          >
            <div>{truncateText(nodeDatum.name, 15)}</div>
            <div>{nodeDatum.relationship && !nodeDatum.isAncestor ? truncateText(nodeDatum.relationship, 15) : ''}</div>
            <div>{nodeDatum.isAncestor ? 'Tổ tiên' : ''}</div>
          </div>
        </foreignObject>
      </g>
      {nodeDatum.partner && (
        <g transform={'translate(150, 0)'} onClick={(event) => click(nodeDatum.partner, event)}>
          {nodeDatum.partner.gender === "Nam" ? (<image href={images.nodeMale} width="250" height="150" x="-125" y="-75" />) : (<image href={images.nodeFemale} width="250" height="150" x="-125" y="-75" />) }
          {avatars?.map((data) => {
            if (data.id === nodeDatum.partner.id) {
              if (data.avatar) {
                return (
                  <image key={data.id} href={`http://localhost:4000/${data.avatar}`} alt="" width="250" height="100" x="-125" y="-75" />
                )
              } else {
                return (
                  <image key={data.id} href={data.gender === "Nam" ? images.defaultMaleAvatar : images.defaultFemaleAvatar} alt="" width="250" height="100" x="-125" y="-75" />
                )
              }
            }
          })}
          {/* {nodeDatum.partner.isAlive == false && renderStripes(0, 0, 115)} */}
          {nodeDatum.isAlive == false && (
            <image href={images.rip} width="60" height="150" x="-58" y="-80" />
          )}
          <foreignObject x="-125" y="30" width="250" height="30">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "12px",
                color: "black",
                textAlign: "center"
              }}
            >             
              <div>{truncateText(nodeDatum.partner.name, 15)}</div>
              <div>{nodeDatum.partner.relationship && !nodeDatum.isAncestor ? truncateText(nodeDatum.partner.relationship, 15) : 'Vợ'}</div>
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );

  return (
    <Stack direction="row" spacing="md" bg="#e8c77b">
      <NavBar />
      <Box w="100%" h="100vh">
        {/* <Button as={Link} to={`/preview/${familyTreeId}`} colorScheme="teal" position="absolute" top="20px" right="20px">
          Preview
        </Button> */}
        {tree ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Tree
              data={tree}
              zoomable
              orientation="vertical"
              onNodeClick={handleNodeClick}
              translate={{ x: 200, y: 200 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize = {{ x: 200, y: 450 }}
              pathFunc="step"
              renderCustomNodeElement={(nodeInfo) =>
                renderRectSvgNode(nodeInfo, handleNodeClick)
              }
            />
            <Button as={Link} to={`/preview/${familyTreeId}`} colorScheme="teal" position="absolute" top="20px" right="20px">
              Preview
            </Button>
          </Suspense>
        ) : (
          <h1 style={{textAlign: "center", color: "#000", marginTop: "100px"}}>Chọn cây của bạn, nếu chưa có hãy tạo mới.</h1>
        )}
        {isOpen && (
          <NodeContextMenu
            x={menuPosition.x}
            y={menuPosition.y}
            node={node}
            onAddParent={openAddParentModal}
            onAddPartner={openAddPartnerModal}
            onAddChild={openAddChildModal}
            onViewDetails={handleViewDetails}
            onEdit={openEditInfoModal}
            onDelete={handleDelete}
            onClose={onClose}
          />
        )}
        {selectedNode && (
          <NodeModalViewDetails
            isOpen={Boolean(selectedNode)}
            onClose={() => setSelectedNode(null)}
            node={selectedNode}
          />
        )}
        <NodeModalAddParent
          isOpen={isAddParentModalOpen}
          onClose={closeAddParentModal}
          onSubmit={handleSubmitAddParent}
        />
        <NodeModalAddPartner
          isOpen={isAddPartnerModalOpen}
          onClose={closeAddPartnerModal}
          onSubmit={handleSubmitAddPartner}
        />
        <NodeModalAddChild 
          isOpen={isAddChildModalOpen}
          onClose={closeAddChildModal}
          onSubmit={handleSubmitAddChild}
        />
        <NodeModalEditInfo 
          isOpen={isEditInfoModalOpen}
          onClose={closeEditInfoModal}
          onSubmit={handleEditInfo}
          initialData={node}
        />
      </Box>
      {errors && 
        <div className={classes.errorMessage}>
          Vợ/chồng đã tồn tại! Vui lòng thử lại.
        </div>
      }
    </Stack>
  );
};

export default Home;
