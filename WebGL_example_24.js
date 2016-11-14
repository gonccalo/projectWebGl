//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24.js 
//
//  Phong Illumination Model on the CPU - Several light sources
//
//  References: www.learningwebgl.com + E. Angel examples
//
//  J. Madeira - October 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;
var globalTx = 0.0;

var tokens;
// The local transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.5;

var sy = 0.5;

var sz = 0.5;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// Local Animation controls

var rotationXX_ON = 0;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;
 
var rotationYY_ON = 0;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 0;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;
 
 var frente = 0;
 var lado = 0;
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;

// NEW --- Model Material Features

// Ambient coef.

var kAmbi = [ 0.23, 0.23, 0.23 ];

// Difuse coef.

var kDiff = [ 0.28, 0.28, 0.28 ];

// Specular coef.

var kSpec = [ 0.77, 0.77, 0.77 ];

// Phong coef.

var nPhong = 100;
var normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
];

var vertices = [

		// FRONT FACE
		 
		-0.25, -0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		 
		 0.25,  0.25,  0.25,

		 
		 0.25,  0.25,  0.25,
		 
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE
		
		-0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25, -0.25,

		 
		 0.25,  0.25, -0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 
		
		-0.25, -0.25, -0.25,
		 
		 0.25, -0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 
		
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25, -0.25,

		-0.25, -0.25,  0.25,
		 
		 
		-0.25,  0.25,  0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 
		
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 0.25, -0.25, -0.25,
		 
		 
		 0.25,  0.25, -0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 
		
		-0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,

		-0.25, -0.25, -0.25,
		 
		 
		-0.25,  0.25, -0.25,
		 
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,			 
];

// And their colour

var colors = [

		 // FRONT FACE
		 	
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 	
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE
		 	
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,

		 	
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE
		 	
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,

		 	
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE
		 	
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,

		 	
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE
		 	
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,

		 	
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 			 
		 			 
		 // BACK FACE
		 	
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,

		 	
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,			 			 
];
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Color Buffers

