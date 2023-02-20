import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Stack,
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
import { Select } from "chakra-react-select";

import * as React from "react";
import { FiSearch } from "react-icons/fi";
import type { TProducts } from "../../../types/response";
import { api } from "../../utils/api";

type Range = {
  min: number;
  max: number;
};

const ProductsPage: React.FunctionComponent = (props) => {
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState<string>("");
  const [filter, setFilter] = React.useState<
    string | number | (string | number)[]
  >();
  const [brand, setBrand] = React.useState<
    string | number | (string | number)[]
  >();
  const [priceRange, setPriceRange] = React.useState<Range>({
    min: 10,
    max: 10000,
  });

  // eslint-disable-next-line prefer-const
  let { data, isFetching, isFetched } =
    api.products.getAllProducts.useQuery<TProducts>({
      skip: page * 10,
      search,
      min: priceRange.min || 10,
      max: priceRange.max || 10000,
    });

  const categories = api.products.getAllCategories.useQuery<string[]>();

  const optionsFilter = categories.data?.map((item) => {
    return { label: item, value: item };
  });

  const optionsBrand =
    data?.brands?.map((item) => {
      return { label: item, value: item };
    }) || [];

  const filterProducts = api.products.getProductsByCategory.useQuery<TProducts>(
    {
      category: filter as string,
      limit: 10,
      skip: page * 10,
      search,
      brand: brand ? (brand as string) : undefined,
      min: priceRange.min || 10,
      max: priceRange.max || 10000,
    }
  );

  filterProducts.isSuccess && (data = filterProducts.data);

  const filterProductsByBrand =
    api.products.getProductsByBrand.useQuery<TProducts>({
      brand: brand as string,
      limit: 10,
      skip: page * 10,
      search,
      category: filter ? (filter as string) : undefined,
      min: priceRange.min || 10,
      max: priceRange.max || 10000,
    });

  filterProductsByBrand.isSuccess && (data = filterProductsByBrand.data);

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
      <HStack spacing="10px" justifyContent="right" p="5">
        <InputGroup w="auto">
          <InputLeftElement
            pointerEvents="none"
            // eslint-disable-next-line react/no-children-prop
            children={<FiSearch />}
          />
          <Input
            placeholder="Search"
            name="search"
            type="text"
            // ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select
          useBasicStyles
          options={optionsFilter}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              minWidth: "20%",
              width: "auto",
            }),
          }}
          onChange={(e) => setFilter(e?.value)}
          closeMenuOnSelect={false}
          placeholder="Filter by category"
          isClearable
        />
        <Select
          useBasicStyles
          options={optionsBrand}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              minWidth: "20%",
              width: "auto",
            }),
          }}
          onChange={(e) => setBrand(e?.value)}
          closeMenuOnSelect={false}
          placeholder="Filter by brand"
          isClearable
        />
        <Popover>
          <PopoverTrigger>
            <Button>Filter Price</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Range Price</PopoverHeader>
            <PopoverBody>
              <HStack>
                <Stack spacing={4}>
                  <Text mb="2px">Lowest Price: </Text>
                  <NumberInput
                    defaultValue={priceRange.min}
                    min={10}
                    onChange={(val) =>
                      setPriceRange({ ...priceRange, min: Number(val) })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
                <Stack spacing={4}>
                  <Text mb="2px">Highest Price: </Text>
                  <NumberInput
                    defaultValue={priceRange.max}
                    min={10}
                    onChange={(val) =>
                      setPriceRange({ ...priceRange, max: Number(val) })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
      <TableContainer maxWidth={"100%"}>
        {isFetching && !data && (
          <Table>
            <TableCaption placement="top">Loading</TableCaption>
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Category</Th>
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
              </Tr>
            </Tbody>
          </Table>
        )}
        {isFetched && (
          <Table variant="simple">
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
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.products.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.title}</Td>
                  <Td>{item.description.slice(0, 100) + "..."}</Td>
                  <Td>{item.price}</Td>
                  <Td>{item.category}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default ProductsPage;
