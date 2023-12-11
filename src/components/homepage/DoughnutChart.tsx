"use client";
import { useMemo, useEffect } from "react";
import * as React from "react";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { DefaultizedPieValueType } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Hidden from "@mui/material/Hidden/Hidden";

type DoughnutChartProps = {
  DepartmentGroupAPI: DepartmentGroups[];
};

type DepartmentGroups = {
  id: number;
  departmentgroups: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

export default function DoughnutChart({
  DepartmentGroupAPI,
}: DoughnutChartProps) {
  const totalEmployeeCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const totalEmployeeWorkCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const totalEmployeeAbsentCount = useMemo(() => {
    return DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeAbsentCount,
      0
    );
  }, [DepartmentGroupAPI]);

  const data: any = [
    { value: totalEmployeeWorkCount, label: "Working" },
    { value: totalEmployeeAbsentCount, label: "Absent" },
  ];
  const dataLabel: any = ["Working", "Absent"];

  const size = {
    width: 400,
    height: 400,
  };

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 62,
    // fill: "#0891b2",
  }));
  const StyledTextSub = styled("text")(({ theme }) => ({
    // fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 18,
    fill: "#374151",
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <>
        <StyledText x={left + width / 2} y={top + height / 2.2}>
          {children}
        </StyledText>
      </>
    );
  }
  function PieSubCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <>
        <StyledTextSub x={left + width / 2} y={top + height / 1.6}>
          {children}
        </StyledTextSub>
      </>
    );
  }

  const submittedData = totalEmployeeWorkCount + totalEmployeeAbsentCount;
  const getArcLabel = (params: DefaultizedPieValueType) => {
    //   const percent = params.value / totalEmployeeCount;

    const percent = params.value / submittedData;
    return `${(percent * 100).toFixed(0)}%`;
  };

  // export default function PieChartWithCenterLabel() {
  return (
    <section className="grid grid-cols-3 bg-white rounded-2xl h-full drop-shadow-lg gap-y-2 p-4 m-1 max-md:mx-2 my-0 basis-0 grow col-span-3 lg:col-span-2">
      {/* Content on the left side */}

      <article className="col-span-1 flex flex-col gap-y-3  pt-1">
        <section className="flex flex-col gap-y-2 w-[500px]">
          <p className="font-bold balance text-xl text-black">
            EPD Manpower Attendacne Summary
          </p>
        </section>
        <section className="flex flex-col gap-y-2 w-44 rounded-md ring-gray-400 ring-1">
          <h3 className="font-normal balance px-3"> Total Manpower</h3>
          <p className="font-semibold text-4xl text-blue-950 px-3">
            {totalEmployeeCount.toLocaleString()}{" "}
            <span className="font-normal text-primary text-base ">MP</span>
          </p>
        </section>
        <section className="flex flex-col gap-y-2 w-44 rounded-md ring-cyan-500 ring-1">
          <h3 className="font-normal balance px-3 text-cyan-500 ">
            Total Submitted
          </h3>
          <p className="font-semibold text-4xl text-cyan-500 px-3">
            {submittedData.toLocaleString()}{" "}
            <span className="font-normal text-cyan-500 text-base">MP</span>
          </p>
        </section>
        <section className="flex flex-col gap-y-2 w-44 rounded-md ring-teal-500 ring-1">
          <h3 className="font-normal balance px-3 text-teal-500">
            Working Manpower
          </h3>
          <p className="font-semibold text-4xl text-active px-3">
            {totalEmployeeWorkCount.toLocaleString()}{" "}
            <span className="font-normal text-active text-base">MP</span>
          </p>
        </section>
        <section className="flex flex-col gap-y-2 w-44 rounded-md ring-rose-600 ring-1">
          <h3 className="font-normal balance px-3 text-rose-600">
            Absent Manpower
          </h3>
          <p className="font-semibold text-4xl text-deactive px-3">
            {totalEmployeeAbsentCount}{" "}
            <span className="font-normal text-base text-rose-600">MP</span>
          </p>
        </section>
      </article>
      {/* Piechart container on the right side */}
      <div className="col-span-2 flex items-center justify-center">
        {/* Replace 'div' with 'figure' for semantic HTML */}
        <figure
          style={{ width: "100%", height: "350px" }}
          className="flex items-center justify-center pl-[60px] "
        >
          <PieChart
            //   tooltip={{ trigger: "item" }}
            colors={["#14b8a6", "#e11d48"]}
            legend={{ hidden: true }}
            series={[
              {
                data,
                arcLabel: getArcLabel,
                arcLabelMinAngle: 50,
                innerRadius: 110,
                paddingAngle: 1,
                //   highlightScope: { faded: "global", highlighted: "item" },
                //   faded: { innerRadius: 30, additionalRadius: -10, color: "gray" },
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: 20,
                // background: "#fca5a5",
                background: "black",
              },
            }}
            {...size}
          >
            <PieCenterLabel>
              {/* {totalEmployeeCount.toLocaleString()}  */}
              {submittedData.toLocaleString()}
            </PieCenterLabel>
            <PieSubCenterLabel>TOTAL SUBMIT</PieSubCenterLabel>
          </PieChart>
        </figure>
      </div>
    </section>
  );
}
