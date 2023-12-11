"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import React, { useMemo, useEffect } from "react";
// import { useStoreAPI } from "../../../stores/store";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../../public/fonts/DENSOSans-Regular.ttf",
});

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type DepartmentGroupProps = {
  DepartmentGroupAPI: DepartmentGroups[];
};

type DepartmentGroups = {
  id: number;
  departmentgroups: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

export default function DepartmentGroupChart({
  DepartmentGroupAPI,
}: DepartmentGroupProps) {
  const {
    departmentGroupNames,
    departmentGroupEmployeeWork,
    departmentGroupEmployeeAbsent,
    employeeWorkCount,
  } = useMemo(() => {
    const names = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.departmentgroups
    );
    const workCounts = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.employeeWorkCount
    );
    const absentCounts = DepartmentGroupAPI.map(
      (item: DepartmentGroups) => item.employeeAbsentCount
    );
    const totalWorkCount = DepartmentGroupAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );

    return {
      departmentGroupNames: names,
      departmentGroupEmployeeWork: workCounts,
      departmentGroupEmployeeAbsent: absentCounts,
      employeeWorkCount: totalWorkCount,
    };
  }, [DepartmentGroupAPI]);

  const data = {
    labels: ["Assy Mfg.", "Parts Mfg.", "QA.", "Logistics"],
    labelFullname: departmentGroupNames,
    borderRadius: 5,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: departmentGroupEmployeeWork,
        backgroundColor: "#14b8a6",
        borderRadius: 5,
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: departmentGroupEmployeeAbsent,
        backgroundColor: "#e11d48",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },

      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "rgb(56, 56, 56)",
        width: "100px",
        backgoundHeight: "100px",
        // align: "top",
        backgroundColor: "rgba(255,255, 255,0.7)",
        borderRadius: 2,
        font: {
          size: 16,
          weight: "bold",
        },
        formatter: function (value: any) {
          if (value > 0) {
            value = value.toString();
            value = value.split(/(?=(?:...)*$)/);
            value = value.join(",");
            return value;
          } else {
            value = "";
            return value;
          }
        },
      },
      tooltip: {
        callbacks: {
          // This callback function is used to customize the tooltip label for each data point
          label: (context: any) => {
            const datasetLabel = context.dataset.label || "";

            const value = context.parsed.y || 0;

            // Get the corresponding fullname from the labelFullname array
            const fullname = data.labelFullname[context.dataIndex];

            // Modify the tooltip label to include the fullname
            return `${fullname} ${datasetLabel}: ${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
  };

  // Register Chart.js components once on component mount using useEffect
  useEffect(() => {
    ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  }, []);
  return (
    <section className="grid-box col-span-3 lg:col-span-2">
      <div>
        <p className="font-bold balance text-xl text-black">
          Dept. Group Manpower Attendacne Summary
        </p>
      </div>
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow rounded-md justify-end pr-4 items-center ">
          <span className="font-normal">Today's MP Working Attendance : </span>
        </div>
        <div className="flex  rounded-md ring-1 ring-teal-500 items-center  justify-center px-6 py-6 pt-0 pb-0">
          <span className="font-semibold text-4xl text-active">
            {employeeWorkCount.toLocaleString()}{" "}
            <span className="font-normal text-primary text-base">MP</span>
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div style={{ width: "100%", height: "300px" }}>
          <Bar
            data={data}
            plugins={[ChartDataLabels]}
            options={options}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
