function check(){

    if (document.getElementById("password").value == "HELIUM"){
        document.getElementById("password").style.backgroundColor = "green";
        document.getElementById("NEXT").style.visibility = "visible";
        
    }
    else {
        (document.getElementById("password").value != "HELIUM");
        document.getElementById("password").style.backgroundColor = "red";
    }
    
}