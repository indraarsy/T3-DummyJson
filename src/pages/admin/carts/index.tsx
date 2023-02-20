import {
  Box,
  Button,
  HStack,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import * as React from "react";
import { FiEye } from "react-icons/fi";
import type { TCarts } from "../../../../types/response";
import { api } from "../../../utils/api";

const CartsPage: React.FunctionComponent = (props) => {
  const router = useRouter();
  const [page, setPage] = React.useState(0);

  const { data, isFetching, isFetched } =
    api.carts.getAllCarts.useQuery<TCarts>({
      limit: 10,
      skip: page * 10,
    });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleClickNextPagination = () => {
    setPage(page + 1);
  };

  const handleClickPreviousPagination = () => {
    setPage(page - 1);
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRadius="lg"
      maxH={"88vh"}
      maxW={"100%"}
    >
      <TableContainer maxWidth={"100%"}>
        {isFetching && !data && (
          <Table>
            <TableCaption placement="top">Loading</TableCaption>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>User</Th>
                <Th>Total Products</Th>
                <Th>Total Quantity</Th>
                <Th>Total</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
        {isFetched && (
          <Table variant="simple" size="sm" my="4">
            <TableCaption>
              <HStack spacing="10px" justifyContent="right" pb={4}>
                <Text textAlign={"left"}>Showing Page {page + 1}</Text>
                {page > 0 && (
                  <Button onClick={handleClickPreviousPagination}>
                    Previous
                  </Button>
                )}
                {page < 9 && (
                  <Button onClick={handleClickNextPagination}>Next</Button>
                )}
              </HStack>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>User</Th>
                <Th>Total Products</Th>
                <Th>Total Quantity</Th>
                <Th>Total</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.carts.map((item, key) => (
                <Tr key={item.id}>
                  <Td>{key + 1}</Td>
                  <Td>
                    {item.user?.firstName} {item.user?.lastName}
                  </Td>
                  <Td>{item.products.length}</Td>
                  <Td>{item.totalQuantity}</Td>
                  <Td>{formatter.format(item.total)}</Td>
                  <Td>
                    <Button
                      onClick={() =>
                        void router.push(`/admin/carts/${item.id}`)
                      }
                    >
                      <FiEye />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default CartsPage;
