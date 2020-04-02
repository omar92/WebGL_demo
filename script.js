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


    /// The shaders  /////////////////////////////////////////////////////////////////////////////
    /* 
    A shader is a program, written using the OpenGL ES Shading Language (GLSL),
    that takes information about the vertices that make up a shape and generates 
    the data needed to render the pixels onto the screen: namely, the positions 
    of the pixels and their colors.
    */
    

    // Vertex shader program ///////////////
    /*
    Each time a shape is rendered, the vertex shader is run for each vertex in the shape.
    Its job is to transform the input vertex from its original coordinate system into the
    clipspace coordinate system used by WebGL
    */
    const vsSource = `
    attribute vec4 aVertexPosition;    //receives vertex position values on this attribute

    uniform mat4 uModelViewMatrix;      
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
    `;

    // Fragment shader ///////////////
    /*
    The fragment shader is called once for every pixel on each shape to be drawn,
    after the shape's vertices have been processed by the vertex shader.
    Its job is to determine the color of that pixel
    */
    const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `;



}

window.onload = main;



    