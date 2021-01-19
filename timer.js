let timer = window.setInterval(myTimer, 1000);

sessionStorage.time
function myTimer() {
    if (sessionStorage.time == undefined || sessionStorage.time <= 0){
        sessionStorage.time = 1800
    }
    
    sessionStorage.time -= 1;

    if (sessionStorage.time <= 0) {
        window.location.href = "time_out.html";
    }
}