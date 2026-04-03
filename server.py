# API python script
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import time

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*") # Creating websocket

# Loading pipeline once
model_name = "Helsinki-NLP/opus-mt-en-es"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)


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

    # -----Translation Section-----
    # Tokenization and Timing
    startTokenize = time.time()
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    endTokenize = time.time()
    inputTokens = inputs["input_ids"].shape[1]

    log(f"Tokenization complete ({inputTokens} tokens)")
    log(f"Tokenization time: {round(endTokenize - startTokenize, 4)}s")

    # socketio.sleep(5) - Used to check if websockets worked properly, which they do.

    # Generate Translation and Timing
    startInference = time.time()
    outputs = model.generate(**inputs, max_length=1024)
    endInference = time.time()

    log(f"Inference Time: {round(endInference - startInference, 4)}s")

    # Decode Translation and Timing
    startDecode = time.time()
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)
    endDecode = time.time()
    outputTokens = outputs[0].shape[0]

    log(f"Decoding Time: {round(endDecode - startDecode, 4)}s")
    log(f"Output Tokens: {outputTokens}")

    # Total Time
    endTime = time.time()
    duration = round(endTime - startTime, 4)
    log(f"Translation took {duration} seconds")

    # Throughput
    if duration > 0:
        throughput = round(outputTokens / duration, 2)
        log(f"Throughput: {throughput} tokens/sec")

    # Final Result
    emit("done", {"translated": result})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=1000)