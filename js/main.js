const { act } = require("react");

// Variables Globales
let operacionActual = '';
let operacionAnterior = '';
let operador = null;
let debeResetear = false;
let historial = [];
let modoAvanzado = false;

// Elementos del DOM
const pantalla = document.getElementById('pantalla');
const historialPanel = document.getElementById('historial-panel');
const historialLista = document.getElementById('historial-lista');
const modoIndicator = document.getElementById('modo-indicator');

// Función Principal para agregar operadores
function agregar(valor){
    if (valor === '='){
        calcular()
        return;
    }

    if(['+', '-', '*', '/'].includes(valor)){
        manejarOperador(valor);
        return;
    }

    if (valor === '.'){
        agregarDecimal();
        return;
    }

    agregarNumero(valor);
}

//Funciona agregar numeros
function agregarNumero(numero){
    if(pantalla.textContent === '0' || debeResetear){
        pantalla.textContent = numero;
        debeResetear = false;
    }else{
        //Limito la cantidad de numeros en pantalla
        if (pantalla.textContent.length < 15){
            pantalla.textContent += numero;
        }
    }
    operacionActual = pantalla.textContent;
}

// Funciona agregar punto decimal
function agregarDecimal(){
    if (debeResetear){
        pantalla.textContent = '0.';
        debeResetear = false;
    } else if (!pantalla.textContent.includes('.')) {
        pantalla.textContent += '.';
    }
    operacionActual = pantalla.textContent;
}

// Manejar operadores
function manejarOperador(nuevoOperador){
    const valorActual = parseFloat(operacionActual);

    if(operacionActual === ''){
        operacionActual = valorActual;
    }else if (operador){
        const resultado = realizarCalculo();
        pantalla.textContent = formatearNumero(resultado);
        operacionAnterior = resultado;
    }

    operador = nuevoOperador;
    debeResetear = true;
}

// Realizar Calculos
function realizarCalculo(){
    const anterior = parseFloat(operacionAnterior);
    const actual = parseFloat(operacionActual);

    if (isNaN(anterior) || isNaN(actual)) return actual;

    switch(operador){
        case '+':
            return anterior + actual;
        case '-':
            return anterior - actual;
        case '*':
            return anterior * actual;
        case '/':
            if (actual === 0){
                mostarError('Error: No se puede dividir entre 0');
                return anterior
            }
            return anterior / actual;
        default:
            return actual;
    }
}

// Funcion Calcular (cuando presionamos la tecla =)
function calcular(){
    if (operador === null || debeResetear) return;

    const resultado = realizarCalculo();
    const operacionCompleta = '${operacionAnterior} ${operador} ${operacionActual} = ${formatearNumero(resultado)}';

    // Agregamos el resultado al historial
    agregarAlHistorial(operacionCompleta);

    pantalla.textContent = formatearNumero(resultado);
    operacionAnterior = '';
    operador = null;
    debeResetear = true;
}

// Formatear números