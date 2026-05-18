async function sendMessengerMessage({ platform, to, text }) {
  if (!platform || !to || !text) {
    return;
  }

  if (platform === "whatsapp") {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      throw new Error("Missing WhatsApp credentials");
    }

    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }
  }

  if (platform === "messenger") {
    const token = process.env.MESSENGER_TOKEN;

    if (!token) {
      throw new Error("Missing Messenger credentials");
    }

    const response = await fetch("https://graph.facebook.com/v20.0/me/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_token: token,
        recipient: { id: to },
        message: { text }
      })
    });

    if (!response.ok) {
      throw new Error(`Messenger API error: ${response.status}`);
    }
  }

  if (platform === "line") {
    const token = process.env.LINE_CHANNEL_TOKEN;

    if (!token) {
      throw new Error("Missing LINE credentials");
    }

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text }]
      })
    });

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`);
    }
  }
}

module.exports = {
  sendMessengerMessage
};