function initBuffers() {	
	
	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Computing the illumination and rendering the model

function computeIllumination( mvMatrix ) {

	// Phong Illumination Model
	
	// Clearing the colors array
	
	for( var i = 0; i < colors.length; i++ )
	{
		colors[i] = 0.0;
	}
	
    // SMOOTH-SHADING 

    // Compute the illumination for every vertex

    // Iterate through the vertices
    
    for( var vertIndex = 0; vertIndex < vertices.length; vertIndex += 3 )
    {	
		// For every vertex
		
		// GET COORDINATES AND NORMAL VECTOR
		
		var auxP = vertices.slice( vertIndex, vertIndex + 3 );
		
		var auxN = normals.slice( vertIndex, vertIndex + 3 );

        // CONVERT TO HOMOGENEOUS COORDINATES

		auxP.push( 1.0 );
		
		auxN.push( 0.0 );
		
        // APPLY CURRENT TRANSFORMATION

        var pointP = multiplyPointByMatrix( mvMatrix, auxP );

        var vectorN = multiplyVectorByMatrix( mvMatrix, auxN );
        
        normalize( vectorN );

		// VIEWER POSITION
		
		var vectorV = vec3();
		
		if( projectionType == 0 ) {
		
			// Orthogonal 
			
			vectorV[2] = 1.0;
		}	
		else {
			
		    // Perspective
		    
		    // Viewer at ( 0, 0 , 0 )
		
			vectorV = symmetric( pointP );
		}
		
        normalize( vectorV );

	    // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR
	    
	    // FOR EACH LIGHT SOURCE
	    
	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if( lightSources[l].isOff() ) {
				
				continue;
			}
			
	        // INITIALIZE EACH COMPONENT, with the constant terms
	
		    var ambientTerm = vec3();
		
		    var diffuseTerm = vec3();
		
		    var specularTerm = vec3();
		
		    // For the current light source
		
		    ambient_Illumination = lightSources[l].getAmbIntensity();
		
		    int_Light_Source = lightSources[l].getIntensity();
		
		    pos_Light_Source = lightSources[l].getPosition();
		    
		    // Animating the light source, if defined
		    
		    var lightSourceMatrix = mat4();
		    
		    // COMPLETE THE CODE FOR THE OTHER ROTATION AXES
		    
		    if( lightSources[l].isRotYYOn() ) 
		    {
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[l].getRotAngleYY() ) );
			}
			
	        for( var i = 0; i < 3; i++ )
	        {
			    // AMBIENT ILLUMINATION --- Constant for every vertex
	   
			    ambientTerm[i] = ambient_Illumination[i] * kAmbi[i];
	
	            diffuseTerm[i] = int_Light_Source[i] * kDiff[i];
	
	            specularTerm[i] = int_Light_Source[i] * kSpec[i];
	        }
	    
	        // DIFFUSE ILLUMINATION
	        
	        var vectorL = vec4();
	
	        if( pos_Light_Source[3] == 0.0 )
	        {
	            // DIRECTIONAL Light Source
	            
	            vectorL = multiplyVectorByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
	        }
	        else
	        {
	            // POINT Light Source
	
	            // TO DO : apply the global transformation to the light source?
	
	            vectorL = multiplyPointByMatrix( 
							lightSourceMatrix,
							pos_Light_Source );
				
				for( var i = 0; i < 3; i++ )
	            {
	                vectorL[ i ] -= pointP[ i ];
	            }
	        }
	
			// Back to Euclidean coordinates
			
			vectorL = vectorL.slice(0,3);
			
	        normalize( vectorL );
	
	        var cosNL = dotProduct( vectorN, vectorL );
	
	        if( cosNL < 0.0 )
	        {
				// No direct illumination !!
				
				cosNL = 0.0;
	        }
	
	        // SEPCULAR ILLUMINATION 
	
	        var vectorH = add( vectorL, vectorV );
	
	        normalize( vectorH );
	
	        var cosNH = dotProduct( vectorN, vectorH );
	
			// No direct illumination or viewer not in the right direction
			
	        if( (cosNH < 0.0) || (cosNL <= 0.0) )
	        {
	            cosNH = 0.0;
	        }
	
	        // Compute the color values and store in the colors array
	        
	        var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);
	        
	        var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);
	        
	        var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);
	        
			colors[vertIndex] += tempR;
	        
	        // Avoid exceeding 1.0
	        
			if( colors[vertIndex] > 1.0 ) {
				
				colors[vertIndex] = 1.0;
			}
	        
	        // Avoid exceeding 1.0
	        
			colors[vertIndex + 1] += tempG;
			
			if( colors[vertIndex + 1] > 1.0 ) {
				
				colors[vertIndex + 1] = 1.0;
			}
			
			colors[vertIndex + 2] += tempB;
	        
	        // Avoid exceeding 1.0
	        
			if( colors[vertIndex + 2] > 1.0 ) {
				
				colors[vertIndex + 2] = 1.0;
			}
	    }	
	}
}

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// NEW - Aux. Function for computing the illumination
	
	computeIllumination( mvMatrix );
	
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	initBuffers();
	
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		//globalTz = -2.5;

		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	mvMatrix = rotationYYMatrix(globalTx);
	mvMatrix = mult(translationMatrix( 0, 0, globalTz ), mvMatrix);
	//mvMatrix = mult(rotationYYMatrix(globalTx), mvMatrix);
	
	// Instantianting the current model
	for (var i = 0; i < tokens.length; i++) {
		for (var j = 0; j < tokens[i].length; j++){
			if(tokens[i][j] == '+'){
				drawModel( angleXX, angleYY, angleZZ, 
	           sx, sy, sz,
	           tx + (-0.375+(j*0.25)), ty, tz +(0.375 + (i*-0.25)),
	           mvMatrix,
	           primitiveType );
			}
			else{
			}
		}
	}	
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Local rotations
		
		if( rotationXX_ON ) {

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
	    }

		// Rotating the light sources
		for(var li = 0; li < lightSources.length; li++){
			if (lightSources[li].isRotYYOn()) {
				var angle = lightSources[li].getRotAngleYY() + (90 * elapsed) / 1000.0;
		
				lightSources[li].setRotAngleYY( angle );				
			}
		}
	/*
		if( lightSources[0].isRotYYOn() ) {

			var angle = lightSources[0].getRotAngleYY() + (90 * elapsed) / 1000.0;
		
			lightSources[0].setRotAngleYY( angle );
		}
	
		if( lightSources[1].isRotYYOn() ) {

			var angle = lightSources[1].getRotAngleYY() - 0.5 * (90 * elapsed) / 1000.0;
		
			lightSources[1].setRotAngleYY( angle );
		}
		*/
	}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}




//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}

//----------------------------------------------------------------------------

function setEventListeners(){
	
	// File loading
	
	// Adapted from:
	
	// http://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
	
	document.getElementById("file").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			tokens = this.result.split("\n");		
			console.log(tokens);
		};
			
		reader.readAsText( file );		
	}

    // Dropdown list
	
	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
				
		// Getting the selection
		
		var p = projection.selectedIndex;
				
		switch(p){
			
			case 0 : projectionType = 0;
				break;
			
			case 1 : projectionType = 1;
				break;
		}  	
	});      

	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
		
		var mode = list.selectedIndex;
				
		switch(mode){
			
			case 0 : primitiveType = gl.TRIANGLES;
				break;
			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;
			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});      

	// Button events
	
	
	document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            globalTx -= 0.5;
            lado = 1;
            frente = 0;
            break;
        case 38:
            globalTz += 0.01;
            frente = 1;
            lado = 0;
            break;
        case 39:
            globalTx += 0.5;
            lado = 1;
            frente = 0;
            break;
        case 40:
            globalTz -= 0.01;
            frente = 1;
            lado = 0;
            break;
    }
}; 
      
	document.getElementById("reset-button").onclick = function(){
		
		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		sx = 0.5;

		sy = 0.5;

		sz = 0.5;
		
		rotationXX_ON = 0;
		
		rotationXX_DIR = 1;
		
		rotationXX_SPEED = 1;

		rotationYY_ON = 0;
		
		rotationYY_DIR = 1;
		
		rotationYY_SPEED = 1;

		rotationZZ_ON = 0;
		
		rotationZZ_DIR = 1;
		
		rotationZZ_SPEED = 1;
	};            
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );

		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffers();
	
	tick();		// NEW --- A timer controls the rendering / animation    

	outputInfos();
}


