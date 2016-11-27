//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context
var shaderProgram = null;

//buffers
var triangleVertexPositionBuffer = null;
var floorVertexBuffer = null;
var wallVertexTextureCoordBuffer = null;
var floorVertexTextureCoordBuffer = null;
var esfVertexPositionBuffer = null;
var esfTextureCoordBuffer = null;

var topVertexPositionBuffer = null;

// The GLOBAL transformation parameters

var globalTz = 0.0;
var andar = 0.0;
var rodar = 0.0;
var oldTx = 0.0;
var globalTx = 0.0;
var esferaRot = 0;

var wallsArray = [];
var floorArray = [];
var winningPos = [];

var topView = false;

// textures
var neheTexture;
var floorTexture;
var esferaTexture;
var topTexture;



//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex and the Texture Buffers

function initBuffers() {	
	
	// walls	
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
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
		/*
		-0.25, -0.25, -0.25,
		 
		 0.25, -0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		 
		-0.25, -0.25, -0.25,
		*/
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
					];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floor), gl.DYNAMIC_DRAW);
	floorVertexBuffer.itemSize = 3;
	floorVertexBuffer.numItems = floor.length / 3;
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			floorVertexBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);

	//top
	topVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, topVertexPositionBuffer);
    var topVertexPos = [
        -0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25, -0.25,

		 0.25,  0.25, -0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25,  0.25,  0.25,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(topVertexPos), gl.DYNAMIC_DRAW);
    topVertexPositionBuffer.itemSize = 3;
    topVertexPositionBuffer.numItems = topVertexPos.length/3;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			topVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);

	//end esfera
	esfVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, esfVertexPositionBuffer);
	var esfVertex = [
		-0.577350, -0.577350, 0.577350, 
		0.000000, 0.000000, 1.000000, 
		-0.707107, 0.000000, 0.707107, 
		0.577350, 0.577350, 0.577350, 
		0.000000, 0.707107, 0.707107, 
		0.000000, 0.000000, 1.000000, 
		-0.577350, 0.577350, 0.577350, 
		-0.707107, 0.000000, 0.707107, 
		0.000000, 0.707107, 0.707107, 
		0.000000, 0.000000, 1.000000, 
		0.000000, 0.707107, 0.707107, 
		-0.707107, 0.000000, 0.707107, 
		-0.577350, -0.577350, 0.577350, 
		0.000000, -0.707107, 0.707107, 
		0.000000, 0.000000, 1.000000, 
		0.577350, -0.577350, 0.577350, 
		0.707107, 0.000000, 0.707107, 
		0.000000, -0.707107, 0.707107, 
		0.577350, 0.577350, 0.577350, 
		0.000000, 0.000000, 1.000000, 
		0.707107, 0.000000, 0.707107, 
		0.000000, -0.707107, 0.707107, 
		0.707107, 0.000000, 0.707107, 
		0.000000, 0.000000, 1.000000, 
		0.577350, -0.577350, 0.577350, 
		0.707107, -0.707107, 0.000000, 
		1.000000, 0.000000, 0.000000, 
		0.577350, -0.577350, -0.577350, 
		0.707107, 0.000000, -0.707107, 
		0.707107, -0.707107, 0.000000, 
		0.577350, 0.577350, -0.577350, 
		1.000000, 0.000000, 0.000000, 
		0.707107, 0.000000, -0.707107, 
		0.707107, -0.707107, 0.000000, 
		0.707107, 0.000000, -0.707107, 
		1.000000, 0.000000, 0.000000, 
		0.577350, -0.577350, 0.577350, 
		1.000000, 0.000000, 0.000000, 
		0.707107, 0.000000, 0.707107, 
		0.577350, 0.577350, -0.577350, 
		0.707107, 0.707107, 0.000000, 
		1.000000, 0.000000, 0.000000, 
		0.577350, 0.577350, 0.577350, 
		0.707107, 0.000000, 0.707107, 
		0.707107, 0.707107, 0.000000, 
		1.000000, 0.000000, 0.000000, 
		0.707107, 0.707107, 0.000000, 
		0.707107, 0.000000, 0.707107, 
		-0.577350, -0.577350, -0.577350, 
		-0.707107, 0.000000, -0.707107, 
		0.000000, 0.000000, -1.000000, 
		-0.577350, 0.577350, -0.577350, 
		0.000000, 0.707107, -0.707107, 
		-0.707107, 0.000000, -0.707107, 
		0.577350, 0.577350, -0.577350, 
		0.000000, 0.000000, -1.000000, 
		0.000000, 0.707107, -0.707107, 
		-0.707107, 0.000000, -0.707107, 
		0.000000, 0.707107, -0.707107, 
		0.000000, 0.000000, -1.000000, 
		-0.577350, -0.577350, -0.577350, 
		0.000000, 0.000000, -1.000000, 
		0.000000, -0.707107, -0.707107, 
		0.577350, 0.577350, -0.577350, 
		0.707107, 0.000000, -0.707107, 
		0.000000, 0.000000, -1.000000, 
		0.577350, -0.577350, -0.577350, 
		0.000000, -0.707107, -0.707107, 
		0.707107, 0.000000, -0.707107, 
		0.000000, 0.000000, -1.000000, 
		0.707107, 0.000000, -0.707107, 
		0.000000, -0.707107, -0.707107, 
		-0.577350, -0.577350, -0.577350, 
		-0.707107, -0.707107, 0.000000, 
		-0.707107, 0.000000, -0.707107, 
		-0.577350, -0.577350, 0.577350, 
		-1.000000, 0.000000, 0.000000, 
		-0.707107, -0.707107, 0.000000, 
		-0.577350, 0.577350, -0.577350, 
		-0.707107, 0.000000, -0.707107, 
		-1.000000, 0.000000, 0.000000, 
		-0.707107, -0.707107, 0.000000, 
		-1.000000, 0.000000, 0.000000, 
		-0.707107, 0.000000, -0.707107, 
		-0.577350, -0.577350, 0.577350, 
		-0.707107, 0.000000, 0.707107, 
		-1.000000, 0.000000, 0.000000, 
		-0.577350, 0.577350, 0.577350, 
		-0.707107, 0.707107, 0.000000, 
		-0.707107, 0.000000, 0.707107, 
		-0.577350, 0.577350, -0.577350, 
		-1.000000, 0.000000, 0.000000, 
		-0.707107, 0.707107, 0.000000, 
		-0.707107, 0.000000, 0.707107, 
		-0.707107, 0.707107, 0.000000, 
		-1.000000, 0.000000, 0.000000, 
		-0.577350, 0.577350, -0.577350, 
		-0.707107, 0.707107, 0.000000, 
		0.000000, 0.707107, -0.707107, 
		-0.577350, 0.577350, 0.577350, 
		0.000000, 1.000000, 0.000000, 
		-0.707107, 0.707107, 0.000000, 
		0.577350, 0.577350, -0.577350, 
		0.000000, 0.707107, -0.707107, 
		0.000000, 1.000000, 0.000000, 
		-0.707107, 0.707107, 0.000000, 
		0.000000, 1.000000, 0.000000, 
		0.000000, 0.707107, -0.707107, 
		-0.577350, 0.577350, 0.577350, 
		0.000000, 0.707107, 0.707107, 
		0.000000, 1.000000, 0.000000, 
		0.577350, 0.577350, 0.577350, 
		0.707107, 0.707107, 0.000000, 
		0.000000, 0.707107, 0.707107, 
		0.577350, 0.577350, -0.577350, 
		0.000000, 1.000000, 0.000000, 
		0.707107, 0.707107, 0.000000, 
		0.000000, 0.707107, 0.707107, 
		0.707107, 0.707107, 0.000000, 
		0.000000, 1.000000, 0.000000, 
		-0.577350, -0.577350, 0.577350, 
		-0.707107, -0.707107, 0.000000, 
		0.000000, -1.000000, 0.000000, 
		-0.577350, -0.577350, -0.577350, 
		0.000000, -0.707107, -0.707107, 
		-0.707107, -0.707107, 0.000000, 
		0.577350, -0.577350, -0.577350, 
		0.000000, -1.000000, 0.000000, 
		0.000000, -0.707107, -0.707107, 
		-0.707107, -0.707107, 0.000000, 
		0.000000, -0.707107, -0.707107, 
		0.000000, -1.000000, 0.000000, 
		-0.577350, -0.577350, 0.577350, 
		0.000000, -1.000000, 0.000000, 
		0.000000, -0.707107, 0.707107, 
		0.577350, -0.577350, -0.577350, 
		0.707107, -0.707107, 0.000000, 
		0.000000, -1.000000, 0.000000, 
		0.577350, -0.577350, 0.577350, 
		0.000000, -0.707107, 0.707107, 
		0.707107, -0.707107, 0.000000, 
		0.000000, -1.000000, 0.000000, 
		0.707107, -0.707107, 0.000000, 
		0.000000, -0.707107, 0.707107,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esfVertex), gl.DYNAMIC_DRAW);
	esfVertexPositionBuffer.itemSize = 3;
	esfVertexPositionBuffer.numItems = esfVertex.length / 3;
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			esfVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);

	// esfera texture
	esfTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, esfTextureCoordBuffer);
    var esfTextureCoords = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
	  0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
	  0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
		0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0, 
	  0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esfTextureCoords), gl.STATIC_DRAW);
    esfTextureCoordBuffer.itemSize = 2;
    esfTextureCoordBuffer.numItems = esfTextureCoords / 2;
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, esfTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
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
      /*
	  // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
	  */
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
    wallVertexTextureCoordBuffer.numItems = wallTextureCoords.length / 2;
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

    //textures
    gl.uniform1i(shaderProgram.samplerUniform0, 0);
    gl.activeTexture(gl.TEXTURE0);
}

