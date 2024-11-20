"use client";
import { useMemo, useRef } from "react";
import * as d3 from "d3";
import styles from "@/components/Charts/DonutChart.module.css";

type DataItem = {
  name: string;
  value: number;
};
type DonutChartProps = {
  color: string[];
  width: number;
  height: number;
  data: DataItem[];
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20;

// Base dimensions yang akan digunakan sebagai viewBox
const BASE_WIDTH = 700;
const BASE_HEIGHT = 400;

export const DonutChart = ({ width, height, data, color }: DonutChartProps) => {
  const ref = useRef<SVGGElement | null>(null);

  // Tetap menggunakan BASE_WIDTH dan BASE_HEIGHT untuk perhitungan internal
  const radius = Math.min(BASE_WIDTH - 2 * MARGIN_X, BASE_HEIGHT - 2 * MARGIN_Y) / 2;
  const innerRadius = radius / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    const sliceInfo = {
      innerRadius,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = arcGenerator(sliceInfo);

    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexionPoint = arcGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";

    const label = grp.data.name;
    const value = grp.value + " %";

    return (
      <g
        key={i}
        className={styles.slice}
        onMouseEnter={() => {
          if (ref.current) {
            ref.current.classList.add(styles.hasHighlight);
          }
        }}
        onMouseLeave={() => {
          if (ref.current) {
            ref.current.classList.remove(styles.hasHighlight);
          }
        }}
      >
        <rect
          x={labelPosX + (isRightLabel ? -10 : -140)}
          y={inflexionPoint[1] - 30}
          width={150}
          height={60}
          fill={color[i]}
          rx={5}
          className={styles.hoverBackground}
        />

        <path d={slicePath || undefined} fill={color[i]} />

        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />

        <text
          x={labelPosX + (isRightLabel ? 5 : -5)}
          y={inflexionPoint[1] - 10}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="bold"
          fill="white"
        >
          {label}
        </text>

        <text
          x={labelPosX + (isRightLabel ? 5 : -5)}
          y={inflexionPoint[1] + 10}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={24}
          fontWeight="bold"
          fill="white"
        >
          {value}
        </text>
      </g>
    );
  });

  return (
    <div style={{ width, height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform={`translate(${BASE_WIDTH / 2}, ${BASE_HEIGHT / 2})`}
          className={styles.container}
          ref={ref}
        >
          {shapes}
        </g>
      </svg>
    </div>
  );
};