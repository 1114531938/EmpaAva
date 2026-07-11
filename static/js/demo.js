const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const HISTORY_KEY = "empaava_public_demo_history_v1";
let selectedAvatar = "Evan Hart";
let selectedColor = "#36d5b4";
let cameraStream = null;
let recorder = null;
let recordedChunks = [];
let sessionStarted = 0;
let timerId = null;
let messages = [];

const replies = [
  [/deadline|overwhelm|stress|work|exam|busy/i, "That sounds like a lot to carry at once. Feeling overwhelmed does not mean you are failing. What is the smallest deadline we could make more manageable first?"],
  [/doubt|enough|failure|fail|confidence|worth/i, "I hear how harsh that self-doubt feels. The fact that you care this much speaks to your commitment, not your inadequacy. What is one difficult thing you have handled before?"],
  [/argument|conflict|friend|partner|family|angry/i, "It makes sense that this conflict is staying with you because the relationship matters. What do you most wish the other person understood?"],
  [/sad|lonely|alone|upset|hurt/i, "I’m sorry this feels so lonely right now. You deserve space to be heard without minimizing what hurts. What part has been hardest to hold on your own?"]
];

function showScreen(id) {
  ["welcome-screen", "setup-screen", "room-screen"].forEach((name) => { $(`#${name}`).hidden = name !== id; });
}
function toast(text) { const el = $("#toast"); el.textContent = text; el.hidden = false; clearTimeout(el.timer); el.timer = setTimeout(() => { el.hidden = true; }, 2600); }
function escapeText(value) { const span = document.createElement("span"); span.textContent = value; return span.innerHTML; }
function history() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } }
function saveHistory() {
  if (!messages.length) return;
  const entries = history();
  entries.unshift({ id: Date.now(), date: new Date().toISOString(), avatar: selectedAvatar, setting: $("#setting-select").value, messages });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 20)));
  updateHistory();
}
function updateHistory() {
  const entries = history(); $("#history-count").textContent = entries.length;
  $("#history-list").innerHTML = entries.length ? entries.map((item) => `<article><strong>${escapeText(item.avatar)}</strong><time>${new Date(item.date).toLocaleString()}</time><p>${escapeText(item.messages[0]?.text || "Conversation")}</p><small>${item.messages.length} messages · ${escapeText(item.setting)}</small></article>`).join("") : "<p class='empty-history'>No saved conversations yet.</p>";
}
function openHistory(open) { $("#history-drawer").classList.toggle("open", open); $("#history-drawer").setAttribute("aria-hidden", String(!open)); $("#drawer-scrim").hidden = !open; updateHistory(); }
function beginSession() {
  $("#avatar-label").textContent = selectedAvatar; document.documentElement.style.setProperty("--booth-accent", selectedColor);
  showScreen("room-screen"); sessionStarted = Date.now(); messages = [];
  timerId = setInterval(() => { const s = Math.floor((Date.now() - sessionStarted) / 1000); $("#session-timer").textContent = `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`; }, 1000);
}
async function toggleCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach((track) => track.stop()); cameraStream = null; $("#camera-video").hidden = true; $("#camera-empty").hidden = false; $("#camera-button").classList.remove("active"); return; }
  try { cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); $("#camera-video").srcObject = cameraStream; $("#camera-video").hidden = false; $("#camera-empty").hidden = true; $("#camera-button").classList.add("active"); } catch { toast("Camera permission was not granted."); }
}
async function toggleRecording() {
  if (recorder?.state === "recording") { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); recordedChunks = [];
    recorder = new MediaRecorder(stream); recorder.ondataavailable = (e) => { if (e.data.size) recordedChunks.push(e.data); };
    recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); $("#record-button").classList.remove("recording"); $("#record-button em").textContent = "Record"; submitMessage("[Recorded voice message]"); };
    recorder.start(); $("#record-button").classList.add("recording"); $("#record-button em").textContent = "Stop";
  } catch { toast("Microphone permission was not granted."); }
}
function responseFor(text) { return (replies.find(([pattern]) => pattern.test(text)) || [null, "Thank you for trusting me with that. What feeling is strongest for you right now?"])[1]; }
function appendMessage(role, text) {
  messages.push({ role, text, time: new Date().toISOString() }); const p = document.createElement("p"); p.className = role; const b = document.createElement("b"); b.textContent = role === "user" ? "You" : selectedAvatar; p.append(b, document.createTextNode(` ${text}`)); $("#conversation-log").appendChild(p); $("#conversation-log").scrollTop = $("#conversation-log").scrollHeight;
}
function submitMessage(raw) {
  const text = raw.trim(); if (!text) return; appendMessage("user", text); $("#avatar-state-text").textContent = "Planning an empathetic response…";
  setTimeout(() => { const reply = responseFor(text); appendMessage("assistant", reply); $("#reply-caption").textContent = reply; $("#reply-caption").hidden = false; $("#avatar-state-text").textContent = "Speaking"; const video = $("#avatar-video"); video.currentTime = 0; video.play().catch(() => {}); setTimeout(() => { $("#avatar-state-text").textContent = "Digital human online"; }, 3500); }, 700);
}
function exportSession() {
  const data = { mode: "curated_public_preview", avatar: selectedAvatar, setting: $("#setting-select").value, started_at: new Date(sessionStarted).toISOString(), exported_at: new Date().toISOString(), messages };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = `empaava-demo-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); toast("Session exported.");
}

$("#start-button").onclick = () => showScreen("setup-screen"); $("#setup-back").onclick = () => showScreen("welcome-screen"); $("#enter-booth").onclick = beginSession;
$$('.avatar-option').forEach((button) => button.onclick = () => { $$('.avatar-option').forEach((b) => b.classList.remove('active')); button.classList.add('active'); selectedAvatar = button.dataset.avatar; selectedColor = button.dataset.color; });
$("#camera-button").onclick = toggleCamera; $("#record-button").onclick = toggleRecording; $("#export-button").onclick = exportSession;
$("#restart-button").onclick = () => { saveHistory(); clearInterval(timerId); cameraStream?.getTracks().forEach((track) => track.stop()); cameraStream = null; showScreen("welcome-screen"); };
$("#message-form").onsubmit = (event) => { event.preventDefault(); submitMessage($("#message-input").value); $("#message-input").value = ""; };
$$('[data-prompt]').forEach((button) => button.onclick = () => submitMessage(button.dataset.prompt));
$("#history-button").onclick = () => openHistory(true); $("#history-close").onclick = () => openHistory(false); $("#drawer-scrim").onclick = () => openHistory(false);
$("#history-clear").onclick = () => { localStorage.removeItem(HISTORY_KEY); updateHistory(); };
window.addEventListener("beforeunload", () => { if (messages.length) saveHistory(); cameraStream?.getTracks().forEach((track) => track.stop()); });
updateHistory();