//----------------------------------------------------------------------------


function drawModelWall(mvMatrix, mvUniform) {
	gl.bindTexture(gl.TEXTURE_2D, neheTexture);
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							triangleVertexPositionBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, wallVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, wallVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
	for (var i = 0; i < wallsArray.length; i++) {
		var tempMvMat = mult( mvMatrix, translationMatrix(wallsArray[i][0], 0, wallsArray[i][2]));
		tempMvMat = mult( tempMvMat, scalingMatrix( 0.5, 0.5, 0.5 ) );
						 
		// Passing the Model View Matrix to apply the current transformation
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(tempMvMat)));
		gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	}				 
}

function drawModelFloor(mvMatrix, mvUniform) {
	gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							floorVertexBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	for (var i = 0; i < floorArray.length; i++) {
		var tempMvMat = mult( mvMatrix, translationMatrix(floorArray[i][0], 0, floorArray[i][2]));
		tempMvMat = mult( tempMvMat, scalingMatrix( 0.5, 0.5, 0.5 ) );
						 
		// Passing the Model View Matrix to apply the current transformation
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(tempMvMat)));
		gl.drawArrays(gl.TRIANGLES, 0, floorVertexBuffer.numItems);
	}					 
}

function drawModelWin(mvMatrix, mvUniform) {
	gl.bindTexture(gl.TEXTURE_2D, esferaTexture);
	gl.bindBuffer(gl.ARRAY_BUFFER, esfVertexPositionBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							esfVertexPositionBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, esfTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, esfTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	for (var i = 0; i < winningPos.length; i++) {
		var tempMvMat = mult( mvMatrix, translationMatrix(winningPos[i][0], 0, winningPos[i][2]));
		tempMvMat = mult( tempMvMat, rotationYYMatrix( esferaRot ) );
		tempMvMat = mult( tempMvMat, scalingMatrix( 0.05, 0.05, 0.05 ) );
						 
		// Passing the Model View Matrix to apply the current transformation
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(tempMvMat)));
		gl.drawArrays(gl.TRIANGLES, 0, esfVertexPositionBuffer.numItems);
	}				 
}

