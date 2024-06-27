import React, { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { Box, Stack, Text, Square } from "@chakra-ui/layout";
import NodeModalViewDetails from "../NodeModal/NodeModalViewDetails";
import NodeModalAddPartner from "../NodeModal/NodeModalAddPartner";
import NodeModalAddChild from "../NodeModal/NodeModalAddChild";
import NodeModalEditInfo from "../NodeModal/NodeModalEditInfo";
import NodeContextMenu from "../NodeContextMenu/NodeContextMenu";
import NavBar from "../navbar/NavBar";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react"; 
// import image from "../../assets/node.jpg"
import classes from "./home.module.css"
import images from "../../assets";

const Tree = lazy(() => import("react-d3-tree"));

const bfs = (id, tree, node) => {
  const queue = [tree];
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (curNode.attributes?.id === id) {
      curNode.children.push(node);
      return { ...tree };
    }
    curNode.children.forEach(child => queue.unshift(child));
  }
};

// const convertToTree = (data) => {
//   const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));

//   let root = null;

//   data.forEach(item => {
//     if (!item.fatherId && !item.motherId && item.isAncestor) {
//       root = map.get(item.id);
//     } else {
//       const parent = map.get(item.fatherId) || map.get(item.motherId);
//       if (parent) {
//         parent.children.push(map.get(item.id));
//       }
//     }
//   });

//   return root;
// };

const convertToTree = (data) => {
  const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));
  let root = null;

  data.forEach(item => {
    // console.log(item);
    if (!item.fatherId && !item.motherId && item.isAncestor) {
      root = map.get(item.id);
    } else {
      const father = map.get(item.fatherId);
      const mother = map.get(item.motherId);
      if (father) {
        father.children.push(map.get(item.id));
      }
      if (mother) {
        mother.children.push(map.get(item.id));
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
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const { user, token } = useSelector(state => state.auth);
  const { familyTreeId } = useParams(); 
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchFamilyTree = async (familyTreeId) => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/api/family-member/${familyTreeId}`, {
        headers: {
          "x-client-id": `${user.id}`,
          "Authorization": `${token}`
        }
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
  
  const handleSubmitAddPartner = async (formData) => {
    try {
      await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-partner`,
        {
          ...formData,
          familyTreeId,
          partnerId: node.id 
        },
      {
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`
          }
        }
      );
      fetchFamilyTree(familyTreeId);
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
    // console.log(formData);
    try {
      // const data = new FormData();
      // for (const [key, value] of Object.entries(formData)) {
      //   data.append(key, value);
      // }
      await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-child`,
  {
          ...formData,
          familyTreeId,
          id: node.id 
          // ...data,
          // familyTreeId,
          // id: node.id 
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

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  

  const renderRectSvgNode = ({ nodeDatum }, click) => (
    <g onClick={(event) => click(nodeDatum, event)}>
      {nodeDatum.gender === "Nam" && (
        <image href={images.nodeMale} width="250" height="150" x="-125" y="-125" />
      )}
      {nodeDatum.gender === "Nữ" && (
        <image href={images.nodeFemale} width="250" height="150" x="-125" y="-125" />
      )}
      {/* <text fill="black" x="0" y="0" fontSize="12" textAnchor="middle" fontFamily="Roboto" fontWeight="lighter">{truncateText(nodeDatum.name, 15)}</text> */}
      <foreignObject x="-125" y="-10" width="250" height="30">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            display: "flex",
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
          {truncateText(nodeDatum.name, 15)}
        </div>
      </foreignObject>
      {avatars.map((data) => {
        if (data.id === nodeDatum.id) {
          if (data.avatar) {
            return (
              <image key={data.id} href={`http://localhost:4000/${data.avatar}`} alt="" width="250" height="100" x="-125" y="-125" />
            )
          } else {
            if (data.gender === "Nam") {
              return (
                <image key={data.id} href={images.defaultMaleAvatar} alt="" width="250" height="100" x="-125" y="-125" />
              )
            }
            if (data.gender === "Nữ") {
              return (
                <image key={data.id} href={images.defaultFemaleAvatar} alt="" width="250" height="100" x="-125" y="-125" />
              )
            }
          }
        }
      })}
    </g>
    );

  return (
    <Stack direction="row" spacing="md" bg="#e8c77b">
      <NavBar />
      <Box w="100%" h="100vh">
        {tree ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Tree
              data={tree}
              zoomable
              orientation="vertical"
              onNodeClick={handleNodeClick}
              translate={{ x: 200, y: 200 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize = {{ x: 100, y: 450 }}
              renderCustomNodeElement={(nodeInfo) =>
                renderRectSvgNode(nodeInfo, handleNodeClick)
              }
            />
          </Suspense>
        ) : (
          // <div>Please select a family tree.</div>
          <h1 style={{textAlign: "center", color: "#000", marginTop: "100px"}}>Chọn cây của bạn, nếu chưa có hãy tạo mới.</h1>
        )}
        {isOpen && (
          <NodeContextMenu
            x={menuPosition.x}
            y={menuPosition.y}
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
        {/* <NodeModal
          isOpen={Boolean(node)}
          onClose={() => setNode(null)}
          onSubmit={handleSubmit}
        /> */}
      </Box>
    </Stack>
  );
};

export default Home;
