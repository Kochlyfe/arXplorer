'use strict';

import React, { useRef, useEffect } from 'react';
import drawGraph from './drawGraph';
import { select } from 'd3';

// eslint-disable-next-line react/prop-types
function Graph({ graphData }) {
  const svgRef = useRef();
  const dimensions = {
    height: 600,
    width: 800,
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    drawGraph(svg, graphData, dimensions, svgRef);
  }, [graphData]);

  return (
    <div className="data-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Graph;