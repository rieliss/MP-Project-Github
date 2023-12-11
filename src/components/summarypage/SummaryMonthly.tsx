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
import React, { useMemo, useEffect } from "react";
import { useStoreAPI } from "../../../stores/store";
import dayjs from "dayjs";
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

export default function SummaryMonthlyChart({
  MonthlyChartAPI,
}: MonthlyChartProps) {
  const { datepickerAPI } = useStoreAPI();
  const daysInMonth = dayjs().daysInMonth();
  const currentMonth = dayjs().month(); // ต้อง import dayjs ในโค้ดก่อน

  const parts = datepickerAPI.split("/");
  const day = parseInt(parts[0], 10);

  const filteredSummaryAPI = useMemo(() => {
    return MonthlyChartAPI.filter((sectionResult) => {
      const resultMonth = dayjs(sectionResult.create_Date).month();
      return resultMonth === currentMonth;
    });
  }, [MonthlyChartAPI, currentMonth]);

  const filteredDailyData = useMemo(() => {
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      date: dayjs()
        .date(index + 1)
        .format("YYYY-MM-DD"),
      sumPlan: 0,
      workPlan: 0,
      absent: 0,
    }));

    filteredSummaryAPI.forEach((sectionResult) => {
      const dayIndex = dayjs(sectionResult.create_Date).date() - 1;

      data[dayIndex].sumPlan += sectionResult.sumPlanSummary;
      data[dayIndex].workPlan += sectionResult.workPlanSummary;
      data[dayIndex].absent += sectionResult.absentSummary;
    });

    return data;
  }, [filteredSummaryAPI, daysInMonth]);

  const getLabelMonthly = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      if (index + 1 <= day) {
        return dayjs()
          .date(index + 1)
          .format("DD / MM / YYYY");
      } else {
        return null;
      }
    });
  }, [day, daysInMonth]);

  const currentDate = dayjs().date(1).format("MMMM-YYYY");

  const data = {
    labels: getLabelMonthly,
    datasets: [
      {
        label: "จำนวนพนักงานที่มา",
        data: filteredDailyData.map((entry) => entry.workPlan),
        backgroundColor: "#14b8a6",
        borderRadius: 2,
      },
      {
        label: "จำนวนพนักงานที่ไม่มา",
        data: filteredDailyData.map((entry) => entry.absent),
        backgroundColor: "#e11d48",
        borderRadius: 2,
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
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          // callback: (index: any) => {
          //   if (
          //     index === 0 ||
          //     index === Math.floor(getLabelMonthly.length / 2) ||
          //     index === getLabelMonthly.length - 1
          //   ) {
          //     const currentDate = dayjs()
          //       .date(index + 1)
          //       .format("DD/MM/YYYY");

          //     return currentDate;
          //   } else {
          //     return null;
          //   }
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
    <div className="col-span-1 p-5 bg-white rounded-2xl flex-1 drop-shadow-lg md:col-span-5">
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow">
          {" "}
          <h2 className="font-bold balance text-xl text-black">
            Daily Manpower Attendace Summary
          </h2>
        </div>
        <div className="flex  rounded-md ring-1 justify-end pr-4 w-70 p-2 items-center ">
          <p className="font-bold balance text-2xl text-black">Month : </p>
          <p className="font-bold balance text-2xl text-cyan-500 underline ml-1">
            {" "}
            {currentDate}{" "}
          </p>
        </div>
      </div>
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}
