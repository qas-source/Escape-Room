//Corey's JS

sessionStorage.counter = 0   //introduction the counter variable
let total = 0

function submit(){ // function linked with submit button on trivia page
    if (document.getElementById("br").checked){ // first radio button
        total += 1;
    }
    if (document.getElementById("semicolon").checked){ // first checkbox
        total += 1;
    }
    if (document.getElementById("displayGrid3").checked){ // seocnd radio button
        total += 1;
    }
    if (document.getElementById("doctype").value == "!DOCTYPE html"){ // textbox
        total += 1;
    }
    if (total == 4) { //final counter to determine if player wins
        window.location.href = "end.html"; //portal to end page
    } else {
        window.location.href = "incorrect.html"; //portal to incorrect
    }
    sessionStorage.counter = total; //making sure the session storage matches the total
    
   

}