const body = document.querySelector('body');
const btnSubmit = document.querySelector('#generar-factura');
const btnCreate = document.querySelector('#btn-agregar');
const btnRemove = document.querySelector('#btn-quitar');
const btnAdd = document.querySelector('#overlayCreate');
const btnClose = document.querySelector('#overlayClose');
const overlay = document.querySelector('.overlay');
const numItem = document.querySelector('#item');
const codItem = document.querySelector('#codigo');
const descItem = document.querySelector('#descripcion');
const valItem = document.querySelector('#valBruto');
const cantItem = document.querySelector('#cantidad');
const ids = ['item', 'codigo', 'descripcion', 'valBruto', 'cantidad', 'valTotal'];
const headings = ['Item', 'Código', 'Descripción', 'V/Bruto', 'Cant.', 'V/Total'];   
const itemsArray = [];
const obj = {
    item: '',
    codigo: '',
    descripcion: '',
    valBruto: 0,
    cantidad: 0,
    valTotal: function(){
        return parseInt(this.cantidad) * parseInt(this.valBruto);
    }
};


function addItem(newItem){
    const aviso = document.querySelector('.aviso');
    if(aviso){
        aviso.remove();
        mostrarTotales();
    }
    const listItems = document.querySelector('.lista-items');
    const items = document.querySelectorAll('.lista-items ul');
    const countItems = items.length;    
    let item = document.createElement('UL');
    item.classList.add('item');
    for(let i = 0; i < ids.length; i++){
        let li = document.createElement('LI');
        li.classList.add('item__campo', `campo--${ids[i]}`);
        let label = document.createElement('LABEL');
        label.setAttribute('for',`${ids[i]}_${countItems}`);
        label.classList.add('item__campo-header');
        label.textContent = headings[i];
        li.appendChild(label);        
        let input = document.createElement('INPUT');
        input.classList.add('item__input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', `${ids[i]}_${countItems}`);
        if(ids[i] === 'item' || ids[i] === 'valTotal'){
            input.setAttribute('readonly', true);
        }
        if(ids[i] === 'cantidad' || ids[i] === 'valBruto'){
            input.setAttribute('onChange', 'updateVal(this)');
        }
        if(ids[i] === 'valTotal'){
            input.value = newItem.valTotal();
            input.classList.add('valor');            
        }else{
            input.value = newItem[ids[i]];
        }            
        li.appendChild(input);
        item.appendChild(li);
    }
    listItems.appendChild(item);
    cleanFomr();
    calcularTotal();
    btnSubmit.removeAttribute('disabled');
    newItem.remove;    
};

function mostrarTotales(){
    const totales = document.querySelector('.totales');
    totales.classList.remove('oculto');
};

function countItems(){
    let items = document.querySelectorAll('.lista-items ul');
    return items.length;
}

function overlayOpen(){     
    body.classList.add('no-scroll');
    overlay.style.opacity = 0;    
    const count = countItems();
    numItem.textContent = count;
    numItem.setAttribute('value', count);
    overlay.classList.remove('oculto');
    fadeIn(overlay, 100);    
    btnClose.addEventListener('click', function(){
        overlay.classList.add('oculto');
        body.classList.remove('no-scroll');  
    } );
    btnAdd.onclick = function(){
        let vacios = isEmpty();        
        if(vacios.length == 0){
            let newItem = Object.create(obj);                
            newItem.item =  numItem.value;
            newItem.codigo = codItem.value;
            newItem.descripcion = descItem.value;
            newItem.valBruto = parseInt(valItem.value);
            newItem.cantidad = parseInt(cantItem.value);
            itemsArray.push(newItem);        
            addItem(newItem);
        }else{
            sendNotification(vacios);
        }             
    };
}

function sendNotification(vacios){
    let content = document.querySelector('.overlay ul');
    let not = document.createElement('P');
    not.classList.add('error');
    not.textContent = "Los campos marcados con * son requeridos";
    not.style.opacity = 0;   
    content.appendChild(not);
    fadeIn(not, 500);    
    let labels = document.querySelectorAll('.overlay ul label');
    labels.forEach(function(label){
        for(let i = 0; i < vacios.length; i++){
            if(vacios[i] === label.getAttribute('for')){
                label.classList.add('required');
            }
        }
    });   
    setTimeout(() => { 
        fadeOut(not, 500)
        labels.forEach(label => label.classList.remove('required'));
    }, 4000);
}

function isEmpty(){
    const vacios = [];    
    if(codItem.value === ''){
        vacios.push(codItem.getAttribute('id'));
    }
    if(descItem.value === ''){
        vacios.push(descItem.getAttribute('id'));
    }
    if(valItem.value == 0){
        vacios.push(valItem.getAttribute('id'));
    }
    if(cantItem.value == 0){
        vacios.push(cantItem.getAttribute('id'));
    }
    return vacios;
}

function cleanFomr(){
    numItem.value = parseInt(numItem.value) + 1;
    codItem.value = '';
    descItem.value = '';
    valItem.value = "";
    cantItem.value = "";
}

function calcularTotal(){
    let items = document.querySelectorAll('.lista-items .valor');
    let total = document.querySelector('#subTotal');
    let iva = document.querySelector('#iva');
    let neto = document.querySelector('#neto');
    let aux = 0;
    items.forEach(function(item){
        aux = aux + parseInt(item.value)
    })
    total.value = aux;    
    neto.value = (aux * (iva.value/100)) + aux;
}

function updateVal(elemt){
    const id= elemt.id;
    const index = id.substring(id.length-1);
    let valor = document.querySelector(`#valBruto_${index}`);
    let cant = document.querySelector(`#cantidad_${index}`);
    let total = document.querySelector(`#valTotal_${index}`);
    total.value = parseInt(valor.value) * parseInt(cant.value);
    calcularTotal();
};

function fadeIn(o, time){
    let i = 1;
    setInterval(() => {
        if(i == 101){
            clearInterval();
        }else{
            o.style.opacity = i/100;
            i++;
        }
    }, time/100);
}

function fadeOut(o, time){
    let i = 100;
    setInterval(() => {
        if(i == 0){   
            o.remove();      
            clearInterval();
        }else{
            o.style.opacity = i/100;
            i--;
        }
    }, time/100); 
}
btnCreate.addEventListener('click', function(){
    overlayOpen();    
});

btnSubmit.addEventListener('click', function(e){
    e.preventDefault();
    alert('Generaste la factura correctamente!');
});
//btnRemove.addEventListener('click', () => calcularTotal());