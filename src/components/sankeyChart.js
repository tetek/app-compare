import React, { Component } from "react";
import Chart from "react-google-charts";
let sankeyData = [["From", "To", "Weight", "change", "annotation"]];

const v1 = require("../v1.json");
const v2 = require("../v2.json");
const columns = [
    { type: "string", id: "From" },
    { type: "string", id: "to" },
    { type: "number", id: "size" },
    { type: "number", role: "change" },
  ];
const noChange = { name: "no size change", value: 0, objects: [] };
function mapInternals(v1Root, v2Root, objectName) {
  //   const ret = [["From", "To", "size", "change", "annotation"]];
  const ret = [
    columns,
  ];
  const v1Children = v1Root.children;
  const v2Children = v2Root.children;
  

  v1Children.forEach((xv1) => {
    var xv2 = v2Children.find((item) => item.name === xv1.name);
    if (xv1.value === xv2.value) {
      noChange.value += xv1.value;
      noChange.objects.push(xv1);
    } else if (xv1.value > xv2.value) {
      ret.push([objectName, "shrinked", xv1.value, 0]);
      ret.push(["shrinked", xv2.name, xv2.value, xv2.value - xv1.value]);
      ret.push([xv2.name, objectName + "2.0", xv2.value, 0]);
    } else {
      ret.push([objectName, "grew", xv1.value, 0]);
      ret.push(["grew", xv2.name, xv2.value, xv2.value - xv1.value]);
      ret.push([xv2.name, objectName + "2.0", xv2.value, 0]);
    }
  });
  ret.push([objectName, noChange.name, noChange.value, 0]);
  ret.push([noChange.name, "other", noChange.value, 0]);
  ret.push(["other", objectName + "2.0", noChange.value, 0]);
  return ret;
}

function showNoSizeChange() {
    const ret = [columns,]
    noChange.objects.forEach(x => {
        ret.push([noChange.name, x.name, x.value, 0])
    });
    return ret
}
sankeyData = mapInternals(v1.props.pageProps.sizeData.treemap, v2.props.pageProps.sizeData.treemap, "1Password ");

class SankeyChart extends Component {
  constructor(props) {
    super(props);
    this.chartEvents = [
      {
        eventName: "ready",
        callback: ({ chartWrapper, google }) => {
          console.log("ready");
          const chart = chartWrapper.getChart();
          google.visualization.events.addListener(chart, "select", (e) => {
            console.log("select", chart.getSelection());
            sankeyData = showNoSizeChange();
            this.forceUpdate();
          });
        },
      },
    ];
  }

  options() {
    return {
      sankey: { iterations: 32, node: { width: 50, interactivity: true }, tooltip: { textStyle: { color: "#FF0000" }, showColorCode: true } },
    };
  }

  render() {
    console.log(this.chartEvents);
    return (
        <div><button>Back</button>
      <Chart
        width={"800px"}
        height={"500px"}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={sankeyData}
        // rootProps={{ "data-testid": "1" }}
        chartEvents={this.chartEvents}
        options={this.options()}
        // action={}
      />
      </div>
    );
  }
}

export default SankeyChart;
