import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ summary }) {
  const categories = Object.keys(summary);
  const amounts = Object.values(summary);

  if (categories.length === 0) {
    return <p>No data to display yet.</p>;
  }

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h3>Monthly Spending by Category</h3>
      <Pie data={data} />
    </div>
  );
}

export default ExpenseChart;
