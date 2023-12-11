"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type MonthlyData = {
  dailyCounts: number[];
  monthlyAverage: number;
};

type DepartmentGroupWorkMonthly = {
  departmentgroups: string;
  dailyCounts: MonthlyData[];
  monthlyAverages: number[];
};

type MonthlyBarChartProps = {
  MonthlyAPI: DepartmentGroupWorkMonthly[];
};

export default function MonthlyBarchart({ MonthlyAPI }: MonthlyBarChartProps) {
  const currentDay = dayjs().date();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonthIndex = dayjs().month();

  const currentMonthDailyCounts = useMemo(
    () => MonthlyAPI.map((item) => item.dailyCounts[currentMonthIndex]),
    [MonthlyAPI, currentMonthIndex]
  );
  // console.log(currentMonthIndex);
  const dailyCountsArrays = useMemo(
    () => currentMonthDailyCounts.map((item) => item.dailyCounts),
    [currentMonthDailyCounts]
  );

  const dailyCountsArraysLength = useMemo(
    () => dailyCountsArrays[0].length,
    [dailyCountsArrays]
  );

  const dailyCountsSummary = useMemo(() => {
    const summary = new Array(dailyCountsArraysLength).fill(0);
    for (let i = 0; i < dailyCountsArraysLength; i++) {
      for (let j = 0; j < dailyCountsArrays.length; j++) {
        summary[i] += dailyCountsArrays[j][i];
      }
    }
    return summary;
  }, [dailyCountsArrays, dailyCountsArraysLength]);

  const employeeWorkMonthly = useMemo(
    () => MonthlyAPI.map((item) => item.monthlyAverages),
    [MonthlyAPI]
  );

  const summedWorkDaily = useMemo(() => {
    const summed = employeeWorkMonthly[0].map(() => 0);
    for (const matrix of employeeWorkMonthly) {
      for (let i = 0; i < matrix.length; i++) {
        summed[i] += matrix[i];
      }
    }
    return summed;
  }, [employeeWorkMonthly]);

  // Create an array of data values, set the value to null for days that haven't happened yet
  const labelMonthly = Array.from({ length: daysInMonth }, (_, index) => {
    if (index + 1 <= currentDay) {
      return dayjs()
        .date(index + 1)
        .format("DD / MM / YYYY");
    } else {
      return null;
    }
  });

  const currentDate = dayjs().date(1).format("MMMM");

  // console.log(currentDate);
  const data = {
    labels: labelMonthly,
    datasets: [
      {
        label: "Avg. Working MP ",
        data: dailyCountsSummary,
        backgroundColor: "#14b8a6",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 40,
        },
        fullSize: true,
      },
      datalabels: {
        color: "rgb(56, 56, 56)",
        width: "10px",
        height: "10px",
        borderRadius: 2,
        anchor: "end",
        align: "-90",
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
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          // Use the callback function to customize the tick values
          //   callback: (index: any) => {
          //     if (
          //       index === 0 ||
          //       index === Math.floor(labelMonthly.length / 2) ||
          //       index === labelMonthly.length - 1
          //     ) {
          //       const currentDate = dayjs()
          //         .date(index + 1)
          //         .format("DD/MM");
          //       return currentDate;
          //     } else {
          //       return null;
          //     }
          //   },
          // },
          callback: (index: any) => {
            const currentDate = dayjs()
              .date(index + 1)
              .format("DD");
            return currentDate;
          },
        },
      },

      y: {
        grid: {
          display: false,
        },
      },
    },
    borderRadius: 3,
    maintainAspectRatio: false, // Disable aspect ratio
    responsive: true, // Make the chart responsive
  };

  return (
    <section className="grid-box col-span-3">
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div>
          {" "}
          <p className="font-bold balance text-xl text-black">
            Daily Working Trend
          </p>
        </div>
        <div className="flex grow rounded-md justify-end pr-4 items-center ">
          <p className="font-bold balance text-xl text-black">Month : </p>
          <p className="font-bold balance text-xl text-cyan-500 underline ml-1">
            {" "}
            {currentDate}{" "}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow rounded-md justify-end pr-4 items-center ">
          <span className="font-normal">Avg. MP Working Attendance : </span>
        </div>
        <div className="flex rounded-md ring-1 ring-teal-500 items-center  justify-center px-6 py-6 pt-0 pb-0">
          <span className="font-semibold text-4xl text-active">
            {summedWorkDaily[currentMonthIndex].toLocaleString()}{" "}
            <span className="font-normal text-primary text-base">MP</span>
          </span>
        </div>
      </div>
      {/* <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานเข้างานเฉลี่ย</span>
        <span className="font-semibold text-4xl text-active">
          {summedWorkDaily[currentMonthIndex]}{" "}
          <span className="font-semibold text-primary text-base">คนต่อวัน</span>
        </span>
      </div> */}
      <div className="flex justify-center items-center">
        <div style={{ width: "100%", height: "300px" }}>
          <Bar data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </section>
  );
}
