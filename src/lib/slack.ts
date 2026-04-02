const PRIORITY_COLORS: Record<string, string> = {
  low: "#36a64f",
  normal: "#daa520",
  high: "#ff8c00",
  urgent: "#dc3545",
}

interface SlackTicketPayload {
  ticketId: string
  title: string
  category: string
  type: string
  priority: string
  submitterName: string
}

export async function postTicketToSlack(
  payload: SlackTicketPayload
): Promise<string | null> {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL_ID

  if (!token || !channel) {
    console.log("Slack not configured — skipping notification")
    return null
  }

  const portalUrl = process.env.NEXTAUTH_URL ?? "https://people.4dsmarketing.com"
  const ticketUrl = `${portalUrl}/admin/tickets`
  const color = PRIORITY_COLORS[payload.priority] ?? PRIORITY_COLORS.normal

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        text: `New HR Ticket: ${payload.title}`,
        attachments: [
          {
            color,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `🎫 ${payload.title}`,
                  emoji: true,
                },
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Category:*\n${payload.category}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Priority:*\n${payload.priority.charAt(0).toUpperCase() + payload.priority.slice(1)}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Type:*\n${payload.type === "formal" ? "⚠️ Formal" : "General"}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Submitted by:*\n${payload.submitterName}`,
                  },
                ],
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: {
                      type: "plain_text",
                      text: "View in Portal",
                      emoji: true,
                    },
                    url: ticketUrl,
                    style: "primary",
                  },
                ],
              },
            ],
          },
        ],
      }),
    })

    const data = await res.json()
    if (data.ok) {
      return data.ts ?? null
    }
    console.error("Slack API error:", data.error)
    return null
  } catch (error) {
    console.error("Failed to post to Slack:", error)
    return null
  }
}
