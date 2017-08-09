function deleteAlert(){
    window.location.hash = "";
    document.querySelector("#deleteMessage").classList.remove("hidden");
    window.location.hash="#deleteMessage";
}
function cancelAlert(){
    document.querySelector("#deleteMessage").classList.add("hidden");
}














