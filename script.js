var squareRotation = 0.0;

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
    attribute vec4 aVertexColor;       //receives vertex colors values on this attribute

    uniform mat4 uModelViewMatrix;      
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
    `;

    // Fragment shader ///////////////
    /*
    The fragment shader is called once for every pixel on each shape to be drawn,
    after the shape's vertices have been processed by the vertex shader.
    Its job is to determine the color of that pixel
    */
    const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
    `;


    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //after creating the shaderProgramm we need to get refrence to the parametters inside the shader to send the data to it
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    var cubeBuffer = initBuffers(gl);

    var then = 0;
    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, cubeBuffer, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

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


function initBuffers(gl) {

    /////positions////////---------------------------------------
    //create an array of positions for the square.
    const positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];

    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the  shape. 
    //We do this by creating a Float32Array from the JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    
    
    /////indices////////---------------------------------------
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ];
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    // Now send the element array >indices< to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    /////Colors////////---------------------------------------
    //each color maps for one vertix from above
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0],    // Front face: white
        [1.0, 0.0, 0.0, 1.0],    // Back face: red
        [0.0, 1.0, 0.0, 1.0],    // Top face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // Left face: purple
    ];

    // Convert the faces colors array into a table for all the vertices.
    var colors = [];
    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        vertexCount: positions.length/3
    };
}


function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //start drawing



    // Create a perspective matrix >>Camera<<,
    //a special matrix that is used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height ratio that matches the display size of the canvas and we only want to see objects between 0.1 units and 100 units away from the camera. 
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    
    
    //modelView Matrix >>Transform<<
    // Set the drawing position to the "identity" point, which is the center of the scene.
    const modelViewMatrix = mat4.create();
    
    // Now move the drawing position a bit to where we want to start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate  >> transform.Position<<
    
    squareRotation += deltaTime;
    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        squareRotation,   // amount to rotate in radians
        [0, 0, 1]);       // axis to rotate around

    //Load the 3d model
    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
    
    const numComponents = 3;  // pull out 3 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to jump over
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
    
    //Load model colors
    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;    // pull out 4 values per iteration
        const type = gl.FLOAT;      // the data in the buffer is 32bit floats
        const normalize = false;    // don't normalize
        const stride = 0;           // how many bytes to jump over
        const offset = 0;           // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    
    {
        const offset = 0;
        const vertexCount = buffers.vertexCount;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}