//
// script entry point
//
function main() {
    const canvas = document.querySelector("#glCanvas");  // .glCanvas will search for class 
                                                         // input[name='login']  will search for input with name login
    
    if (!canvas) { console.error("Couldnt find Canvas"); return }  //terminate if canvas not found
    console.log(canvas);
}

window.onload = main;



    