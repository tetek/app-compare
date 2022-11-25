import React, { Component } from "react";
import Chart from "react-google-charts";
let sankeyData = [["From", "To", "Weight", "change"]];

const v1 = require("../v1.json");
const v2 = require("../v2.json");
const columns = [
  { type: "string", id: "From" },
  { type: "string", id: "to" },
  { type: "number", id: "sizee" },
  { type: "number", id: "size change" },
  // { type: 'string',  role: 'tooltip',p: {html: true} }
  { 'type': 'string', 'role': 'tooltip'}
];
const noChange = { name: "no size change", value: 0, objects: [] };
const shrinked = { name: "shrinked", value: 0, objects: [] };
const grew = { name: "grew", value: 0, objects: [] };
// const added = { name: "added", value: 0, objects: [] };
// const removed = { name: "removed", value: 0, objects: [] };

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
      ret.push([objectName, xv1.name, xv1.value, 0, `${xv1.name}<br> old size: <b>${xv1.value/1000}Kb</b>`]);
      ret.push([xv1.name, "shrinked", xv2.value, xv2.value - xv1.value, `${xv1.name}<br>shrinked <b>${(xv2.value/xv1.value).toFixed(1)}x</b>`]);
      xv2.diff = xv2.value - xv1.value;
      shrinked.objects.push(xv2);
      ret.push(["shrinked", objectName + "8.0", xv2.value, 0,`${xv2.name}<br> new size: <b>${xv2.value/1000}Kb</b>`]);
    } else {
      ret.push([objectName, xv1.name, xv1.value, 0,`${xv1.name}<br> size: <b>${xv1.value/1000}Kb</b>`]);
      //   ret.push(["grew", xv2.name, xv2.value, xv2.value - xv1.value]);
      ret.push([xv1.name, "grew", xv2.value, xv2.value - xv1.value,`${xv1.name}<br>grew <b>${(xv2.value/xv1.value).toFixed(1)}x</b>`]);
      xv2.diff = xv2.value - xv1.value;
      grew.objects.push(xv2);
      ret.push(["grew", objectName + "8.0", xv2.value, 0,`${xv2.name}<br> new size: <b>${xv2.value/1000}Kb</b>`]);
    }
  });
  ret.push([objectName, "other", noChange.value, 0,`<b>${noChange.value/1000}Kb</b>`]);
  ret.push(["other", "no size change", noChange.value, 100,"<b>1:1</b>"]);
  ret.push(["no size change", objectName + "8.0", noChange.value, 0,`<b>${noChange.value/1000}Kb</b>`]);
  return ret;
}

function show(obj) {
  const ret = [columns];
  obj.objects.forEach((x) => {
    ret.push([obj.name, x.name, x.value, x.value, `${x.name}<br> difference:<b>${x.diff/1000} Kb</b>`]);
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
              console.log(grew)
              sankeyData = show(grew);
            } else if (chart.getSelection()[0].name === "no size change") {
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
      sankey: { iterations: 32, node: { width: 50, interactivity: true }},
      tooltip: { isHtml: true} ,
    };
  }
  goBack() {
    sankeyData = mapInternals(v1.props.pageProps.sizeData.treemap, v2.props.pageProps.sizeData.treemap, "1Password ");
    this.forceUpdate();
  }
  render() {
    // console.log(this.chartEvents);
    return (
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-2">1Password<h1>{v1.props.pageProps.outerData.build_products[0].version}</h1>
        <h3>{v1.props.pageProps.outerData.size.installedSize/1000}kb</h3>
       
        </div>
        <div className="col-md-auto">                
          <Chart
            width={"650px"}
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
          <br/><br/>
        
        
        </div>
        <div className="col col-lg-2">1Password <h1>{v2.props.pageProps.outerData.build_products[0].version} (latest)</h1>
        <h3>{v2.props.pageProps.outerData.size.installedSize/1000}kb</h3>
        </div>
        
      </div>
    );
  }
}

export default SankeyChart;
