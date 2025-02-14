// 🌟 Function to translate the entered text
async function translateText() {
    const url = 'https://magicloops.dev/api/loop/8983ea35-11d4-4210-adfa-44c4f770894d/run';
    
    // 📌 Get the input text and selected languages
    const inputText = document.getElementById("textoEntrada").value;
    const sourceLanguage = document.getElementById("idiomaOrigen").value;
    const targetLanguageSelect = document.getElementById("idiomaDestino");
    const targetLanguage = targetLanguageSelect.value;
    const result = document.getElementById("resultado");
    const translateBtn = document.getElementById("traducirBtn");

    // 📌 If the text is empty, show a message and stop the function
    if (!inputText.trim()) {
        result.value = "Enter text to translate.";
        return;
    }

    // 📌 List of available languages
    const languages = ["es", "en", "zh", "ko", "ja"];

    // 📌 If the source and target languages are the same, switch automatically
    if (sourceLanguage === targetLanguage) {
        let currentIndex = languages.indexOf(targetLanguage);
        let newIndex = (currentIndex + 1) % languages.length; // Move to the next language
        targetLanguageSelect.value = languages[newIndex]; // Update the select in HTML
    }

    // 🕐 Show "Translating..." message and disable the button while processing
    result.value = "Translating...";
    translateBtn.disabled = true;

    try {
        // 🔄 Request to the translation API
        const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                "text": inputText, 
                "target_language": targetLanguageSelect.value
            }),
        });

        // 📌 If the response is not valid, show an error
        if (!response.ok) {
            result.value = "Translation error.";
            return;
        }

        // 📌 Get the translated text from the response
        const responseJson = await response.json();
        if (typeof responseJson.translatedText === "object" && responseJson.translatedText.translatedText) {
            result.value = responseJson.translatedText.translatedText;
        } else {
            result.value = responseJson.translatedText || "No valid response received.";
        }

    } catch (error) {
        // 📌 If there is a connection error, show a message in the textarea
        result.value = "Connection error.";
        console.error("Error:", error);
    } finally {
        // ✅ Enable the button again after completion
        translateBtn.disabled = false;
    }
}

// 🌟 Function to keep the text visible from the beginning
document.addEventListener("DOMContentLoaded", function () {
    let textarea = document.getElementById("textoEntrada");

    textarea.addEventListener("input", function () {
        setTimeout(() => {
            textarea.scrollTop = 0; // 🔄 Keeps the text visible from the top
        }, 0);
    });
});

// 🌟 Function to automatically adjust textarea size
document.addEventListener("DOMContentLoaded", function () {
    function adjustTextareaHeight(textarea) {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = textarea.scrollHeight + "px"; // Adjust based on content
    }

    function syncSizes() {
        const input = document.getElementById("textoEntrada");
        const output = document.getElementById("resultado");

        if (input && output) {
            adjustTextareaHeight(input);
            output.style.height = input.style.height; // Match output height to input
        }
    }

    document.getElementById("textoEntrada").addEventListener("input", syncSizes);
    new MutationObserver(syncSizes).observe(document.getElementById("resultado"), { childList: true, characterData: true, subtree: true });

    syncSizes(); // Initial adjustment
});

// Function for handling long text
document.getElementById("textoEntrada").addEventListener("input", function () {
    let textLength = this.value.length;
    let normalButton = document.getElementById("traducirBtn");
    let floatingButton = document.getElementById("traducirFlotante");

    let isLong = textLength > 300; // If greater than 300, true

    floatingButton.classList.toggle("mostrar", isLong);
    normalButton.classList.toggle("ocultar", isLong);
});
