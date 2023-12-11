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
import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useStoreAPI } from "../../../stores/store";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type MonthlyChartProps = {
  MonthlyChartAPI: Section[];
};

type Section = {
  create_Date: Date;
  id: number;
  sectionCode: number;
  sectionName: string;
  sumPlanDay: number;
  workPlanDay: number;
  absentDay: number;
  ratioDay: number;
  statusMappingShiftDay: string[];
  sumPlanNight: number;
  workPlanNight: number;
  absentNight: number;
  ratioNight: number;
  statusMappingShiftNight: string[];
  sumPlanSummary: number;
  workPlanSummary: number;
  absentSummary: number;
  ratioSummary: number;
  statusMappingSummary: string[];
};

export default function SummaryShiftChart({
  MonthlyChartAPI,
}: MonthlyChartProps) {
  const { datepickerAPI } = useStoreAPI();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonth = dayjs().month();

  const parts = datepickerAPI.split("/");
  const day = parseInt(parts[0], 10);

  // Filter summary data for the current month
  const filteredSummaryAPI = useMemo(() => {
    return MonthlyChartAPI.filter((sectionResult) => {
      const resultMonth = dayjs(sectionResult.create_Date).month();
      return resultMonth === currentMonth;
    });
  }, [MonthlyChartAPI, currentMonth]);

  const filteredDailyData = useMemo(() => {
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      created_Date: dayjs()
        .date(index + 1)
        .format("YYYY-MM-DD"),
      workplanDay: 0,
      absentDay: 0,
      workplanNight: 0,
      absentNight: 0,
    }));

    filteredSummaryAPI.forEach((sectionResult) => {
      const dayIndex = dayjs(sectionResult.create_Date).date() - 1;

      data[dayIndex].workplanDay += sectionResult.workPlanDay;
      data[dayIndex].absentDay += sectionResult.absentDay;
      data[dayIndex].workplanNight += sectionResult.workPlanNight;
      data[dayIndex].absentNight += sectionResult.absentNight;
    });

    return data;
  }, [filteredSummaryAPI, daysInMonth]);

  // Define the data and options variables
  const data = {
    labels: ["Day", "Night"],
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: [
          filteredDailyData[day - 1]?.workplanDay || 0,
          filteredDailyData[day - 1]?.workplanNight || 0,
        ],
        backgroundColor: "#14b8a6",
        borderRadius: 5,
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: [
          filteredDailyData[day - 1]?.absentDay || 0,
          filteredDailyData[day - 1]?.absentNight || 0,
        ],
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
    },
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
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="col-span-1 p-5 bg-white rounded-2xl flex-1 drop-shadow-lg md:col-span-2">
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow">
          {" "}
          <h2 className="font-bold balance text-xl text-black">
            Today's Attendance!
          </h2>
        </div>
        <div className="flex  rounded-md ring-1 justify-end pr-4 w-50 p-2 items-center ">
          <p className="font-bold balance text-xl text-black">Date : </p>
          <p className="font-bold balance text-xl text-cyan-500 underline ml-1">
            {" "}
            {datepickerAPI}{" "}
          </p>
        </div>
      </div>
      <Bar
        data={data}
        options={options}
        plugins={[ChartDataLabels]}
        height={421}
      />
    </div>
  );
}
