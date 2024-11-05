// components/GrowthChart.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const GrafikTumbuhKembangBalita = () => {
  // Data for the age and weight curves
  const labels = Array.from({ length: 6 * 4 }, (_, i) => (i / 4).toFixed(1)); // Labels from 0 to 6 months

  const weight_z3 = labels.map(
    (x) => 2.5 + 1.6 * Math.log(Number(x) * 4.33 + 1),
  ); // +3 z-score
  const weight_z2 = labels.map(
    (x) => 2.3 + 1.4 * Math.log(Number(x) * 4.33 + 1),
  ); // +2 z-score
  const weight_z0 = labels.map(
    (x) => 2.1 + 1.2 * Math.log(Number(x) * 4.33 + 1),
  ); // 0 z-score
  const weight_z_2 = labels.map(
    (x) => 1.9 + 1.0 * Math.log(Number(x) * 4.33 + 1),
  ); // -2 z-score
  const weight_z_3 = labels.map(
    (x) => 1.7 + 0.8 * Math.log(Number(x) * 4.33 + 1),
  ); // -3 z-score

  const data = {
    labels,
    datasets: [
      {
        label: "+3 z-score",
        data: weight_z3,
        borderColor: "black",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "+2 z-score",
        data: weight_z2,
        borderColor: "red",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "0 z-score",
        data: weight_z0,
        borderColor: "green",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "-2 z-score",
        data: weight_z_2,
        borderColor: "red",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "-3 z-score",
        data: weight_z_3,
        borderColor: "black",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        // position: 'top',
      },
      //   title: {
      //     display: true,
      //     text: "Weight-for-Age Growth Chart",
      //   },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Age (months)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
        min: 2,
        max: 11,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default GrafikTumbuhKembangBalita;
