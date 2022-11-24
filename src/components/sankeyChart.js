import React, { Component } from "react";
import Chart from "react-google-charts";
let sankeyData = [["From", "To", "Weight", "change", "annotation"]];

const v1 = require("../v1.json");
const v2 = require("../v2.json");
const columns = [
  { type: "string", id: "From" },
  { type: "string", id: "to" },
  { type: "number", id: "sizee" },
  { type: "number", id: "size change" },
];
const noChange = { name: "no size change", value: 0, objects: [] };
const shrinked = { name: "shrinked", value: 0, objects: [] };
const grew = { name: "grew", value: 0, objects: [] };
const added = { name: "added", value: 0, objects: [] };
const removed = { name: "removed", value: 0, objects: [] };

function mapInternals(v1Root, v2Root, objectName) {
  shrinked.objects = [];
  grew.objects = [];
  noChange.objects = [];
  //   const ret = [["From", "To", "size", "change", "annotation"]];
  const ret = [columns];
  const v1Children = v1Root.children;
  const v2Children = v2Root.children;

  v1Children.forEach((xv1) => {
    var xv2 = v2Children.find((item) => item.name === xv1.name);
    if (xv1.value === xv2.value) {
      noChange.value += xv1.value;
      xv2.diff = xv2.value - xv1.value;
      noChange.objects.push(xv2);
    } else if (xv1.value > xv2.value) {
      ret.push([objectName, xv1.name, xv1.value, 0]);
      ret.push([xv1.name, "shrinked", xv2.value, xv2.value - xv1.value]);
      xv2.diff = xv2.value - xv1.value;
      shrinked.objects.push(xv2);
      ret.push(["shrinked", objectName + "2.0", xv2.value, 0]);
    } else {
      ret.push([objectName, xv1.name, xv1.value, 0]);
      //   ret.push(["grew", xv2.name, xv2.value, xv2.value - xv1.value]);
      ret.push([xv1.name, "grew", xv2.value, xv2.value - xv1.value]);
      xv2.diff = xv2.value - xv1.value;
      grew.objects.push(xv2);
      ret.push(["grew", objectName + "2.0", xv2.value, 0]);
    }
  });
  //   ret.push([objectName, 'other', noChange.value, 0]);
  //   ret.push(['other', "no size change", noChange.value, 100]);
  //   ret.push(["no size change", objectName + "2.0", noChange.value, 0]);
  return ret;
}

function show(obj) {
  const ret = [columns];
  obj.objects.forEach((x) => {
    ret.push([obj.name, x.name, x.value, x.diff]);
  });
  return ret;
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
            console.log("select", chart.getSelection()[0].name);
            if (chart.getSelection()[0].name === "shrinked") {
              //show shrinked
              sankeyData = show(shrinked);
            } else if (chart.getSelection()[0].name === "grew") {
              sankeyData = show(grew);
            } else {
              sankeyData = show(noChange);
            }

            this.forceUpdate();
          });
        },
      },
    ];
  }

  options() {
    return {
      sankey: { iterations: 200, node: { width: 50, interactivity: true }, tooltip: { textStyle: { color: "#FF0000" }, showColorCode: true } },
    };
  }
  goBack() {
    sankeyData = mapInternals(v1.props.pageProps.sizeData.treemap, v2.props.pageProps.sizeData.treemap, "1Password ");
    this.forceUpdate();
  }
  render() {
    console.log(this.chartEvents);
    return (
      <div>
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
        <button onClick={() => this.goBack()}>back</button>
      </div>
    );
  }
}

export default SankeyChart;
