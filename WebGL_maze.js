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
var floorVertexBuffer = null;
var wallVertexTextureCoordBuffer = null;
var floorVertexTextureCoordBuffer = null;
//var triangleVertexColorBuffer = null;
// The GLOBAL transformation parameters

var globalTz = 0.0;
var andar = 0.0;
var rodar = 0.0;
var oldTx = 0.0;
var globalTx = 0.0;
var labirin = [];

var topView = false;

// textures
var neheTexture;
var floorTexture;

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
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	

	//floor

	floorVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
	var floor = [
                      -0.25,  -0.25,  0.25,
		 
				       0.25,  -0.25,  0.25,
		 
				       0.25,  -0.25, -0.25,

			      	   0.25,  -0.25, -0.25,
		 
		              -0.25,  -0.25, -0.25,
		 
			          -0.25,  -0.25,  0.25,
					]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floor), gl.DYNAMIC_DRAW);
	floorVertexBuffer.itemSize = 3;
	floorVertexBuffer.numItems = floor.length / 3;
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			floorVertexBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
	/*
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	*/
	
	// wall texture
	wallVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wallVertexTextureCoordBuffer);
    var wallTextureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

	  // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Left face
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,

      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,

      // Right face
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Back face
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,

      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallTextureCoords), gl.STATIC_DRAW);
    wallVertexTextureCoordBuffer.itemSize = 2;
    wallVertexTextureCoordBuffer.numItems = 36;
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, wallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //floor texture
    floorVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
    var floorTextureCoords = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorTextureCoords), gl.STATIC_DRAW);
    floorVertexTextureCoordBuffer.itemSize = 2;
    floorVertexTextureCoordBuffer.numItems = 6;
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1i(shaderProgram.samplerUniform0, 0);
    gl.activeTexture(gl.TEXTURE0);
}

//----------------------------------------------------------------------------

//  Computing the illumination and rendering the model

function computeIllumination( mvMatrix ) {

	// Phong Illumination Model
	colors.fill(0);
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
		var vectorV = symmetric( pointP );
		
        normalize( vectorV );

	    // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR
	    
	    // FOR EACH LIGHT SOURCE
	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if( lightSources[l].isOff() ) {
				
				continue;
			}
			
	        // INITIALIZE EACH COMPONENT, with the constant terms
	
		    var ambientTerm = [0,0,0];//vec3();
		
		    var diffuseTerm = [0,0,0];//vec3();
		
		    var specularTerm = [0,0,0];//vec3();
		
		    // For the current light source
		
		    ambient_Illumination = lightSources[l].getAmbIntensity();
		
		    int_Light_Source = lightSources[l].getIntensity();
		
		    pos_Light_Source = lightSources[l].getPosition();
		    
		    // Animating the light source, if defined
		    
		    var lightSourceMatrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];// mat4();
		    lightSourceMatrix.matrix = true;
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
	        
	        var vectorL = [0,0,0,1];//vec4();
	
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
			lightSourceMatrix = null;
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

function drawModelWall(	tx, ty, tz,
					mvMatrix) {					 

	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ));
	mvMatrix = mult( mvMatrix, scalingMatrix( 0.5, 0.5, 0.5 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	mvUniform = null;
	
	//computeIllumination( mvMatrix );
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							triangleVertexPositionBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, wallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, wallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, neheTexture);
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}
function drawModelFloor(tx, ty, tz,
					mvMatrix) {					 
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ));
	mvMatrix = mult( mvMatrix, scalingMatrix( 0.5, 0.5, 0.5 ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	mvUniform = null;
	
	//computeIllumination( mvMatrix );
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							floorVertexBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	gl.drawArrays(gl.TRIANGLES, 0, floorVertexBuffer.numItems);
}


//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];//mat4();
	mvMatrix.matrix = true;
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	pMatrix = perspective( 90, 1, 0.0001, 15 );
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	pMatrix = null;
	pUniform = null;

	if(topView){
		mvMatrix = rotationXXMatrix(90);
		mvMatrix = mult(mvMatrix, translationMatrix( oldTx, -3, globalTz));	
	}
	else{
		var tempTz = globalTz;
		var tempTx = oldTx;
		globalTx += rodar; 
		mvMatrix = rotationYYMatrix(globalTx);
		oldTx = oldTx + ((-Math.sin(radians(globalTx))) * andar);
		globalTz = globalTz + (Math.cos(radians(globalTx)) * andar);
		//andar = 0.0;
		if(check_col(oldTx, globalTz)){
			globalTz = tempTz;
			oldTx = tempTx;
		}
		mvMatrix = mult(mvMatrix, translationMatrix( oldTx, 0, globalTz));
	}
	
	for(var i = 0; i< labirin.length; i++){
		if(labirin[i][1] != -1){
			drawModelWall( labirin[i][0], 0, labirin[i][2],
	                   mvMatrix);
		}
		else{
			drawModelFloor( labirin[i][0], 0, labirin[i][2],
					   mvMatrix);
		}
	}
	mvMatrix = null;
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
	
	//animate();
}

