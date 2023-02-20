import { Box, SimpleGrid } from "@chakra-ui/react";
import type { ChartData, ChartOptions } from "chart.js";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import type { TProducts } from "../../../types/response";
import { api } from "../../utils/api";
interface LineProps {
  options: ChartOptions<"line">;
  data: ChartData<"line">;
}

const Dashboard: React.FunctionComponent = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  ChartJS.register(ArcElement, Tooltip, Legend);

  const categories = api.products.getAllCategories.useQuery<string[]>();

  const products = api.products.getAllProducts.useQuery<TProducts>({
    limit: 100,
    min: 10,
    max: 10000,
  });

  // count products by category
  const countProductsByCategory = categories.data?.map((category) => {
    return products.data?.products.filter((product: { category: string }) => {
      return product.category === category;
    }).length;
  });

  const data = {
    labels: categories.data,
    datasets: [
      {
        label: "# of Votes",
        data: countProductsByCategory,
        backgroundColor: [
          "#9F7AEA",
          "#FF6B6B",
          "#48dbfb",
          "#1dd1a1",
          "#feca57",
          "#ff9ff3",
          "#ffbe76",
          "#00d2d3",
          "#ff7979",
          "#a29bfe",
          "#e17055",
          "#fffa65",
        ],
        hoverBackgroundColor: [
          "#9F7AEA",
          "#FF6B6B",
          "#48dbfb",
          "#1dd1a1",
          "#feca57",
          "#ff9ff3",
          "#ffbe76",
          "#00d2d3",
          "#ff7979",
          "#a29bfe",
          "#e17055",
          "#fffa65",
        ],
      },
    ],
  };

  return (
    <SimpleGrid columns={2} spacing={10}>
      <Box height="max">
        <Doughnut data={data} />
      </Box>
    </SimpleGrid>
  );
};

export default Dashboard;
