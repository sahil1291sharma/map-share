<template>
  <div id="app">
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as d3 from "d3";
import { MOVE_GRAPH } from "./graph";

export default {
  name: "App",
  computed: {
    ...mapState(["currentLocation"]),
  },
  methods: {
    canMoveTo: function (id) {
      return (
        MOVE_GRAPH[this.currentLocation] &&
        MOVE_GRAPH[this.currentLocation].includes(id)
      );
    },

    notifyMove: function () {
      // Axios.post("/api/notify", { to: id });
    },
  },
  watch: {
    currentLocation: function (val) {
      console.log(`currentLocation changed to ${val}`);
      var paths = document.querySelectorAll("rect");
      for (let r of paths) {
        if (r.id == val) {
          console.log("found");
          var bbox = r.getBBox();
          d3.select("#markerCircle")
            .attr("cx", bbox.x + bbox.width / 2)
            .attr("cy", bbox.y + bbox.height / 2);
        }
      }
    },
  },
  mounted: function () {
    // function handleMouseOver() {
    //   d3.select(this).classed("hover", true);
    // }

    // function handleMouseOut() {
    //   d3.select(this).classed("hover", false);
    // }

    var _vueThis = this;
    var dragHandler = d3
      .drag()
      .subject(function subject(event) {
        console.log("sd");

        return { x: event.x, y: event.y };
      })
      .on("drag", function (event) {
        event.sourceEvent.stopPropagation(); // silence other listeners

        d3.select(this)
          // transform a path
          .attr("transform", "translate(" + event.x + "," + event.y + ")");
        // translate centres for circles
        // .attr("cx", event.x)
        // .attr("cy", event.y);
      })
      .on("end", function (event) {
        var paths = document.querySelectorAll("rect");
        for (var i = 0; i < paths.length; i++) {
          // var bbox = paths[i].getBBox();

          let point = document.querySelector("svg").createSVGPoint();
          point.x = event.x;
          point.y = event.y;

          if (paths[i].isPointInFill(point)) {
            console.log(paths[i].id);

            _vueThis.$store.commit("moveToLocation", paths[i].id);
            _vueThis.currentLocation = paths[i].id;
          }
        }
        // move back
      });
    window.d3 = d3;
    d3.xml("V15.1_MapWithUpdatedResAndAssets.svg").then((data) => {
      d3.select(this.$refs["map"]).node().append(data.documentElement);
      this.svg = d3.select(this.$refs["map"]);

      dragHandler(this.svg.select("#Tok_Inspector"));
    });
  },
};
</script>

<style>
svg {
  max-height: calc(100vh - 10px);
  max-width: calc(100vw - 10px);
}
.hover {
  fill: #69c !important;
}
</style>
