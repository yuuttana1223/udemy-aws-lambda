import { IncomingWebhook } from "@slack/webhook";
import moment from "moment";
import AWS from "aws-sdk";

export async function handler(event, context) {
  const now = moment();
  const start = now.format("YYYY-MM-01");
  const end = now.add(1, "month").format("YYYY-MM-01");
  const ce = new AWS.CostExplorer({ region: "us-east-1" });
  const constAndUsage = await ce
    .getCostAndUsage({
      TimePeriod: {
        Start: start,
        End: end,
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
    })
    .promise();
  const usdCost = constAndUsage.ResultsByTime[0].Total.UnblendedCost.Amount;
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  const slackWebhook = new IncomingWebhook(slackWebhookUrl);
  await slackWebhook.send(`今月のAWS利用料金: $${usdCost}`);
}
