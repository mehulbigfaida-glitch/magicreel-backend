import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from replicate import Client

app = Flask(__name__)
CORS(app)

# Load environment variables from Render environment
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
REPLICATE_MODEL = os.getenv("REPLICATE_MODEL")  # should be fofr/animate-photo

client = Client(api_token=REPLICATE_API_TOKEN)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "replicate_key_found": bool(REPLICATE_API_TOKEN),
        "replicate_model": REPLICATE_MODEL,
        "status": "MagicReel backend running"
    })


@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        # Ensure image is included
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files["image"]

        # ✅ Call model directly (no version lookup needed)
        output = client.run(
            REPLICATE_MODEL,
            input={
                "image": image_file,
                "fps": 12,       # smooth animation
                "duration": 3    # seconds
            }
        )

        return jsonify({"output": output})

    except Exception as e:
        print("Replicate call failed:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
