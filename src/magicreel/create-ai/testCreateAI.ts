import { CreateAIService }
from "./createAI.service";

async function run() {

  const service =
    new CreateAIService();

  const result =
    await service.generate({

      userId:"test",

      garmentImageUrl:
      "https://test-shirt.png",

      museId:"FS1"

    });

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

run()
.catch(console.error);