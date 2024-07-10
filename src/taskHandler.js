import { DynamoDB } from "aws-sdk";
import crypto from "crypto";

export async function list(event, context) {
  const dynamoDb = new DynamoDB({
    region: "ap-northeast-1",
  });
  const data = await dynamoDb
    .scan({
      TableName: "tasks",
    })
    .promise();
  const tasks = data.Items.map((item) => ({
    id: item.id.S,
    title: item.title.S,
  }));

  return { tasks };
}

export async function post(event, context) {
  const requestBody = JSON.parse(event.body);
  const item = {
    id: { S: crypto.randomUUID() },
    title: { S: requestBody.title },
  };
  const dynamoDb = new DynamoDB({
    region: "ap-northeast-1",
  });
  await dynamoDb
    .putItem({
      TableName: "tasks",
      Item: item,
    })
    .promise();

  return item;
}
