// Build the metadata panel

const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
function buildMetadata(sample, d3, data) {
  console.log("Before d3.json() call in buildMetadata");
  d3.json(url).then((data) => {
    console.log(data);
    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(id => id.id == sample);
    console.log(result);
    let first_result = result[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    // Inside a loop, you will need to use d3 to append new
    Object.entries(first_result).forEach(([key,value]) => {
      // tags for each key-value in the filtered metadata.
      let valueData = value[0];
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
  console.log("After d3.json() call in buildMetadata");
}


// function to build bar chart
function buildBar(sample, d3, data) {
  console.log("Before d3.json() call in buildBar");
  d3.json(url).then((data) => {
    // Get the samples field
    let sample_data = data.samples;
    // Filter the samples for the object with the desired sample number
    let result = sample_data.filter(id => id.id == sample);
    let first_result = result[0];
    // Get the otu_ids, otu_labels, and sample_values
    let sample_values = first_result.sample_values.slice(0,10);;
    let otu_ids = first_result.sample_values.slice(0,10);;
    let otu_labels = first_result.sample_values.slice(0,10);;
    console.log(sample_values);
    console.log(otu_ids);
    console.log(otu_labels);
  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let xticks = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();
    // Build a Bar Chart
    let bar_trace = {
      x: sample_values.reverse(),
      y: otu_ids.map(item => `OTU ${item}`).reverse(),
      text: otu_labels.reverse(),
      type: 'bar',
      orientation: 'h'
  };
      let layout = {title: "Top 10 Bacteria Cultures Found"};
      Plotly.newPlot("bar", [bar_trace], layout);
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
  });
  console.log("After d3.json() call in buildBar");
}




// Function to Create Bubble
function buildBubble(sample, d3, data) {
  // Get the samples field
  let sample_data = data.samples;
  // Filter the samples for the object with the desired sample number
  let result = sample_data.filter(id => id.id == sample);
  let first_result = result[0];
  // Get the otu_ids, otu_labels, and sample_values
  let sample_values = first_result.sample_values.slice(0,10);;
  let otu_ids = first_result.sample_values.slice(0,10);;
  let otu_labels = first_result.sample_values.slice(0,10);;
  console.log(sample_values);
  console.log(otu_ids);
  console.log(otu_labels);


  let bubble_trace = {
    x: otu_ids.reverse(),
    y: sample_values.reverse(),
    text: otu_labels.reverse(),
    mode: 'markers',
    marker: {
        size: sample_values,
        color: otu_ids,
    }
  };
  let layout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'Number of Bacteria'}
  };
  Plotly.newPlot("bubble", [bubble_trace], layout);

}





// Function to run on page load
function init(d3, data) {
  console.log("Before d3.json() call in init");
  d3.json(url).then((data) => {
    // Get the names field
    // Use d3 to select the dropdown with id of `#selDataset`
  let dropdownMenu = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  let sample_names = data.names;
  console.log(sample_names);

  for (let id of sample_names) {
    dropdownMenu.append("option").attr("value", id).text(id);
  };
    let first_entry = sample_names[0];
    console.log(first_entry);
    buildBar(first_entry, d3, data);
    buildBubble(first_entry, d3, data);
    buildMetadata(first_entry, d3, data);

    // Build charts and metadata panel with the first sample

  });
  console.log("After d3.json() call in init");
}

// Function for event listener
function optionChanged(newSample) {
  console.log(newSample);
  buildBar(newSample);
  buildBubble(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init(d3);
