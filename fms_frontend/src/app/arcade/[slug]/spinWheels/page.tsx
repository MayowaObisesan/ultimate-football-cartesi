"use client";

// import * as d3 from "d3";

// const SpinComponent = () => {};

// var padding = { top: 20, right: 40, bottom: 0, left: 0 },
//   w = 500 - padding.left - padding.right,
//   h = 500 - padding.top - padding.bottom,
//   r = Math.min(w, h) / 2,
//   rotation = 0,
//   oldrotation = 0,
//   picked = 100000,
//         ``  oldpick: [] = [],
//   color = d3.scale.category20(); //category20c()
// //randomNumbers = getRandomNumbers();
// //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
// var data = [
//   {
//     label: "Dell LAPTOP",
//     value: 1,
//     question:
//       "What CSS property is used for specifying the area between the content and its border?",
//   }, // padding
//   {
//     label: "IMAC PRO",
//     value: 2,
//     question: "What CSS property is used for changing the font?",
//   }, //font-family
//   {
//     label: "SUZUKI",
//     value: 3,
//     question: "What CSS property is used for changing the color of text?",
//   }, //color
//   {
//     label: "HONDA",
//     value: 4,
//     question: "What CSS property is used for changing the boldness of text?",
//   }, //font-weight
//   {
//     label: "FERRARI",
//     value: 5,
//     question: "What CSS property is used for changing the size of text?",
//   }, //font-size
//   {
//     label: "APARTMENT",
//     value: 6,
//     question:
//       "What CSS property is used for changing the background color of a box?",
//   }, //background-color
//   {
//     label: "IPAD PRO",
//     value: 7,
//     question:
//       "Which word is used for specifying an HTML tag that is inside another tag?",
//   }, //nesting
//   {
//     label: "LAND",
//     value: 8,
//     question:
//       "Which side of the box is the third number in: margin:1px 1px 1px 1px; ?",
//   }, //bottom
//   {
//     label: "MOTOROLLA",
//     value: 9,
//     question:
//       "What are the fonts that don't have serifs at the ends of letters called?",
//   }, //sans-serif
//   {
//     label: "BMW",
//     value: 10,
//     question:
//       "With CSS selectors, what character prefix should one use to specify a class?",
//   },
// ];
// var svg = d3
//   .select("#chart")
//   .append("svg")
//   .data([data])
//   .attr("width", w + padding.left + padding.right)
//   .attr("height", h + padding.top + padding.bottom);
// var container = svg
//   .append("g")
//   .attr("class", "chartholder")
//   .attr(
//     "transform",
//     "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
//   );
// var vis = container.append("g");

// var pie = d3.layout
//   .pie()
//   .sort(null)
//   .value(function (d) {
//     return 1;
//   });
// // declare an arc generator function
// var arc = d3.svg.arc().outerRadius(r);
// // select paths, use arc generator to draw
// var arcs = vis
//   .selectAll("g.slice")
//   .data(pie)
//   .enter()
//   .append("g")
//   .attr("class", "slice");

// arcs
//   .append("path")
//   .attr("fill", function (d, i) {
//     return color(i);
//   })
//   .attr("d", function (d) {
//     return arc(d);
//   });
// // add the text
// arcs
//   .append("text")
//   .attr("transform", function (d) {
//     d.innerRadius = 0;
//     d.outerRadius = r;
//     d.angle = (d.startAngle + d.endAngle) / 2;
//     return (
//       "rotate(" +
//       ((d.angle * 180) / Math.PI - 90) +
//       ")translate(" +
//       (d.outerRadius - 10) +
//       ")"
//     );
//   })
//   .attr("text-anchor", "end")
//   .text(function (d, i) {
//     return data[i].label;
//   });
// container.on("click", spin);
// function spin(d) {
//   container.on("click", null);
//   //all slices have been seen, all done
//   console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
//   if (oldpick.length == data.length) {
//     console.log("done");
//     container.on("click", null);
//     return;
//   }
//   var ps = 360 / data.length,
//     pieslice = Math.round(1440 / data.length),
//     rng = Math.floor(Math.random() * 1440 + 360);

//   rotation = Math.round(rng / ps) * ps;

//   picked = Math.round(data.length - (rotation % 360) / ps);
//   picked = picked >= data.length ? picked % data.length : picked;
//   if (oldpick.indexOf(picked) !== -1) {
//     d3.select(this).call(spin);
//     return;
//   } else {
//     oldpick.push(picked);
//   }
//   rotation += 90 - Math.round(ps / 2);
//   vis
//     .transition()
//     .duration(3000)
//     .attrTween("transform", rotTween)
//     .each("end", function () {
//       //mark question as seen
//       d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
//         "fill",
//         "#111"
//       );
//       //populate question
//       d3.select("#question h1").text(data[picked].question);
//       oldrotation = rotation;

