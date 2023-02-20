import {
  Box,
  Skeleton,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import * as React from "react";
import type { TDetailProduct } from "../../../../types/response";
import { api } from "../../../utils/api";

const CartsPage: React.FunctionComponent = (props) => {
  const router = useRouter();
  const { data, isFetching, isFetched } =
    api.carts.getSingleCart.useQuery<TDetailProduct>({
      id: Number(router.query.id),
    });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <Box
        transition="3s ease"
        bg={useColorModeValue("white", "gray.900")}
        borderRadius="lg"
        maxW={"100%"}
        p="10"
        my="6"
      >
        <StatGroup>
          <Stat>
            <StatLabel>User</StatLabel>
            {isFetching && !data && (
              <Skeleton mr="4" w="20">
                1
              </Skeleton>
            )}
            {isFetched && (
              <StatNumber>
                {data?.user?.firstName} {data?.user?.lastName}
              </StatNumber>
            )}
          </Stat>

          <Stat>
            <StatLabel>5 of 5 Items</StatLabel>
            {isFetching && !data && (
              <Skeleton mr="4" w="20">
                1
              </Skeleton>
            )}
            {isFetched && data && (
              <StatNumber>{formatter.format(data.total)}</StatNumber>
            )}
          </Stat>
        </StatGroup>
      </Box>
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
                  <Th>No</Th>
                  <Th>Title</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Total</Th>
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
            <>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Title</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.products.map((product, key) => (
                    <Tr key={product.id}>
                      <Td>{key + 1}</Td>
                      <Td>{product.title}</Td>
                      <Td>{product.price}</Td>
                      <Td>{product.quantity}</Td>
                      <Td>
                        {formatter.format(product.price * product.quantity!)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
        </TableContainer>
      </Box>
    </>
  );
};

export default CartsPage;
