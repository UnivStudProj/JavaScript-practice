const canvas = document.querySelector('canvas');

const w = canvas.width = window.innerWidth;
const h = canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec2 position;

    void main(){
        gl_Position = vec4(position, 0.0, 1.0);
    }
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec4 color;

    void main(){
        gl_FragColor = color;
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const vertices = new Float32Array([
    -0.5, -0.5,
    0.5, -0.5,
    0.0, 0.5
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

gl.useProgram(program);
program.color = gl.getUniformLocation(program, 'color');
gl.uniform4f(program.color, 0.0, 1.0, 0.0, 1.0);

program.position = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(program.position);
gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
