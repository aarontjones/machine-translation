# API python script
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import requests
import os

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*") # Creating websocket

os.environ["HF_HOME"] = "/opt/render/projects/src/hf-cache" # Fixing stuff for Render hosting
HF_TOKEN = os.environ.get("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es" # Using this, as directly using model causes Render to crash as its above 512MB

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

# Translation
@socketio.on("translate")
def translate(data):
    text = data.get("text", "")
    
    if not text:
        emit("log", "No input provided")
        emit("done", {"translated": ""})
        return
    
    def log(message): # Logging
        emit("log", message)

    startTime = time.time()
    log("Message Received to Python Script")

    # Input Stats
    charCount = len(text)
    log(f"Input Length: {charCount} characters")

    # Generate Translation and Timing
    startInference = time.time()

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": text}
    )

    endInference = time.time()

    if response.status_code != 200:
        log(f"Error: {response.text}")
        emit("done", {"translated": ""})
        return

    result = response.json()[0]["translation_text"]

    log(f"Inference Time: {round(endInference - startInference, 4)}s")

    # Total Time
    endTime = time.time()
    duration = round(endTime - startTime, 4)
    log(f"Translation took {duration} seconds")

    # Final Result
    emit("done", {"translated": result})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)