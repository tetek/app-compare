import React, { Component } from "react";
import Chart from "react-google-charts";
let sankeyData = [["From", "To", "Weight", "change", "annotation"]];

const v1 = require("../v1.json");
const v2 = require("../v2.json");

// function showModules() {
//   for (const x of data.props.pageProps.sizeData.modules) {
//     sankeyData.push(["1Password", x.name, x.size, 0, "1p"]);
//     sankeyData.push([x.name, x.name + "2", x.size, x.size - x.size, "hehe"]);
//     sankeyData.push([x.name + "2", "1Password 2.0", x.size, 0, "bliac"]);
//   }
// }

// take all children from v1 and map with children from v2
// if size is the same bundle it together (no change)
// 

function mapInternals(v1Root, v2Root, objectName) {
    const ret = [["From", "To", "Weight", "change", "annotation"]];
    const v1Children = v1Root.children
    const v2Children = v2Root.children
    const noChange = {name: "no size change", value: 0, objects: []}

    v1Children.forEach(xv1 => {
        var xv2 = v2Children.find(item => item.name === xv1.name);
        if (xv1.value === xv2.value) {
            // this object did not change size between version
            noChange.value += xv1.value
            noChange.objects.push(xv1)
            // ret.push([objectName, "no size change", xv1.value, 0, ""])
            // ret.push(["no size change", xv2.name + '2.0', xv2.value, 0, ""])
            // ret.push([xv2.name + '2.0', objectName + "2.0", xv2.value, 0, ""])
        } else if (xv1.value > xv2.value) {
            ret.push([objectName, "shrinked", xv1.value, 0, ""])
            ret.push(["shrinked", xv2.name, xv2.value, xv2.value - xv1.value, ""])
            ret.push([xv2.name, objectName + "2.0", xv2.value, 0, ""])
        } else {
            ret.push([objectName, "grew", xv1.value, 0, ""])
            ret.push(["grew", xv2.name, xv2.value, xv2.value - xv1.value, ""])
            ret.push([xv2.name, objectName + "2.0", xv2.value, 0, ""])
        }
    });
    ret.push([objectName, noChange.name, noChange.value,0,""])
    ret.push([noChange.name, 'other', noChange.value,0,""])
    ret.push(["other", objectName + "2.0", noChange.value,0,""])
    return ret;

}

sankeyData = mapInternals(v1.props.pageProps.sizeData.treemap, v2.props.pageProps.sizeData.treemap, "1Password ")

function showTreemap() {
  function traverse(tree, i) {
    if (i > 0) {
      return;
    }
    tree.children.forEach((x) => {
      sankeyData.push([tree.name, x.name, x.value, 0, ""]);
      sankeyData.push([x.name, "1Password 2.0", x.value, 0, ""]);
      traverse(x, i + 1);
    });
  }
  traverse(v1.props.pageProps.sizeData.treemap, 0);
}
// showTreemap();
class SankeyChart extends Component {
  options() {
    return {
        sankey: {node: { width: 50}, tooltip: {textStyle: {color: '#FF0000'}, showColorCode: true}},
      title: "Age vs. Weight comparison",
      hAxis: { title: "Age", viewWindow: { min: 0, max: 15 } },
      vAxis: { title: "Weight", viewWindow: { min: 0, max: 15 } },
      legend: "none",
    };
  }
  
  render() {
    console.log(this.options())
    return (
      <div className="container mt-5">
        <h2>App size comparison</h2>
        <h3>1Password 1.0 | 1Password 2.0</h3>
        <Chart
          width={1000}
          height={"300px"}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={sankeyData}
          rootProps={{ "data-testid": "1" }}
          chartEvents={chartEvents}
          options={this.options()}
        />
      </div>
    );
  }
}
const chartEvents = [
  {
    eventName: "select",
    callback({ chartWrapper }) {
      console.log("Selected ", chartWrapper.getChart().getSelection());
    },
  },
];
export default SankeyChart;
