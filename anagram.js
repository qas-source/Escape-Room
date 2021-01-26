//Corey's JS

function check(){

    if (document.getElementById("password").value == "HELIUM"){ //if they get right answer (helium)
        document.getElementById("password").style.backgroundColor = "green"; // making background of textbox green
        document.getElementById("NEXT").style.visibility = "visible"; // making button visible
        
    }
    else {
        (document.getElementById("password").value != "HELIUM"); //if they get the wrong answer (not helium)
        document.getElementById("password").style.backgroundColor = "red"; //making background of textbox green
    }
    
}