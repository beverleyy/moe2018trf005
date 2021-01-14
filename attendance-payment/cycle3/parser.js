/* You might not need jQuery... */
// We only need the fadein (not even the fadeout lmao)
// This function replicates the fadeIn() function from jQuery
function fadein(el, display) {
    if (display != "block")
        el.style.opacity = 0;
    el.style.display = "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

/* Grab the data from the Excel sheet and parse it */
// Activates on submission of form (either hit Enter or click Submit)
function getData(){
    // Retrieve data from user inputs, trim off whitespace
    var matric = document.getElementById("matric").value.trim();
    var sheetID = document.getElementById("key").value.trim();

    // Cache DOM elements as vars
    var printDiv = document.getElementById("calculator");
    var outDiv = document.getElementById("output");
    var loader = document.getElementsByClassName("swing")[0];

    // Print loading animation
    fadein(printDiv,printDiv.style.display);
    fadein(loader,loader.style.display);
    outDiv.style.display = "none";

    // Call Papa Parse on the Google spreadsheet
    // The additional heroku in front is a special server to bypass CORS
    Papa.parse('https://moe2018trf005cors.herokuapp.com/https://docs.google.com/spreadsheets/d/' + sheetID + '/pub?output=csv', {
        download: true, //this needs to be true for spreadsheet URL
        header: true, //this needs to be true to sort the data later
        error: function(){ //if parsing failed
            var errStr = "Error: Failed to retrieve data from file. Please ensure you have entered the correct key. Email <a href='mailto:MOE2018TRF005@gmail.com'>MOE2018TRF005@gmail.com</a> if the problem persists.";
            errFunc(errStr,outDiv,loader);
        },
        complete: function(results){ //When parsing done:
            var bool = 0;
            var data = results.data;
            for (var i=0; i<data.length; i++) {
                //Check if entered matric number matches the current student
                if (data[i]["Matriculation Number"].trim().toLowerCase() == matric.toLowerCase()) {
                    generateData(data[i],outDiv,loader); //Display the student's data
                    bool = 1; //Turn off error message
                    break; //Exit the loop
                }//end if
            }//end for
            //Error message, if matric number returns no matches
            if (bool == 0) {
                var errStr = "Error: Matric number not found. You are not a registered participant. Please try again or email <a href='mailto:MOE2018TRF005@gmail.com'>MOE2018TRF005@gmail.com</a>.";
                errFunc(errStr,outDiv,loader);
            }
        } //end complete function
    }); //end Parse
} //end getData

/* Error message function */
function errFunc(errMsg,outDiv,loader){
    outDiv.innerHTML = errMsg;
    loader.style.display = "none";
    fadein(outDiv,outDiv.style.display);
}
  
/* Function to print out student data */
// Probably not the best way to populate the report 
// But brute-forced because I didn't have time to write a proper one

// Takes 3 arguments:
// 1. Parser data output
// 2. Report element
// 3. Loader element (so it can be hidden)

function generateData(info,outDiv,loader){
    outDiv.innerHTML = "<h2>Record for:</h2>"
    outDiv.innerHTML += "<h3>" + info["Full Name"] + ", " + info["Matriculation Number"] + "</h3>";
    outDiv.innerHTML += "<h3>Total payment due: <b>$" + info.TOTAL + "</b></h3>";
    outDiv.innerHTML += "<p>Please submit your payment claim form by <b>31 January 2021</b>.</p><hr>";
    outDiv.innerHTML += "<p><b>Pre-tests attended:</b> " + info.PreTests + " &times; $12 = $"+(parseInt(info.PreTests)*12)+"</p>";
    outDiv.innerHTML += "<p><b>Post-tests attended:</b> " + info.PostTests + " &times; $14 = $"+(parseInt(info.PostTests)*14)+"</p>";
    outDiv.innerHTML += "<p><b>Total no. of lessons attended:</b> " + info.Lessons + " &times; $28 = $"+(parseInt(info.Lessons)*28)+"</p>";
    if(info.FGD == "Y")
        outDiv.innerHTML += "<p><b>Focus group discussion:</b> $20</p>";
    else
        info.FGD += "/A";
    if(info.EXTRA) 
        outDiv.innerHTML += "<p><b>Modified payment (see remarks):</b> $" + info.EXTRA + "</p>";
    if(info.Remarks)
        outDiv.innerHTML += "<p><b>Remarks:</b><br>" + info.Remarks + "</p>";
    outDiv.innerHTML += "<hr><h3>Detailed attendance:</h3>";
    outDiv.innerHTML += "Pre-Test Speaking: " + info["Pre-S"];
    outDiv.innerHTML += "<br>Pre-Test Writing: " + info["Pre-W"];
    outDiv.innerHTML += "<br>Lesson 1: " + info.Lesson1 + ((info.Class == "Delta" && info.Lesson1 == "N") ? "/A" : "");
    outDiv.innerHTML += "<br>Lesson 2: " + info.Lesson2 + ((info.Class == "Delta" && info.Lesson2 == "N") ? "/A" : "");
    outDiv.innerHTML += "<br>Lesson 3: " + info.Lesson3 + ((info.Class == "Delta" && info.Lesson3 == "N") ? "/A" : "");
    outDiv.innerHTML += "<br>Lesson 4: " + info.Lesson4 + ((info.Class == "Delta" && info.Lesson4 == "N") ? "/A" : "");
    outDiv.innerHTML += "<br>Lesson 5: " + info.Lesson5 + ((info.Class == "Delta" && info.Lesson5 == "N") ? "/A" : "");
    outDiv.innerHTML += "<br>Post-Test Speaking: " + info["Post-S"];
    outDiv.innerHTML += "<br>Post-Test Writing: " + info["Post-W"];
    outDiv.innerHTML += (info.Class == "Gamma") ? "<br>Focus Group Discussion: " + info.FGD : "";
    outDiv.innerHTML += "</p>";
    outDiv.innerHTML += "<p>(Y = attended, N = did not attend, N/A = not eligible)</p><hr>";
    outDiv.innerHTML += "<p>If there is any discrepancy, please email <a href='mailto:MOE2018TRF005@gmail.com'>MOE2018TRF005@gmail.com</a>.";
    loader.style.display = "none";
    fadein(outDiv,outDiv.style.display);
}