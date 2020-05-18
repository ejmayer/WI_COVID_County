// bargraph function
function drawGraphs(chosenSampleID) {
    // used to test initial setup
    console.log("DrawBargraph test: ", chosenSampleID);

    // read json file
    d3.json("samples.json").then((data) => {
        
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // pull neccesary data from json for graph
        var samples = data.samples;

        // ensure selected value from drop down matches desired data from json
        var resultArray = samples.filter(sampleObj => sampleObj.id == chosenSampleID);

        // retain data id value
        var result = resultArray[0];
        
        //  retain otu id arrays from selected  dropdown value
        var otu_ids = result.otu_ids;

        // retain otu labels from selected dropdown value
        var otu_labels = result.otu_labels;

        // retain sample value of each selected dropdown value
        var sample_values = result.sample_values;

        // declare yticks using out Id's
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
        
        // set up bar data
        var barData = [
            {
                type: "bar",
                orientation: "h",
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                text: otu_labels.slice(0, 10).reverse(),
                color: "seafoamgreen"
            }
        ];
        // setup bar layout
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin:  {t: 30, l: 150}
        };
    
        // call new bar graph
        Plotly.newPlot("bar", barData, barLayout); 

        // @TODO: Build a Bubble Chart using the sample data
        var LayoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "Id's" }
            // hovermode: "closest",
            };
    
        var DataBubble = [
            {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
                }
            }
        ];
    
        Plotly.newPlot("bubble", DataBubble, LayoutBubble);
  
        // build gauge 
         var gaugeData = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency ` },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                    steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "greenyellow" },
                    { range: [4, 6], color: "lime" },
                    { range: [6, 8], color: "limegreen" },
                    { range: [8, 9], color: "forestgreen" },
                ]}
            }
          ];
          var gaugeLayout = { 
              width: 600, 
              height: 400, 
              margin: { t: 40, b: 40, l:100, r:100 } 
            };
          Plotly.plot("gauge", gaugeData, gaugeLayout);
    });
}
// function to create and add metadata to metadata table
function showMetaData(chosenSampleID) {
    console.log("ShowMetaData test: ", chosenSampleID);

    // read the json file to get data
    d3.json("samples.json").then((data)=> {
            
        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log("metadata:"+metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// function for when dropdown changes
function optionChanged(newSampleID)
{
    console.log("Dropdown reset test value: ", newSampleID);

    showMetaData(newSampleID);
    drawGraphs(newSampleID);
}

function Init() {   
    console.log("Initializing Screen:");
    
    // select dataset from dropdown select element
    var selector = d3.select("#selDataset");

    // create select options from list of sample names
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sampleID) => {
            selector.append("option").text(sampleID).property("value", sampleID);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        drawGraphs(firstSample);
        showMetaData(firstSample);
    });
}

Init();