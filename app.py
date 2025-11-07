import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from replicate import Client
from replicate.files import upload  # ✅ correct upload import

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
        # ✅ Validate upload
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files["image"]

        # ✅ Upload to Replicate temp storage (correct method)
        uploaded_url = upload(image_file)

        # ✅ Load model
        model = client.models.get(REPLICATE_MODEL)
        version = model.versions.list()[0]

        # ✅ Run animation model
        prediction = client.predictions.create(
            version=version.id,
            input={
                "image": uploaded_url,
                "fps": 12,      # animation frames per second
                "duration": 3   # seconds
            }
        )

        # ✅ Wait until finished
        prediction = client.predictions.wait(prediction)

        # ✅ Return final output (video link)
        return jsonify({"output": prediction.output})

    except Exception as e:
        print("Replicate call failed:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
