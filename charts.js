function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    var PANEL = d3.select("#bar");

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    Object.entries(result).forEach(([key, value]) => {
      
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    function buildYticks() {
      id_strings = []
      for (let id of otu_ids) {
        id_string = `OTU ID-${id}`
        id_strings.push(id_string)
      }
      return id_strings
    }

    // 8. Create the trace for the bar chart. 
    function buildPlotObject() {
      yticks = buildYticks()
      
      return [{
        x: sample_values,
        y: yticks.slice(0, 10),
        type: 'bar',
        hoverinfo: 'otu_labels',
        orientation: 'h'
      }]
    }

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    
    // 10. Use Plotly to plot the data with the layout.
    var plotObjectArray = buildPlotObject()
            Plotly.newPlot('bar', plotObjectArray, barLayout)
    
    });
  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var PANEL = d3.select("#bubble");
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    Object.entries(result).forEach(([key, value]) => {
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

    // // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    // var plotObjectArray = buildPlotObject()
    //         Plotly.newPlot('bar', plotObjectArray, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: "OTU ID"}
    
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout );
    });
  });
}

function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array.
    // Create a variable that filters the samples for the object with the desired sample number.
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id === sample);
    var result = resultArray[0];
    var metadata = data.metadata;
    
    // 3. Create a variable that holds the washing frequency.
    var washdata = metadata[0];
    var wfreq = washdata.wfreq
   
    // Create the yticks for the bar chart.
    // Use Plotly to plot the bar data and layout.
    //Plotly.newPlot();
    
    // Use Plotly to plot the bubble data and layout.
    //Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: {text: "Belly Button Washing Frequency"},
        gauge: {
          axis: {range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "darkgreen"}]
          }
        }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
