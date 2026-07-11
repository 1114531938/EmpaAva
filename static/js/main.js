function replaceMissingImage(image) {
  const placeholder = document.createElement("div");
  placeholder.className = "asset-missing";
  placeholder.textContent = `Placeholder asset: ${image.getAttribute("src")}`;
  image.replaceWith(placeholder);
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => replaceMissingImage(image), { once: true });
});

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener(
    "error",
    () => {
      const placeholder = document.createElement("div");
      placeholder.className = "asset-missing";
      const source = video.querySelector("source");
      placeholder.textContent = `Placeholder video: ${source ? source.getAttribute("src") : "missing source"}`;
      video.replaceWith(placeholder);
    },
    { once: true }
  );
});

const demoForm = document.querySelector("#demo-form");
const demoInput = document.querySelector("#demo-input");
const demoMessages = document.querySelector("#demo-messages");
const demoVideo = document.querySelector("#demo-avatar-video");

const curatedReplies = [
  { pattern: /deadline|overwhelm|stress|work|exam|busy/i, text: "That sounds like a lot to carry at once. Feeling overwhelmed does not mean you are failing—it often means too many things are asking for your attention. What is the smallest deadline we could make more manageable first?" },
  { pattern: /doubt|enough|failure|fail|confidence|worth/i, text: "I hear how harsh that self-doubt feels. The fact that you care this much says something important about your commitment, not your inadequacy. Could we look at one piece of evidence that you have handled something difficult before?" },
  { pattern: /argument|conflict|friend|partner|family|angry/i, text: "It makes sense that this conflict is staying with you, especially because the relationship matters. You do not have to solve everything immediately. Would it help to name what you most wish the other person understood?" },
  { pattern: /sad|lonely|alone|upset|hurt/i, text: "I’m sorry this feels so lonely right now. You deserve space to be heard without having to minimize what hurts. I’m here with you—what part of this has been the hardest to hold on your own?" }
];

function addDemoMessage(role, text, extraClass = "") {
  if (!demoMessages) return null;
  const item = document.createElement("div");
  item.className = `message ${role} ${extraClass}`.trim();
  const label = document.createElement("span");
  label.textContent = role === "user" ? "You" : "EmpaAva";
  const body = document.createElement("p");
  body.textContent = text;
  item.append(label, body);
  demoMessages.appendChild(item);
  demoMessages.scrollTop = demoMessages.scrollHeight;
  return item;
}

function replyToDemo(message) {
  const match = curatedReplies.find((entry) => entry.pattern.test(message));
  return match ? match.text : "Thank you for trusting me with that. It sounds meaningful, and I want to understand rather than rush past it. What feeling is strongest for you right now?";
}

function submitDemoMessage(text) {
  const message = text.trim();
  if (!message || !demoMessages) return;
  addDemoMessage("user", message);
  const thinking = addDemoMessage("assistant", "Listening and planning an empathetic response…", "thinking");
  window.setTimeout(() => {
    thinking?.remove();
    addDemoMessage("assistant", replyToDemo(message));
    if (demoVideo) {
      demoVideo.currentTime = 0;
      demoVideo.play().catch(() => {});
    }
  }, 650);
}

demoForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitDemoMessage(demoInput.value);
  demoInput.value = "";
});

document.querySelectorAll("[data-demo-prompt]").forEach((button) => {
  button.addEventListener("click", () => submitDemoMessage(button.dataset.demoPrompt || ""));
});
