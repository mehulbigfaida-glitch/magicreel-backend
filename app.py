import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from replicate import Client

app = Flask(__name__)
CORS(app)

# Load environment variables from Render
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
REPLICATE_MODEL = os.getenv("REPLICATE_MODEL")  # Example: "fofr/animate-photo"

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
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files["image"]

        # ✅ Upload file to Replicate temporary storage
        uploaded = client.files.upload(image_file)

        # ✅ Get the model & version
        model = client.models.get(REPLICATE_MODEL)
        version = model.versions.list()[0]

        # ✅ Run the model
        prediction = client.predictions.create(
            version=version.id,
            input={
                "image": uploaded,
                "fps": 12,
                "duration": 3
            }
        )

        # ✅ Wait until it completes
        prediction = client.predictions.wait(prediction)

        # ✅ Get output video URL
        return jsonify({"output": prediction.output})

    except Exception as e:
        print("Replicate call failed:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
