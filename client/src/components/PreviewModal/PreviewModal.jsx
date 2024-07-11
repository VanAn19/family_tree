import React, { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import { Box, Stack } from "@chakra-ui/layout";
import { useParams, Link } from "react-router-dom";
import { Button } from "@chakra-ui/react"; 
import { LinkIcon } from '@chakra-ui/icons'
import { useSelector } from "react-redux";
import images from "../../assets";

const Tree = lazy(() => import("react-d3-tree"));

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

const PreviewModal = () => {

  const [tree, setTree] = useState(null);
  const [avatars, setAvatars] = useState(null);
  const { user } = useSelector(state => state.auth);
  const { familyTreeId } = useParams();  

  const fetchFamilyTree = async (familyTreeId) => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/api/family-member/${familyTreeId}`, {});
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

  const shareLink = `${window.location.origin}/preview/${familyTreeId}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Copy đường dẫn thành công');
  };

  useEffect(() => {
    if (familyTreeId) {
      fetchFamilyTree(familyTreeId);
      fetchAvatar(familyTreeId);
    }
  }, [familyTreeId]);

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  const renderStripes = (x, y, width) => (
    <>
      <path d={`M${x - width / 2},${y - 70} C${x - width / 4},${y - 55} ${x + width / 4},${y - 55} ${x + width / 2},${y - 70}`} stroke="gray" strokeWidth="2" fill="none" />
      <path d={`M${x - width / 2},${y - 65} C${x - width / 4},${y - 50} ${x + width / 4},${y - 50} ${x + width / 2},${y - 65}`} stroke="gray" strokeWidth="2" fill="none" />
      <path d={`M${x - width / 2},${y - 60} C${x - width / 4},${y - 45} ${x + width / 4},${y - 45} ${x + width / 2},${y - 60}`} stroke="gray" strokeWidth="2" fill="none" />
    </>
  );
  
  const renderRectSvgNode = ({ nodeDatum }) => (
    <g>
      <g>
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
        {/* {nodeDatum.isAlive == false && renderStripes(0, 0, 115)} */}
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
        <g transform={'translate(150, 0)'}>
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
          {nodeDatum.partner.isAlive == false && (
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
      <Box w="100%" h="100vh">
        {tree && (
          <Suspense fallback={<div>Loading...</div>}>
            {user ? (
              <Box>
                <Button as={Link} to={`/home/${familyTreeId}`} colorScheme="teal" position="absolute" top="20px" right="20px">
                  Back
                </Button>
                <Button onClick={handleShare} colorScheme="blue" position="absolute" top="90vh" right="20px">
                  <LinkIcon mr="5px" /> Copy link
                </Button>
              </Box> 
            ) : (
                <h1 style={{textAlign: "center", color: "#000", marginTop: "5px"}}>Bạn đang ở chế độ xem.</h1>
            )}
            <Tree
              data={tree}
              zoomable
              orientation="vertical"
              translate={{ x: 200, y: 200 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize = {{ x: 200, y: 450 }}
              pathFunc="step"
              renderCustomNodeElement={(nodeInfo) =>
                renderRectSvgNode(nodeInfo)
              }
            />
          </Suspense>
        )}
      </Box>
      {/* <Button as={Link} to={`/home/${familyTreeId}`} colorScheme="teal" position="absolute" top="20px" right="20px">
        Back
      </Button> */}
    </Stack>
  );
}

export default PreviewModal