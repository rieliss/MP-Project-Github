"use client";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartOptions,
} from "chart.js";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

type MonthlyData = {
  dailyCounts: number[];
  monthlyAverage: number;
};

type DepartmentGroupWorkYearly = {
  departmentgroups: string;
  dailyCounts: MonthlyData[];
  monthlyAverages: number[];
};

type YearlyLineChartProps = {
  YearlyAPI: DepartmentGroupWorkYearly[];
};

export default function YearlyLineChart({ YearlyAPI }: YearlyLineChartProps) {
  const currentYear = dayjs().year(); // ปีปัจจุบัน
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const summedWorkDaily = useMemo(() => {
    const employeeWorkMonthly = YearlyAPI.map(
      (item: DepartmentGroupWorkYearly) => item.monthlyAverages
    );

    // สร้าง array ขึ้นมารองรับข้อมูลจำนวนพนักงานที่มาทำงาน
    const summedWorkDaily = employeeWorkMonthly[0].map(() => 0);

    // loop ใส่ข้อมูลพนักงานทุกๆ departmentgroup ให้อยู่ใน array เดียว
    // Loop through each matrix and add the corresponding values
    for (const matrix of employeeWorkMonthly) {
      for (let i = 0; i < matrix.length; i++) {
        summedWorkDaily[i] += matrix[i];
      }
    }

    return summedWorkDaily;
  }, [YearlyAPI]);

  // คำนวณค่าอื่นๆ และแปลงผลลัพธ์ให้กลายเป็น memoized value โดยใช้ useMemo
  const nonZeroCounts = useMemo(() => {
    return summedWorkDaily.some((count) => count !== 0)
      ? summedWorkDaily.filter((count) => count !== 0).length
      : 0;
  }, [summedWorkDaily]);

  const totalWorkCounts = useMemo(() => {
    return summedWorkDaily.reduce((sum, count) => sum + count, 0);
  }, [summedWorkDaily]);

  const averageWorkCount = useMemo(() => {
    return nonZeroCounts > 0 ? Math.floor(totalWorkCounts / nonZeroCounts) : 0;
  }, [nonZeroCounts, totalWorkCounts]);

  const monthYearArray = months.map((month) => `${month} ${currentYear}`);

  const data = {
    labels: months,
    labelFullname: monthYearArray,
    datasets: [
      {
        label: "Avg. MP Working per Month",
        data: summedWorkDaily,
        fill: {
          target: "origin",
          above: "#14b8a6", // Area will be red above the origin
          below: "rgba(75,192,192,0.2)", // And blue below the origin
        },

        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#14b8a6",
        tension: 0.2,
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
        align: "top",
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

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        min: 0,
      },
    },
    // elements: {
    //   line: {
    //     fill: {
    //       target: "origin",
    //       above: "rgb(255, 0, 0)", // Area will be red above the origin
    //       below: "rgb(0, 0, 255)", // And blue below the origin
    //     },
    //   },
    // },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <section className="grid-box col-span-3">
      <div>
        <p className="font-bold balance text-xl text-black">
          Monthly Working Trend
        </p>
      </div>
      <div className="flex flex-row gap-x-1 mb-2 w-70">
        <div className="flex grow rounded-md justify-end pr-4 items-center ">
          <span className="font-normal">Avg. MP Working Attendance : </span>
        </div>
        <div className="flex  rounded-md ring-1 ring-teal-500 items-center  justify-center px-6 py-6 pt-0 pb-0">
          <span className="font-semibold text-4xl text-active">
            {averageWorkCount.toLocaleString()}{" "}
            <span className="font-normal text-primary text-base">MP</span>
          </span>
        </div>
      </div>
      {/* <div className="flex flex-col gap-y-2 mb-2">
        <span className="font-semibold">จำนวนพนักงานเข้างานเฉลี่ย</span>
        <span className="font-semibold text-4xl text-active">
          {averageWorkCount}{" "}
          <span className="font-semibold text-primary text-base">
            คนต่อเดือน
          </span>
        </span>
      </div> */}
      <div className="flex justify-center items-center mb-2">
        <div style={{ width: "100%", height: "300px" }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </section>
  );
}