function drawModelTop(mvMatrix, mvUniform) {
	gl.bindTexture(gl.TEXTURE_2D, topTexture);
	gl.bindBuffer(gl.ARRAY_BUFFER, topVertexPositionBuffer);
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, 
							topVertexPositionBuffer.itemSize, 
							gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	for (var i = 0; i < floorArray.length; i++) {
		var tempMvMat = mult( mvMatrix, translationMatrix(floorArray[i][0], 0, floorArray[i][2]));
		tempMvMat = mult( tempMvMat, scalingMatrix( 0.5, 0.5, 0.5 ) );
						 
		// Passing the Model View Matrix to apply the current transformation
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(tempMvMat)));
		gl.drawArrays(gl.TRIANGLES, 0, topVertexPositionBuffer.numItems);
	}
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	var mvMatrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];//mat4();
	mvMatrix.matrix = true;
	var tempMV = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	// Clearing the frame-buffer and the depth-buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	//for now
	pMatrix = [[1.0000000000000002,0,0,0],[0,1.0000000000000002,0,0],[0,0,-1.0000133334222228,-0.00020000133334222229],[0,0,-1,0]];//perspective( 90, 1, 0.0001, 15 );
	pMatrix.matrix = true;
	
	// Passing the Projection Matrix to apply the current projection
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	pMatrix = null;
	pUniform = null;

	if(topView){
		mvMatrix = rotationXXMatrix(90);
		mvMatrix = mult(mvMatrix, translationMatrix( oldTx, -3, globalTz));
		//drawModelFloor(-oldTx,0.25,-globalTz, mvMatrix);
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
		//draw top
		drawModelTop(mvMatrix, tempMV);
	}
	//draw walls
	drawModelWall(mvMatrix, tempMV);
	//draw floor
	drawModelFloor(mvMatrix, tempMV);
	//draw esfera
	drawModelWin(mvMatrix, tempMV);
	mvMatrix = null;
}

