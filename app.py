import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from replicate import Client

app = Flask(__name__)
CORS(app)

# Load token and model name from environment
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
REPLICATE_MODEL = os.getenv("REPLICATE_MODEL")  # <-- must be: black-forest-labs/face-to-video

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
        # Ensure a file was uploaded
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files["image"]

        # ✅ Upload the incoming image to Replicate's temporary storage
        uploaded = client.files.upload(image_file)

        # ✅ Correct input format for black-forest-labs/face-to-video model
        model_input = {
            "image": uploaded,
            "motion_strength": 0.55,
            "style": "cinematic"
        }

        # ✅ Get model + latest version
        model = client.models.get(REPLICATE_MODEL)
        version = model.versions.list()[0]

        # ✅ Create prediction
        prediction = client.predictions.create(
            version=version.id,
            input=model_input
        )

        # ✅ Wait until generation completes
        prediction = client.predictions.wait(prediction)

        # ✅ Extract final video URL
        output = prediction.output

        return jsonify({"output": output})

    except Exception as e:
        print("Replicate call failed:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
