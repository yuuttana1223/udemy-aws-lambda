import { IncomingWebhook } from "@slack/webhook";

export async function handler(event, context) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  const slackWebhook = new IncomingWebhook(slackWebhookUrl);
  await slackWebhook.send("Hello Slack Webhook!");
}