//----------------------------------------------------------------------------
// Animation --- Updating transformation parameters

var lastTime = 0;
function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		var elapsed = timeNow - lastTime;
		esferaRot += 1 * (90 * elapsed) / 1000.0;
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

function check_col(x,y) {
	for (var i = 0; i < wallsArray.length; i++) {
		var maxX = - (wallsArray[i][0] - 0.125);
		var minX = - (wallsArray[i][0] + 0.125);

		var maxY = - (wallsArray[i][2] - 0.125);
		var minY = - (wallsArray[i][2] + 0.125);

		if((x >= minX && x <= maxX) && (y >= minY && y <= maxY)){
			return true;
		}
	}
	for (var i = 0; i < winningPos.length; i++) {
		var maxX = - (winningPos[i][0] - 0.045);
		var minX = - (winningPos[i][0] + 0.045);

		var maxY = - (winningPos[i][2] - 0.045);
		var minY = - (winningPos[i][2] + 0.045);
		
		if((x >= minX && x <= maxX) && (y >= minY && y <= maxY)){
			document.getElementById("win").innerText = "You Won. You can start another maze, if you want.";
			winningPos = [];
			wallsArray = [];
			floorArray = [];
			globalTz = 0.0;
			oldTx = 0.0;
			globalTx = 0.0;
			return true;
		}	
	}
	return false;
}

//----------------------------------------------------------------------------
function loadMaze(tokens) {
	document.getElementById("win").innerText = "";
	winningPos = [];
	wallsArray = [];
	floorArray = [];
	globalTz = 0.0;
	oldTx = 0.0;
	globalTx = 0.0;
	tokens = tokens.split("\n");
	for (var i = 0; i < tokens.length; i++) {
		for (var j = 0; j < tokens[i].length; j++){
			if(tokens[i][j] == '+'){
				var ob = [(-0.25+(j*0.25)), 0, (0.125 + (i*-0.25))];
				wallsArray.push(ob);
			}
			else if (tokens[i][j] == '-'){
				var ob = [(-0.25+(j*0.25)), -1, (0.125 + (i*-0.25))];
				floorArray.push(ob);	
			}
			else if(tokens[i][j] == 'p'){
				var ob = [(-0.25+(j*0.25)), -1, (0.125 + (i*-0.25))];
				oldTx = -(-0.25+(j*0.25));
				floorArray.push(ob);
				globalTz = -(0.125 + (i*-0.25));
			}
			else if(tokens[i][j] == '*'){
				var ob = [(-0.25+(j*0.25)), -2, (0.125 + (i*-0.25))];
				floorArray.push(ob);
				winningPos.push(ob);
			}
		}
	}			
}
function setEventListeners(){
	document.getElementById("file").onchange = function(){
		document.getElementById("win").innerText = "";
		wallsArray = [];
		floorArray = [];
		winningPos = [];
		globalTz = 0.0;
		oldTx = 0.0;
		globalTx = 0.0;
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function( progressEvent ){
			var tokens = this.result.split("\n");
			for (var i = 0; i < tokens.length; i++) {
				for (var j = 0; j < tokens[i].length; j++){
					if(tokens[i][j] == '+'){
						var ob = [(-0.25+(j*0.25)), 0, (0.125 + (i*-0.25))];
						wallsArray.push(ob);
					}
					else if (tokens[i][j] == '-'){
						var ob = [(-0.25+(j*0.25)), -1, (0.125 + (i*-0.25))];
						floorArray.push(ob);
					}
					else if(tokens[i][j] == 'p'){
						var ob = [(-0.25+(j*0.25)), -1, (0.125 + (i*-0.25))];
						floorArray.push(ob);
						oldTx = -(-0.25+(j*0.25));
						globalTz = -(0.125 + (i*-0.25));
					}
					else if(tokens[i][j] == '*'){
						var ob = [(-0.25+(j*0.25)), -2, (0.125 + (i*-0.25))];
						floorArray.push(ob);
						winningPos.push(ob);
					}
				}
			}			
			tokens = null;
		};
		reader.readAsText( file );		
	}

	document.getElementById("mazeSelect").onchange = function(){
		var mazeSelected = document.getElementById("mazeSelect").value;
		var tokens = "";
		if(mazeSelected == "maze1"){
			tokens = "++++++++++\n+-----++-+\n+-+++----+\n+---++++++\n+++p--++-+\n/+--++-+-+\n++-+++---+\n+----+++++\n+-++----*+\n++++++++++";
		}
		else if(mazeSelected == "maze2"){
			tokens = "+++//////+++++++++++\n+-++++++++---------*\n+--------+-+++++++++\n++++++++-+---------+\n///////+-+++++++++-+\n///////+-+---------+\n///////+-+-+++++++++\n///////+-+---------+\n///////+-+++++++++-+\n///////+-----------+\n///////+++++++++++++";
		}
		else if(mazeSelected == "arena"){
			tokens = "++++++++++\n+--------+\n+--------+\n+--------+\n+--------+\n+--------+\n+--------+\n+--------+\n+-------*+\n++++++++++";
		}
		loadMaze(tokens);
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
		e.preventDefault();
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
    	e.preventDefault();
	};

	document.getElementById("esferaTexture").onchange = function(){
		var file = this.files[0];
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			esferaTexture = gl.createTexture();
    		esferaTexture.image = new Image();
    		esferaTexture.image.onload = function() {
      			handleLoadedTexture(esferaTexture);
    		};
    		esferaTexture.image.src = this.result;
		};
		reader.readAsDataURL( file );		
	}

	document.getElementById("textureTop").onchange = function(){
		var file = this.files[0];
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			topTexture = gl.createTexture();
    		topTexture.image = new Image();
    		topTexture.image.onload = function() {
      			handleLoadedTexture(topTexture);
    		};
    		topTexture.image.src = this.result;
		};
		reader.readAsDataURL( file );		
	}

	var el = document.getElementById("my-canvas");
  	el.addEventListener("touchstart", handleStart, false);
  	el.addEventListener("touchend", handleEnd, false);
  	el.addEventListener("touchmove", handleStart, false);
}

