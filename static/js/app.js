// Set up url for json file
var url = "data/samples.json"

// Function for Bar and Bubble Chart
function charts(ID) {
    //read in json library with d3
    d3.json(url).then(data => {

        // Getting the sample part of the data
        var samples = data.samples;
        //console.log(samples);

        //Filtering an array that fits to the ID that the user has chosen
        var array_with_id = samples.filter(Object => Object.id == ID);
        //console.log(array_with_id);

        //Bringing the result array
        var array = array_with_id[0];
        //console.log(array);

        //Saving the data into each var
        var sample_values = array.sample_values;
        var otu_ids = array.otu_ids;
        var otu_labels = array.otu_labels;

        //console.log(sample_values);
        //console.log(otu_ids);
        //console.log(otu_labels);

        //Creating Barchart        

        //Declare Trace
        var trace1 = {
            // Use sample_values as the values for the bar chart.
            // Slice for top 10
            // Reverse for descending order.
            x: sample_values.slice(0, 10).reverse(),
            // Use otu_ids as the labels for the bar chart.
            // .Map to add letter OTU infront of the IDs as sample graph shows
            // Reverese for descending order.
            y: otu_ids.slice(0, 10).map(ids => `OTU ${ids}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h",
            type: "bar"
        };

        layout = {
            title: "Top Ten OTUs found for ID:" + ID
        };

        var data = [trace1];
        Plotly.newPlot("bar", data, layout);


        //Creating Bubble Chart

        //Declare Trace
        var trace2 = {
            //Use otu_ids for the x values.
            //Use sample_values for the y values.
            //Use sample_values for the marker size.
            //Use otu_ids for the marker colors.
            //Use otu_labels for the text values.

            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "cyl"
            }

        }

        var data2 = [trace2];
        var layout2 = {
            title: "Bacteria Scale",
            hovermode: "closest",
            xaxis: { title: "OTU ID" + ID },
        }

        Plotly.newPlot("bubble", data2, layout2);

    });
};


//Function to update the demographic Information
function demo_info_update(ID) {
    d3.json(url).then(data => {
        var metadata = data.metadata;
        //var metadata_id = metadata[0].id;
        
        var array_with_meta = metadata.filter(Object => Object.id == ID);
        
        var array = array_with_meta[0];
        //Selecting the right ID for demo info with d3
        var panel = d3.select("#sample-metadata");
        panel.html("");
        
        //console.log(array);
        
        Object.entries(array).forEach(([key, value]) => {
            //var entryTag = panel.append("p");
            //entryTag.text(`${key}: ${value}`)
            panel.append("h6").text(`${key}: ${value}`)
        });
    });
};



function init() {
    //Select the dropdown ID
    var dropdown = d3.select("#selDataset");

    //Add the IDs to dropdown
    d3.json(url).then(data => {
        var select_id = data.names;
        select_id.forEach(id => {
            dropdown.append("option")
                .text(id)
                .property("value", id);
        })
        charts(select_id[0]);
        demo_info_update(select_id[0]);
    });

}
function optionChanged(newID) {
    charts(newID);
    demo_info_update(newID);
}

init();

