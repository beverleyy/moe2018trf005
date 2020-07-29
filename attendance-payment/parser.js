/* Form input effect script */
// Honestly this is a little extra, but it looks nice, so...
$(document).ready(function(){
    // For each of the blanks
    $(".bar").each(function(){
        // Cache the variables
        var $bar = $(this),
            $highlight = $bar.next("span.input-highlight");
        // Dupe the input text to the highlight, which changes width
        $highlight.html($bar.val());
        $bar.on("input", function(){
            $highlight.html(this.value);
        });
    });
});

/* Grab the data from the Excel sheet and parse it */
// Activates on submission of form (either hit Enter or click Submit)
function getData(){
    // Retrieve data from user inputs, trim off whitespace
    var matric = document.getElementById("matric").value.trim();
    var sheetID = document.getElementById("key").value.trim();
    // Call Papa Parse on the Google spreadsheet
    Papa.parse('https://docs.google.com/spreadsheets/d/' + sheetID + '/pub?output=csv', {
        download: true, //this needs to be true for spreadsheet URL
        header: true, //this needs to be true to sort the data later
        complete: function(results){ //When parsing done:
            var bool = 0;
            var data = results.data;
            for (var i=0; i<data.length; i++) {
                //Check if entered matric number matches the current student
                if (data[i]["Matriculation Number"].trim().toLowerCase() == matric.toLowerCase()) {
                    generateData(data[i]); //Display the student's data
                    bool = 1; //Turn off error message
                    break; //Exit the loop
                }//end if
            }//end for
            //Error message, if matric number returns no matches
            if (bool == 0) {
                var printDiv = document.getElementById("calculator");
                $(printDiv).fadeIn();
                printDiv.innerHTML = "Error: Matric number not found. You are not a registered participant. Please try again or email <a href='mailto:MOE2018TRF005@gmail.com'>MOE2018TRF005@gmail.com</a>.";
            }
        } //end complete function
    }); //end Parse
} //end getData
  
/* Function to print out student data */
// Takes 1 argument, the data output by the parser
function generateData(info){
    var outDiv = document.getElementById("calculator");
    $(outDiv).fadeIn();
    outDiv.innerHTML = "<h2>Record for:</h2>"
    outDiv.innerHTML += "<p>" + info["Full Name"] + ", " + info["Matriculation Number"] + "</p>";
    outDiv.innerHTML += "<p><b>Total no. of lessons attended: " + info.Lessons + "</b></p>";
    if(info.EXTRA) 
        outDiv.innerHTML += "<p><b>Extra payment (see remarks): " + info.EXTRA + "</b></p>";
    if(info.Remarks)
        outDiv.innerHTML += "<p><b>Remarks:</b><br> + info.Remarks + "</p>";
    outDiv.innerHTML += "<p><b>Total payment due: $" + info.TOTAL + "</b></p>";
    outDiv.innerHTML += "<hr><h3>Detailed attendance:</h3>";
    outDiv.innerHTML += "Pre-Test Speaking: " + info["Pre-S"];
    outDiv.innerHTML += "<br>Pre-Test Writing: " + info["Pre-W"];
    outDiv.innerHTML += "<br>Lesson 1: " + info.Lesson1;
    outDiv.innerHTML += "<br>Lesson 2: " + info.Lesson2;
    outDiv.innerHTML += "<br>Lesson 3: " + info.Lesson3;
    outDiv.innerHTML += "<br>Lesson 4: " + info.Lesson4;
    outDiv.innerHTML += "<br>Lesson 5: " + info.Lesson5;
    outDiv.innerHTML += "<br>Post-Test Speaking: " + info["Post-S"];
    outDiv.innerHTML += "<br>Post-Test Writing: " + info["Post-W"];
    outDiv.innerHTML += "<br>Focus Group Discussion: " + info.FGD;
    outDiv.innerHTML += "</p>";
    outDiv.innerHTML += "<p>(Y = attended, N = did not attend)</p>";
}
  