//       /* Get the result value from object "data" */
//       console.log(data[picked].value);

//       /* Comment the below line for restrict spin to sngle time */
//       container.on("click", spin);
//     });
// }
// //make arrow
// svg
//   .append("g")
//   .attr(
//     "transform",
//     "translate(" +
//       (w + padding.left + padding.right) +
//       "," +
//       (h / 2 + padding.top) +
//       ")"
//   )
//   .append("path")
//   .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
//   .style({ fill: "black" });
// //draw spin circle
// container
//   .append("circle")
//   .attr("cx", 0)
//   .attr("cy", 0)
//   .attr("r", 60)
//   .style({ fill: "white", cursor: "pointer" });
// //spin text
// container
//   .append("text")
//   .attr("x", 0)
//   .attr("y", 15)
//   .attr("text-anchor", "middle")
//   .text("SPIN")
//   .style({ "font-weight": "bold", "font-size": "30px" });

// function rotTween(to) {
//   var i = d3.interpolate(oldrotation % 360, rotation);
//   return function (t) {
//     return "rotate(" + i(t) + ")";
//   };
// }

// function getRandomNumbers() {
//   var array = new Uint16Array(1000);
//   var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
//   if (
//     window.hasOwnProperty("crypto") &&
//     typeof window.crypto.getRandomValues === "function"
//   ) {
//     window.crypto.getRandomValues(array);
//     console.log("works");
//   } else {
//     //no support for crypto, get crappy random numbers
//     for (var i = 0; i < 1000; i++) {
//       array[i] = Math.floor(Math.random() * 100000) + 1;
//     }
//   }
//   return array;
// }

// export const SpinWheel = () => {
//   return (
//     <section>
//       <div id="chart"></div>
//       <div id="question">
//         <h1></h1>
//       </div>
//       This is the spin wheel
//     </section>
//   );
// };

import React from "react";
import { wheelItems } from "./WheelItems";
import Wheel from "./components/Wheel";
import {
  ArcadeHeroContainer,
  ArcadeHeroContent,
  ArcadeHeroContentContainer,
  ArcadeHeroImage,
} from "../page";
// import Wheel from "./components/Wheel/Loadable";
// import { Helmet } from 'react-helmet-async';

// import wheelItems from "./WheelItems";
// import { Wheel } from "./components/Wheel/Loadable";
// import { Wheel } from "app/components/Wheel/Loadable";
// import { Content } from "app/components/Content/Loadable";
// import { PowerBar } from "app/components/PowerBar/Loadable";

const gameData = {
  name: "Spin wheel",
  slug: "spin-wheel",
  description:
    "You know about the spin wheel. This wheel is a community wheel. There are default prizes on the wheel but these prizes changes with time as well. Interestingly, the community can decide what goes on the wheel. We limit the number of people that can spin this wheel globally using a computation on the social media network. The lower the traffic, the higher the number of spins and the higher the traffic, the lower the number of spins.",
  shortDescription:
    "You know about the spin wheel. But this one is different. You can win amazing prices on this wheel for real. Real usdt, and other tokes can be won here. Even prizes set by the web3 community probably for a giveaway, etc. An algorithm computes what you win and how you win. You can spin once or multiple times, depending on the traffic on the platform.",
  image:
    "https://raw.githubusercontent.com/MayowaObisesan/ForImages/main/Screenshot%202024-01-31%20at%2020-47-56%20Screenshot.png",
  category: "arcade, casual",
  minAge: 0,
  popularityStatus: "high",
};

export function SpinWheel() {
  // const renderHeader = ()=>{
  //   return <Helmet>
  //   <title>Home Page</title>
  //   <meta name="description" content="Spin wheel homepage" />
  // </Helmet>
  // }
  return (
    <>
      <ArcadeHeroContainer>
        <ArcadeHeroContentContainer>
          <ArcadeHeroContent
            header={gameData.name}
            description={gameData.shortDescription || gameData.description}
          >
            <button className="btn btn-primary rounded-box">Play Now</button>
          </ArcadeHeroContent>
          <ArcadeHeroImage src={gameData.image} />
        </ArcadeHeroContentContainer>
      </ArcadeHeroContainer>
      {/* {renderHeader()} */}
      <div style={{ padding: "25px 0" }}>
        <Wheel items={wheelItems} />
        {/* <PowerBar /> */}
        {/* <Content /> */}
      </div>
    </>
  );
}
