$(document).ready(function() {
    $(".bar").each(function() {
        var $bar = $(this),
            $highlight = $bar.next("span.input-highlight");
        $highlight.html($bar.val());
        $bar.on("input", function() {
            $highlight.html(this.value);
        });
    });
});
  
function getData() {
    var matric = document.getElementById("matric").value;
    var sheetID = document.getElementById("key").value;
    Papa.parse('https://docs.google.com/spreadsheets/d/' + sheetID + '/pub?output=csv', {
        download: true,
        header: true,
        complete: function(results) {
            var bool = 0;
            var data = results.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i]["Matriculation Number"].toLowerCase() == matric.toLowerCase()) {
                    generateData(data[i]);
                    bool = 1;
                    break;
                }
            }
            if (bool == 0) {
                var printDiv = document.getElementById("calculator");
                printDiv.style.display = "block";
                printDiv.innerHTML = "Error: Matric number not found. You are not a registered participant. Please try again or email <a href='mailto:MOE2018TRF005@gmail.com'>MOE2018TRF005@gmail.com</a>.";
            }
        } //end complete function
    });
}
  
function generateData(info) {
    var outDiv = document.getElementById("calculator");
    $(outDiv).fadeIn();

    outDiv.innerHTML = "<h2>Record for:</h2>"
    outDiv.innerHTML += "<p>" + info["Full Name"] + ", " + info["Matriculation Number"] + "</p>";
    outDiv.innerHTML += "<p><b>Total no. of lessons attended: " + info.Lessons + "</b></p>";
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
}
  
