import { Chart } from '@mui/x-charts/Chart';
import { PieSeries } from '@mui/x-charts/PieSeries';

export default function PieChart({ data }) {
  // data: [{ label: 'A', value: 10 }, ...]
  const seriesData = data.map((d) => ({ name: d.label, value: d.value }));
  return (
    <div style={{ height: 300 }}>
      <Chart series={[{ type: 'pie', data: seriesData }]} />
    </div>
  );
}