function check_col(x,y) {
	for (var i = 0; i < labirin.length; i++) {
		if(labirin[i][1] == -1){
			continue;
		}
		var maxX = - (labirin[i][0] - 0.125);
		var minX = - (labirin[i][0] + 0.125);

		var maxY = - (labirin[i][2] - 0.125);
		var minY = - (labirin[i][2] + 0.125);

		if((x >= minX && x <= maxX) && (y >= minY && y <= maxY)){
			return true;
		}
	}
	return false;
}
//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}

//----------------------------------------------------------------------------

function setEventListeners(){
	document.getElementById("file").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			var tokens = this.result.split("\n");
			for (var i = 0; i < tokens.length; i++) {
				for (var j = 0; j < tokens[i].length; j++){
					if(tokens[i][j] == '+'){
						var ob = [(-0.25+(j*0.25)), 0, (0.125 + (i*-0.25))];
						//var ob = [(-0.75+(j*0.5)), 0, (0.75 + (i*-0.5))];
						labirin.push(ob);
					}
					else if (tokens[i][j] == '-'){
						var ob = [(-0.25+(j*0.25)), -1, (0.125 + (i*-0.25))];
						//var ob = [(-0.75+(j*0.5)), 0, (0.75 + (i*-0.5))];
						labirin.push(ob);	
					}
				}
			}			
			console.log(tokens);
			tokens = null;
		};
			
		reader.readAsText( file );		
	}
	
	document.getElementById("textureWall").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			neheTexture = gl.createTexture();
    		neheTexture.image = new Image();
    		neheTexture.image.onload = function() {
      			handleLoadedTexture(neheTexture);
    		};
    		neheTexture.image.src = this.result;
		};
		reader.readAsDataURL( file );		
	}

	document.getElementById("textureFloor").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			floorTexture = gl.createTexture();
    		floorTexture.image = new Image();
    		floorTexture.image.onload = function() {
      			handleLoadedTexture(floorTexture);
    		};
    		floorTexture.image.src = this.result;
		};
		reader.readAsDataURL( file );		
	}
	
	
	document.onkeydown = function(e) {
		if (e.keyCode == 37){
			rodar = -1.5;
		}
		else if(e.keyCode == 38){
			andar = 0.01;
		}
		else if(e.keyCode == 39){
			rodar = 1.5;
		}
		else if(e.keyCode == 40){
			andar = -0.01;
		}
		else if(e.keyCode == 32){
			topView = true;
		}
		/*
    switch (e.keyCode) {
        case 37:
            rodar = -1.5;
            break;
        case 38:
            andar = 0.01;
            break;
        case 39:
            rodar = 1.5;
            break;
        case 40:
            andar = -0.01;
            break;
    	}
    	*/
	};
	document.onkeyup = function(e) {
    switch (e.keyCode) {
    	case 37:
            rodar = 0;
            break;
        case 38:
            andar = 0;
            break;
        case 39:
            rodar = 0;
            break;
        case 40:
            andar = 0;
            break;
        case 32:
        	topView = false;
    	}
	};                
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    texture.image = null;
    delete texture.image;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE

		// Enable FACE CULLING
		gl.enable( gl.CULL_FACE );
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
	//initTexture();
	tick();		// NEW --- A timer controls the rendering / animation    

	outputInfos();
}


