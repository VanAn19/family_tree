import React, { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { Box, Stack } from "@chakra-ui/layout";
import NodeModalViewDetails from "../NodeModal/NodeModalViewDetails";
import NodeModalAddPartner from "../NodeModal/NodeModalAddPartner";
import NodeModalAddChild from "../NodeModal/NodeModalAddChild";
import NodeModalEditInfo from "../NodeModal/NodeModalEditInfo";
import NodeContextMenu from "../NodeContextMenu/NodeContextMenu";
import NavBar from "../navbar/NavBar";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react"; 
import image from "../../assets/node.jpg"

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

const convertToTree = (data) => {
  const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));

  let root = null;

  data.forEach(item => {
    if (!item.fatherId && !item.motherId && item.isAncestor) {
      root = map.get(item.id);
    } else {
      const parent = map.get(item.fatherId) || map.get(item.motherId);
      if (parent) {
        parent.children.push(map.get(item.id));
      }
    }
  });

  return root;
};

// const convertToTree = (data) => {
//   const map = new Map(data.map(item => [item.id, { ...item, children: [] }]));
//   let root = null;

//   data.forEach(item => {
//     console.log(item);
//     if (!item.fatherId && !item.motherId && item.isAncestor) {
//       root = map.get(item.id);
//     } else {
//       const father = map.get(item.fatherId);
//       const mother = map.get(item.motherId);
//       if (father) {
//         father.children.push(map.get(item.id));
//       }
//       if (mother) {
//         mother.children.push(map.get(item.id));
//       }
//     }
//   });

//   return root;
// };

const Home = () => {
  const [tree, setTree] = useState(null);
  const [node, setNode] = useState(null);
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

  useEffect(() => {
    if (familyTreeId) {
      fetchFamilyTree(familyTreeId);
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
    try {
      await axios.post(`http://localhost:4000/v1/api/family-member/${familyTreeId}/add-child`,
  {
          ...formData,
          familyTreeId,
          fatherId: node.id 
        },
{
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`
          }
        }
      );
      fetchFamilyTree(familyTreeId);
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
        formData,
        {
          headers: {
            "x-client-id": `${user.id}`,
            "Authorization": `${token}`
          }
        }
      );
      fetchFamilyTree(familyTreeId);
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

  const renderRectSvgNode = ({ nodeDatum }, click) => (
    <g onClick={(event) => click(nodeDatum, event)}>
      <image href={image} width="200" height="100" x="-100" y="-70" />
      <text fill="black" x="0" y="-15" fontSize="12" textAnchor="middle">{`${nodeDatum.name}`}</text>
      {/* <text fill="black" x="-95" y="15" fontSize="12">{`Gender: ${nodeDatum.gender}`}</text> */}
      {nodeDatum.attributes && (
        <>
          <text fill="black" x="-95" y="30" fontSize="12">{`ID: ${nodeDatum.attributes.id}`}</text>
        </>
      )}
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
              nodeSize = {{ x: 200, y: 200 }}
              renderCustomNodeElement={(nodeInfo) =>
                renderRectSvgNode(nodeInfo, handleNodeClick)
              }
            />
          </Suspense>
        ) : (
          // <div>Please select a family tree.</div>
          <h1 style={{textAlign: "center", color: "#fff", marginTop: "100px"}}>Chọn cây của bạn, nếu chưa có hãy tạo mới.</h1>
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
