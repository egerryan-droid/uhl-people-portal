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

async function postSimpleSlackMessage(text: string): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL_ID

  if (!token || !channel) {
    console.log("Slack not configured — skipping notification")
    return
  }

  try {
    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, text }),
    })
  } catch (error) {
    console.error("Failed to post to Slack:", error)
  }
}

export async function notifyPtoApproval(
  employeeName: string,
  startDate: string,
  endDate: string,
  status: string
): Promise<void> {
  const emoji = status === "approved" ? "✅" : "❌"
  await postSimpleSlackMessage(
    `${emoji} ${employeeName} PTO request ${status} for ${startDate} — ${endDate}`
  )
}

export async function notifyTicketUpdate(
  ticketTitle: string,
  status: string,
  employeeName: string
): Promise<void> {
  await postSimpleSlackMessage(
    `🎫 Ticket "${ticketTitle}" by ${employeeName} updated to ${status}`
  )
}

export async function notifyBenefitRequestUpdate(
  title: string,
  status: string,
  employeeName: string
): Promise<void> {
  const emoji = status === "approved" ? "✅" : "❌"
  await postSimpleSlackMessage(
    `${emoji} Dev benefit "${title}" by ${employeeName} ${status}`
  )
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

// Date-only values arrive as "YYYY-MM-DD". Passing them through `new Date()`
// would shift them a day on any non-UTC server, so parse the parts directly.
function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return value
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

// Slack renders mrkdwn, so user-supplied text can otherwise inject link syntax.
function escapeSlack(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

interface RequestNotice {
  emoji: string
  heading: string
  color: string
  fields: { label: string; value: string }[]
  buttonLabel: string
  adminPath: string
}

async function postRequestNotice(notice: RequestNotice): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL_ID

  if (!token || !channel) {
    console.log("Slack not configured — skipping notification")
    return
  }

  const portalUrl = process.env.NEXTAUTH_URL ?? "https://people.4dsmarketing.com"

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        text: notice.heading,
        attachments: [
          {
            color: notice.color,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `${notice.emoji} ${notice.heading}`,
                  emoji: true,
                },
              },
              {
                type: "section",
                fields: notice.fields.map((f) => ({
                  type: "mrkdwn",
                  text: `*${f.label}:*\n${escapeSlack(f.value)}`,
                })),
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: {
                      type: "plain_text",
                      text: notice.buttonLabel,
                      emoji: true,
                    },
                    url: `${portalUrl}${notice.adminPath}`,
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
    if (!data.ok) {
      console.error("Slack API error:", data.error)
    }
  } catch (error) {
    console.error("Failed to post to Slack:", error)
  }
}

export async function notifyPtoRequested(payload: {
  employeeName: string
  startDate: string
  endDate: string
  totalDays: number
}): Promise<void> {
  await postRequestNotice({
    emoji: "🌴",
    heading: "New PTO request",
    color: "#4a90d9",
    fields: [
      { label: "Employee", value: payload.employeeName },
      {
        label: "Dates",
        value: `${formatDateOnly(payload.startDate)} — ${formatDateOnly(payload.endDate)}`,
      },
      { label: "Days requested", value: String(payload.totalDays) },
      { label: "Status", value: "Awaiting review" },
    ],
    buttonLabel: "Review PTO",
    adminPath: "/admin/pto",
  })
}

export async function notifyBenefitRequested(payload: {
  employeeName: string
  title: string
  amount: number
  category: string
}): Promise<void> {
  await postRequestNotice({
    emoji: "📚",
    heading: "New dev benefit request",
    color: "#7b68ee",
    fields: [
      { label: "Employee", value: payload.employeeName },
      { label: "Request", value: payload.title },
      { label: "Amount", value: `$${payload.amount.toLocaleString("en-US")}` },
      { label: "Category", value: payload.category },
    ],
    buttonLabel: "Review request",
    adminPath: "/admin/growth",
  })
}

// Deliberately carries the category but not the message body — the detail stays
// in the portal so a shared channel doesn't become the disclosure surface.
export async function notifyFeedbackSubmitted(payload: {
  employeeName: string
  category: string
}): Promise<void> {
  await postRequestNotice({
    emoji: "💬",
    heading: "New feedback submitted",
    color: "#36a64f",
    fields: [
      { label: "From", value: payload.employeeName },
      { label: "Category", value: payload.category },
    ],
    buttonLabel: "Read feedback",
    adminPath: "/admin/feedback",
  })
}
