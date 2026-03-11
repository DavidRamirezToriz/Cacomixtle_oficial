function enviarPedido(nombrePrenda) {
    const miTelefono = "522225968886"; 
    const talla = document.getElementById('talla').value;
    
    const mensaje = `¡Hola Cacomixtle! 🐾 Me encantó la guayabera modelo: *${nombrePrenda}* en talla *${talla}*. ¿Me podrían compartir los datos para el pago?`;
    
    const urlWhatsApp = `https://wa.me/${miTelefono}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
}