var canvas;
var ctx; //contecto grafico
var fps = 50;

//dimenciones del vanvas

var canvasAncho = 500;
var canvasAlto = 500;
//variables del objeto
var escenario;
var jugador;

//colores
const paredColor ='#000000'; 
const sueloColor = '#666666';
const colorjugador = '#FFFFFF';

//Normalizacion de los angulos

function normalizacionAngulo(angulo){
    angulo = angulo % ( 2 * Math.PI);
    if(angulo < 0){
        angulo = angulo + (2 * Math.PI);
    }
    console.log(angulo);
    return angulo;
}

//rayos

class Rayo{
    
    constructor(con,escenario,x,y,anguloJugador,incrementoAngulo,columna){
        this.ctx = con;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.anguloJugador = anguloJugador;
        this.incrementoAngulo = incrementoAngulo;
        this.columna = columna;

    }

    cast(){
        
    }
    
}


//nivel

let nivel1 = [

    [1,1,1,1,1,1,1,1,1,1],//1
    [1,0,0,0,0,0,0,0,0,1],//2
    [1,0,0,0,0,0,0,0,0,1],//3
    [1,0,0,0,0,0,0,0,0,1],//4
    [1,0,0,0,1,1,1,0,0,1],//5
    [1,0,0,0,1,0,1,0,0,1],//6
    [1,0,0,0,1,0,0,0,0,1],//7
    [1,0,0,0,1,1,1,0,0,1],//8
    [1,0,0,0,0,0,0,0,0,1],//9
    [1,1,1,1,1,1,1,1,1,1],//10
];
//----------------teclado

document.addEventListener('keydown',function(tecla){
    
    switch(tecla.keyCode){
        case 38:
            jugador.arriba();
            break;
        case 40:
            jugador.abajo();
            break;
        case 39:
            jugador.derecha();
            break;
        case 37:
            jugador.izquierda();
            break;
                                
    }

});

document.addEventListener('keyup',function(tecla){
    switch(tecla.keyCode){
        case 38:
            jugador.avanzaSuelta();
            break;
        case 40:
            jugador.avanzaSuelta();
            break;
        case 39:
            jugador.giraSuelta();
            break;
        case 37:
            jugador.giraSuelta();
            break;
    }
})

class Level{
    
    constructor(can,con,arr){
        this.canvas = can;
        this.ctx = con;
        this.matriz = arr;
        
        //Dimenciones de la maatriz
        
        this.altoM = this.matriz.length;  // 
        this.anchoM = this.matriz[0].length;  

        //Dimenciones reales del cnava
        this.altoC = this.canvas.width;
        this.anchoC = this.canvas.height;


        //Dimenciones de los titles 
        this.altoT = parseInt(this.altoC / this.altoM);
        this.anchoT = parseInt(this.anchoC /this.anchoM);

    }

    colision(x,y){
        var choca = false;
        if(this.matriz[y][x] != 0){
            choca = true;
        }
        return choca;

    }

     dibuja(){//Funcion que dibuja el mapa
        //Dimenciones
        var color;
        for (var y = 0; y < this.altoM; y++) {
            
            for (var x = 0; x < this.anchoM; x++) {

                if(this.matriz[y][x] == 1)
                    color = paredColor;
                 else
                    color = sueloColor;
                this.ctx.fillStyle  = color;
                this.ctx.fillRect( x * this.anchoT, y * this.altoT, this.anchoT,this.altoT);
            }
        }
    }
    
}



class Player{

    constructor(con,escenario,x,y){
        this.ctx = con;
        this.escenario = escenario;
        //posicion del jugadoe 
        this.x = x;
        this.y = y;

        this.avanza = 0; // 0 = NO SE MUEVE 1 = ES ADELANTE -1 = ATRAS
        this.gira   = 0  // -1 = IZQUIERDA 1 = DERECHA

        this.anguloRotacion = 0;

        this.velMoviemiento = 3; //pixeles de movientos
        this.velgiro = 3 * (Math.PI / 180);// velociad en radianaes

         //RAYO
        this.rayo;
        this.rayo = new Rayo(this.ctx,this.escenario,this.x,this.y,this.anguloRotacion,0);
    
    }
    arriba(){
        this.avanza = 1;
    }
    abajo(){
        this.avanza = -1;
    }
    derecha(){
        this.gira = 1;
    }
    izquierda(){
        this.gira = -1;
    }
    avanzaSuelta(){
        this.avanza = 0;
    }
    giraSuelta(){
        this.gira = 0;
    }
    colision(x,y){
        var choca = false;

        //deteccion de casillas
        var casillasX = parseInt(x / this.escenario.anchoT);
        var casillasY = parseInt(y / this.escenario.altoT);

        if(this.escenario.colision(casillasX,casillasY)){
            choca = true;
        }

        return choca;
    }
    actualiza(){
        //avanza
        var nuevaX = this.x + (this.avanza * Math.cos(this.anguloRotacion) * this.velMoviemiento);
        var nuevay = this.y + (this.avanza * Math.sin(this.anguloRotacion) * this.velMoviemiento);
        
        if(!this.colision(nuevaX,nuevay)){
            this.x = nuevaX;
            this.y = nuevay;
        }
         //gira
        this.anguloRotacion += this.gira * this.velgiro;
        this.anguloRotacion = normalizacionAngulo(this.anguloRotacion);
    }


    dibuja(){


        this.ctx.fillStyle = colorjugador;
        this.ctx.fillRect(this.x - 3, this.y-3,6,6);

        this.actualiza();


        var xDestino = this.x + Math.cos(this.anguloRotacion) * 40;
        var yDestino = this.y + Math.sin(this.anguloRotacion)* 40;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x,this.y );
        this.ctx.lineTo(xDestino,yDestino);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.stroke();
    }
    
}

function inicializa(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvasAncho;
    canvas.height = canvasAlto;

    escenario = new Level(canvas,ctx,nivel1);
    jugador = new Player(ctx,escenario,200,100);

    setInterval(function(){principal();},1000/fps);

    
}

function borrarCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal(){
    borrarCanvas();
    escenario.dibuja();
    jugador.dibuja();
}
