import { Chart } from '@mui/x-charts/Chart';
import { LineSeries } from '@mui/x-charts/LineSeries';

export default function LineChart({ data }) {
  // data: [{ x: 'Jan', y: 10 }, ...]
  const x = data.map((d) => d.x);
  const y = data.map((d) => d.y);

  return (
    <div style={{ height: 300 }}>
      <Chart series={[{ type: 'line', data: y, label: 'Series' }]} xAxis={[{ scale: 'point', data: x }]} />
    </div>
  );
}
