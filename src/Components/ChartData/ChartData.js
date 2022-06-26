import React from 'react'
import Chart from 'react-google-charts';

export const options = {
    title:
      "NASA NEO Chart Visualization",
    hAxis: { title: "Avg Diameter in km" },
    vAxis: { title: "Miss Disatnce in km" },
    bubble: { textStyle: { fontSize: 11 } },
  };
const ChartData = ({ data }) => {
    console.log(data)
    return (
        <>
            <h3>Chart</h3>
            <Chart
      chartType="BubbleChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
        </>
    )
}

export default ChartData