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

} window.onload = main; // call main onLoad




//
// creates a shader of the given type ( Vertix || fragment ), uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    //load  vertex and fragment shader 
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    /*
    A shader is a program, written using the OpenGL ES Shading Language (GLSL), that takes information about the vertices that make up a shape and generates the data needed to render the pixels onto the screen: namely, the positions of the pixels and their colors.
    */
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);


    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}







    