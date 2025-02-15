// Definir la constante con el texto largo
const TEXT = "Aquí va el texto largo que se debe dividir en palabras y renderizar en un canvas con control de líneas.";

// Clase para representar una palabra con su posición en el canvas
class WordEntity {
    constructor(word, xPos, yPos) {
        this.word = word;
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

// Clase para manejar la renderización de texto en el canvas
class TextRenderer {
    constructor(text, maxWidth, startX, startY, lineHeight, fontSize, canvasContext) {
        this.wordsArray = []; // Array de WordEntity
        this.maxWidth = maxWidth;
        this.lineHeight = lineHeight;
        this.startX = startX;
        this.startY = startY;
        this.fontSize = fontSize;
        this.ctx = canvasContext;

        this.processText(text);
    }

    // Divide el texto y calcula posiciones
    processText(text) {
        const words = text.split(' ');
        let xPos = this.startX;
        let yPos = this.startY;

        this.ctx.font = `${this.fontSize}px Arial`; // Configurar la fuente para medir palabras

        for (let i = 0; i < words.length; i++) {
            let wordWidth = this.ctx.measureText(words[i]).width;
            
            // Si la palabra no cabe en la línea actual, saltar a la siguiente línea
            if (xPos + wordWidth > this.maxWidth) {
                xPos = this.startX;
                yPos += this.lineHeight;
            }

            // Crear la entidad de palabra y agregarla al array
            this.wordsArray.push(new WordEntity(words[i], xPos, yPos));

            // Mover la posición x para la siguiente palabra
            xPos += wordWidth + this.ctx.measureText(' ').width;
        }
    }

    // Renderiza las palabras en el canvas
    render() {
        this.ctx.fillStyle = "grey"; // Color del texto
        this.ctx.textBaseline = "top";
        
        for (let i = 0; i < this.wordsArray.length; i++) {
            this.ctx.fillText(this.wordsArray[i].word, this.wordsArray[i].xPos, this.wordsArray[i].yPos);
        }
    }
}

// Configuración del canvas
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    // Parámetros de renderizado
    const maxWidth = canvas.width - 20;
    const startX = 10;
    const startY = 10;
    const lineHeight = 30;
    const fontSize = 20;
    
    // Crear instancia del renderizador de texto
    const textRenderer = new TextRenderer(TEXT, maxWidth, startX, startY, lineHeight, fontSize, ctx);
    
    // Dibujar en el canvas
    textRenderer.render();
});