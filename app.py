@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files["image"]

        # ✅ Correct upload function
        from replicate import files
        uploaded_url = files.upload(image_file)

        # ✅ Get model + version
        model = client.models.get(REPLICATE_MODEL)
        version = model.versions.list()[0]

        # ✅ Run model
        prediction = client.predictions.create(
            version=version.id,
            input={
                "image": uploaded_url,  # <-- Use uploaded URL, not FileStorage
                "fps": 12,
                "duration": 3
            }
        )

        prediction = client.predictions.wait(prediction)

        return jsonify({"output": prediction.output})

    except Exception as e:
        print("Replicate call failed:", e)
        return jsonify({"error": str(e)}), 500