function handleStart(event){
	event.preventDefault();
	var touches = event.changedTouches;
        
  	for (var i = 0; i < touches.length; i++) {
  		if(touches[i].screenX > screen.width/2 + 100){
  			rodar = 1.5;
  		}
  		else if (touches[i].screenX < screen.width/2 - 100){
  			rodar = -1.5;
  		}
  		else{
  			rodar = 0;
  		}
  		if (touches[i].screenY > (screen.height/2)+100) {
  			andar = -0.01;
  		}
  		else if (touches[i].screenY < (screen.height/2)-100){
  			andar = 0.01;
  		}
  		else{
  			andar = 0;
  		}
  	}
}
function handleEnd(event) {
	event.preventDefault();
	//var touches = event.changedTouches;
        
  	rodar = 0;
  	andar = 0;
}
function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    //a imagem pode ser apagada
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
		
		// Enable FACE CULLING
		//se estiver activado nao da para ver o tecto
		//gl.enable( gl.CULL_FACE );
		//gl.cullFace( gl.BACK );

		// Enable DEPTH-TEST
		gl.enable( gl.DEPTH_TEST );        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------
function initTextures() {
	//Walls
	neheTexture = gl.createTexture();
    neheTexture.image = new Image();
    neheTexture.image.onload = function() {
    	handleLoadedTexture(neheTexture);
    };
    neheTexture.image.src = "wall.bmp";

    //Floor
    floorTexture = gl.createTexture();
    floorTexture.image = new Image();
    floorTexture.image.onload = function() {
      	handleLoadedTexture(floorTexture);
    };
    floorTexture.image.src = "floor.bmp";
    //esfera
    esferaTexture = gl.createTexture();
    esferaTexture.image = new Image();
    esferaTexture.image.onload = function() {
    	handleLoadedTexture(esferaTexture);
    };
    esferaTexture.image.src = "gold.bmp";
    //ceiling
    topTexture = gl.createTexture();
    topTexture.image = new Image();
    topTexture.image.onload = function() {
    	handleLoadedTexture(topTexture);
    };
    topTexture.image.src = "top.bmp";
}
function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffers();

	initTextures();

	tick(); 
}


