//
// script entry point
//
function main() {
    const canvas = document.querySelector("#glCanvas");  // .glCanvas will search for class 
                                                         // input[name='login']  will search for input with name login
    
    if (!canvas) { console.error("Couldnt find Canvas"); return }  //terminate if canvas not found

    
    // Initialize the GL context
    const gl = canvas.getContext("webgl"); // before we were using '2d'

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 2.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT); 



}

window.onload = main;



    