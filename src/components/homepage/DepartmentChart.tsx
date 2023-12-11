"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React, { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DepartmentProps = {
  DepartmentAPI: Departments[];
};

type Departments = {
  id: number;
  departments: string;
  employeeCount: number;
  employeeWorkCount: number;
  employeeAbsentCount: number;
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export default function DepartmentChart({ DepartmentAPI }: DepartmentProps) {
  const {
    departmentNames,
    departmentEmployeeWork,
    departmentEmployeeAbsent,
    totalEmployeeWorkCount,
  } = useMemo(() => {
    const names = DepartmentAPI.map((item: Departments) => item.departments);
    const workCounts = DepartmentAPI.map(
      (item: Departments) => item.employeeWorkCount
    );
    const absentCounts = DepartmentAPI.map(
      (item: Departments) => item.employeeAbsentCount
    );
    const totalWorkCount = DepartmentAPI.reduce(
      (acc, item) => acc + item.employeeWorkCount,
      0
    );

    return {
      departmentNames: names,
      departmentEmployeeWork: workCounts,
      departmentEmployeeAbsent: absentCounts,
      totalEmployeeWorkCount: totalWorkCount,
    };
  }, [DepartmentAPI]);
  // console.log(DepartmentAPI);

  const data = {
    labels: [
      "Mfg.1",
      "Mfg.2",
      "Mfg.3",
      "P Mfg.1",
      "P Mfg.2",
      "Q.A.",
      "Logistic",
    ],
    labelFullname: departmentNames,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: departmentEmployeeWork,
        backgroundColor: "#14b8a6",
        borderRadius: 5,
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: departmentEmployeeAbsent,
        backgroundColor: "#e11d48",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "rgb(56, 56, 56)",
        width: "10px",
        height: "10px",
        borderRadius: 2,
        backgroundColor: "rgba(255,255, 255,0.7)",
        font: {
          size: 14,
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
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
  };

  return (
    <section className="grid-box col-span-3 lg:col-span-2">
      <div>
        <p className="font-bold balance text-xl text-black">
          Department Manpower Attendacne Summary
        </p>
      </div>
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow rounded-md justify-end pr-4 items-center ">
          <span className="font-normal">Today's MP Working Attendance : </span>
        </div>
        <div className="flex  rounded-md ring-1 ring-teal-500 items-center  justify-center px-6 py-6 pt-0 pb-0">
          <span className="font-semibold text-4xl text-active">
            {totalEmployeeWorkCount.toLocaleString()}{" "}
            <span className="font-normal text-primary text-base">MP</span>
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div style={{ width: "100%", height: "300px" }}>
          <Bar
            data={data}
            options={options}
            plugins={[ChartDataLabels]}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
