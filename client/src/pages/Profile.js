import { Box, Flex, VStack, Text, Image } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import { fetchUserData } from "../api/api";
import { useState, useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useUser();  // ContextからuserDataを取得
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserData(userId);
      setUserData(data);
    };
    fetchData();
  }, [userId]);

  if (!userData) {
    return <Text>Loading...</Text>;  // データがロードされるまでの間、Loadingメッセージを表示
  }
  
  console.log(userData)

  return (
    <Flex justify="center" align="center" minH="100vh" p="4">
      <VStack spacing="6" width="100%" maxW="400px" align="center">

        {/* ユーザー情報 */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
          textAlign="center"
        >
          <Flex align="center" justify="center">
            <Box textAlign="left">
              <Text fontSize="xl" fontWeight="bold">{userData.data.name}</Text>
              <Text color="gray.600">{userData.data.mail_address}</Text>
              <Text fontSize="sm" color="gray.500">{userData.data.created_at}に参加</Text>
            </Box>
            <Image 
              src={userData.profile_image_url || "/assets/nonnon.png"}
              alt="ユーザーアイコン"
              borderRadius="full"
              width="80px"
              height="80px"
              ml="4"
            />
          </Flex>
        </Box>

        {/* 進捗情報 */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
        >
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">連続記録</Text>
            <Flex align="center">
              <Image src="/assets/icon-fire.png" alt="連続記録" width="20px" height="20px" />
              <Text ml="2">{userData.data.current_streak}</Text>
            </Flex>
          </Flex>

          <Flex justify="space-between" align="center" mt="2">
            <Text fontWeight="bold">累計XP</Text>
            <Flex align="center">
              <Image src="/assets/icon-fire.png" alt="累計XP" width="20px" height="20px" />
              <Text ml="2">{userData.data.xp}</Text>
            </Flex>
          </Flex>
        </Box>

        {/* ランク */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
        >
          <Text fontWeight="bold">ランク</Text>

          <Flex align="center" justify="space-between" mt="2">
            <Text color="gray.700">大阪</Text>
            <Flex align="center" p="2" border="2px solid black" borderRadius="full" width="180px" justify="flex-end">
              <Text mr="2">江戸っ子</Text>
              <Image src="/assets/icon-tako.png" alt="大阪ランク" width="20px" height="20px" />
            </Flex>
          </Flex>

          <Flex align="center" justify="space-between" mt="2">
            <Text color="gray.700">神戸</Text>
            <Flex align="center" p="2" border="2px solid black" borderRadius="full" width="180px" justify="flex-end">
              <Text mr="2">牛使い</Text>
              <Image src="/assets/icon-usi.png" alt="神戸ランク" width="20px" height="20px" />
            </Flex>
          </Flex>

          <Flex align="center" justify="space-between" mt="2">
            <Text color="gray.700">京都</Text>
            <Flex align="center" p="2" border="2px solid black" borderRadius="full" width="180px" justify="flex-end">
              <Text mr="2">ブブ漬け職人</Text>
              <Image src="/assets/icon-ume.png" alt="京都ランク" width="20px" height="20px" />
            </Flex>
          </Flex>
        </Box>

        {/* ログアウト */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
          textAlign="center"
        >
          <Text
            color="blue.500"
            fontWeight="bold"
            cursor="pointer"
            textAlign="center"
            mt="4"
            onClick={() => navigate("/login")}
          >
            ログアウトする
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Profile;