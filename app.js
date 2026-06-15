const steps = [
  {
    text: "这是一段关于湘绣的互动叙事。你将用声音选择颜色、针脚和记忆，让一幅未完成的绣布逐渐成形。",
    note: "所有故事内容都会以文字显示。请在提示出现时，说出屏幕上的关键词。",
    buttons: [{ label: "开始准备", action: "next", type: "primary" }],
  },
  {
    text: "建议在安静环境中体验。你可以开启轻微环境音，听见风、水、布面和丝线穿行的声音。",
    note: "环境音只用于营造氛围，不影响剧情理解。",
    buttons: [
      { label: "开启环境音", action: "ambient-on", type: "primary" },
      { label: "静音体验", action: "ambient-off", type: "secondary" },
    ],
  },
  {
    text: "请允许网页使用麦克风。你的声音将用于识别关键词，例如“开始”“朱砂”“虎眼”“翻转”。",
    note: "如果无法使用麦克风，后续也可以通过点击选项继续体验。",
    buttons: [
      { label: "开启麦克风", action: "mic", type: "primary" },
      { label: "暂不使用麦克风", action: "skip-mic", type: "secondary" },
    ],
  },
  {
    text: "试着叫醒第一根线。请轻声说出：开始。",
    note: "识别成功后，素缎会展开，画面将进入序章。",
    buttons: [
      { label: "开始语音测试", action: "voice-test", type: "primary" },
      { label: "直接进入", action: "to-prologue", type: "secondary" },
    ],
  },
];

const colorCopy = {
  朱砂: "朱砂线落下，像一簇火。它让画面有了温度，也有了心跳。",
  天青: "天青线铺开，像湘江水雾。山色、远岸和晨光，都在这一抹青里慢慢醒来。",
  赤金: "赤金线闪动，像灯火照在丝面上。它让细小的针脚也拥有光。",
  玄青: "玄青线沉入布面，像山石，也像虎的骨骼。它让画面有了力量。",
  月白: "月白线轻轻落下，像月光、云气和羽毛。它让沉默的地方变得柔软。",
};

const colorAliases = {
  朱砂: ["朱砂", "朱红", "红色", "红"],
  天青: ["天青", "青色", "青"],
  赤金: ["赤金", "金色", "金"],
  玄青: ["玄青", "墨色", "黑色", "黑"],
  月白: ["月白", "白色", "白"],
};

const state = {
  step: 0,
  ambient: null,
  mic: "idle",
  transitioning: false,
  recognition: null,
  voiceEnabled: false,
  voiceNarrationEnabled: true,
  guideSpeaking: false,
  pendingListenStart: null,
  guideSpeechTimer: null,
  guideSpeechDone: null,
  guideSpeechId: 0,
  selectedColor: null,
  selectedNeedle: null,
  selectedTigerMood: null,
  selectedLandscapeMood: null,
  selectedDistantLandscapeDone: false,
  selectedQuietLandscapeDone: false,
  selectedVastLandscapeDone: false,
  selectedFlowerMood: null,
  selectedGrowthFlowerDone: false,
  selectedReunionFlowerDone: false,
  selectedElegantFlowerDone: false,
  selectedMajesticTigerDone: false,
  selectedQuietTigerDone: false,
  selectedGuardianTigerDone: false,
  activeStitchBranch: null,
  lastSecretSource: null,
  lastSecretBg: null,
  lastSecretBranch: null,
  inheritanceSentence: "",
  inheritanceSaved: false,
  generatedPatternUrl: "",
  generatedPatternPrompt: "",
  backendAvailable: null,
  imageApiKeyReady: false,
};

const root = document.querySelector(".experience");
const preludeScene = document.querySelector(".scene-prelude");
const prologueScene = document.querySelector(".scene-prologue");
const threadChoiceScene = document.querySelector(".scene-thread-choice");
const firstNeedleScene = document.querySelector(".scene-first-needle");
const stitchingVideoScene = document.querySelector(".scene-stitching-video");
const tigerEyeScene = document.querySelector(".scene-tiger-eye");
const majesticTigerScene = document.querySelector(".scene-majestic-tiger");
const quietTigerScene = document.querySelector(".scene-quiet-tiger");
const guardianTigerScene = document.querySelector(".scene-guardian-tiger");
const landscapeScene = document.querySelector(".scene-landscape");
const distantLandscapeScene = document.querySelector(".scene-distant-landscape");
const quietLandscapeScene = document.querySelector(".scene-quiet-landscape");
const vastLandscapeScene = document.querySelector(".scene-vast-landscape");
const flowerScene = document.querySelector(".scene-flower");
const growthFlowerScene = document.querySelector(".scene-growth-flower");
const reunionFlowerScene = document.querySelector(".scene-reunion-flower");
const elegantFlowerScene = document.querySelector(".scene-elegant-flower");
const doubleSecretScene = document.querySelector(".scene-double-secret");
const inheritanceScene = document.querySelector(".scene-inheritance");
const preludeBg = document.querySelector(".bg-prelude");
const prologueBg = document.querySelector(".bg-prologue");
const threadChoiceBg = document.querySelector(".bg-thread-choice");
const firstNeedleBg = document.querySelector(".bg-first-needle");
const firstNeedleRedBg = document.querySelector(".bg-first-needle-red");
const firstNeedleCyanBg = document.querySelector(".bg-first-needle-cyan");
const firstNeedleGoldBg = document.querySelector(".bg-first-needle-gold");
const firstNeedleInkBg = document.querySelector(".bg-first-needle-ink");
const firstNeedleWhiteBg = document.querySelector(".bg-first-needle-white");
const tigerEyeBg = document.querySelector(".bg-tiger-eye");
const majesticTigerBg = document.querySelector(".bg-majestic-tiger");
const quietTigerBg = document.querySelector(".bg-quiet-tiger");
const guardianTigerBg = document.querySelector(".bg-guardian-tiger");
const landscapeBg = document.querySelector(".bg-landscape");
const distantLandscapeBg = document.querySelector(".bg-distant-landscape");
const quietLandscapeBg = document.querySelector(".bg-quiet-landscape");
const vastLandscapeBg = document.querySelector(".bg-vast-landscape");
const flowerBg = document.querySelector(".bg-flower");
const growthFlowerBg = document.querySelector(".bg-growth-flower");
const reunionFlowerBg = document.querySelector(".bg-reunion-flower");
const elegantFlowerBg = document.querySelector(".bg-elegant-flower");
const reverseTigerBg = document.querySelector(".bg-reverse-tiger");
const reverseFlowerBg = document.querySelector(".bg-reverse-flower");
const reverseLandscapeBg = document.querySelector(".bg-reverse-landscape");
const preludeText = document.querySelector("#preludeText");
const mutedText = document.querySelector(".scene-prelude .muted");
const actions = document.querySelector("#preludeActions");
const dots = [...document.querySelectorAll(".step-dot")];
const voiceGate = document.querySelector("#voiceGate");
const ambientStatus = document.querySelector("#ambientStatus");
const micStatus = document.querySelector("#micStatus");
const threadStory = document.querySelector("#threadStory");
const selectedColorLabel = document.querySelector("#selectedColor");
const chosenThreadText = document.querySelector("#chosenThreadText");
const selectedNeedleLabel = document.querySelector("#selectedNeedle");
const stitchVideo = document.querySelector("#stitchVideo");
const stitchKicker = document.querySelector("#stitchKicker");
const stitchCaption = document.querySelector("#stitchCaption");
const tigerStory = document.querySelector("#tigerStory");
const selectedTigerMoodLabel = document.querySelector("#selectedTigerMood");
const landscapeStory = document.querySelector("#landscapeStory");
const selectedLandscapeMoodLabel = document.querySelector("#selectedLandscapeMood");
const flowerStory = document.querySelector("#flowerStory");
const selectedFlowerMoodLabel = document.querySelector("#selectedFlowerMood");
const doubleSecretStory = document.querySelector("#doubleSecretStory");
const doubleSecretBranch = document.querySelector("#doubleSecretBranch");
const inheritanceInput = document.querySelector("#inheritanceInput");
const inheritanceStatus = document.querySelector("#inheritanceStatus");
const inheritanceCount = document.querySelector("#inheritanceCount");
const inheritancePreview = document.querySelector("#inheritancePreview");
const patternStatus = document.querySelector("#patternStatus");
const patternInterpretation = document.querySelector("#patternInterpretation");
const generatedPatternImage = document.querySelector("#generatedPatternImage");
const patternPlaceholder = document.querySelector("#patternPlaceholder");
const patternGenerator = document.querySelector(".pattern-generator");
const patternPreview = document.querySelector("#patternPreview");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");
const guideStatus = document.querySelector("#guideStatus");
const guideTranscript = document.querySelector("#guideTranscript");
const guideReply = document.querySelector("#guideReply");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSynthesisApi = window.speechSynthesis;
const API_BASE =
  (window.XIANG_EMBROIDERY_API_BASE || localStorage.getItem("xiangEmbroideryApiBase") || "").replace(/\/$/, "");
const backgroundMusic = new Audio("./assets/xiang-embroidery-bgm.mp3");
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.24;

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

function getGentleChineseVoice() {
  if (!speechSynthesisApi) return null;

  const voices = speechSynthesisApi.getVoices();
  const chineseVoices = voices.filter((voice) => /zh|Chinese|中文|普通话/i.test(`${voice.lang} ${voice.name}`));
  const gentleNames = ["Xiaoxiao", "Xiaoyi", "Huihui", "Yaoyao", "Tingting", "Mei", "Xiaochen", "晓晓", "晓伊", "慧慧", "瑶瑶", "婷婷"];

  return (
    chineseVoices.find((voice) => gentleNames.some((name) => voice.name.includes(name))) ||
    chineseVoices.find((voice) => /female|woman|女/i.test(voice.name)) ||
    chineseVoices.find((voice) => voice.lang === "zh-CN") ||
    chineseVoices[0] ||
    null
  );
}

function flushPendingListenStart() {
  const pending = state.pendingListenStart;
  state.pendingListenStart = null;
  pending?.();
}

function finishGuideSpeech(speechId = state.guideSpeechId) {
  if (speechId !== state.guideSpeechId) return;

  if (state.guideSpeechTimer) {
    clearTimeout(state.guideSpeechTimer);
    state.guideSpeechTimer = null;
  }
  const onDone = state.guideSpeechDone;
  state.guideSpeechDone = null;
  state.guideSpeaking = false;
  restoreBackgroundMusic();
  onDone?.();
  flushPendingListenStart();
}

function speakGuideReply(text, onDone) {
  if (!state.voiceNarrationEnabled || !speechSynthesisApi || !text) {
    onDone?.();
    return;
  }

  state.guideSpeechId += 1;
  const speechId = state.guideSpeechId;
  state.guideSpeechDone = null;

  if (state.guideSpeechTimer) {
    clearTimeout(state.guideSpeechTimer);
    state.guideSpeechTimer = null;
  }
  try {
    speechSynthesisApi.cancel();
  } catch {
    // Some browsers throw while switching voices; narration should never block interaction.
  }
  state.guideSpeaking = true;
  state.guideSpeechDone = onDone || null;
  duckBackgroundMusic();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.voice = getGentleChineseVoice();
  utterance.rate = 0.86;
  utterance.pitch = 1.08;
  utterance.volume = 0.86;

  utterance.onend = () => finishGuideSpeech(speechId);
  utterance.onerror = () => finishGuideSpeech(speechId);

  const estimatedDuration = Math.min(24000, Math.max(2200, text.length * 260));
  const startedAt = Date.now();
  const finishWhenQuiet = () => {
    if (speechId !== state.guideSpeechId) return;
    const elapsed = Date.now() - startedAt;
    if (speechSynthesisApi.speaking && elapsed < estimatedDuration + 3000) {
      state.guideSpeechTimer = setTimeout(finishWhenQuiet, 500);
      return;
    }
    finishGuideSpeech(speechId);
  };

  state.guideSpeechTimer = setTimeout(finishWhenQuiet, estimatedDuration);

  try {
    speechSynthesisApi.speak(utterance);
  } catch {
    finishGuideSpeech(speechId);
  }
}

function startRecognitionWhenGuideQuiet(recognition, onStartError) {
  let waitTimer = null;
  const originalOnEnd = recognition.onend;

  recognition.onend = (event) => {
    restoreBackgroundMusic();
    originalOnEnd?.call(recognition, event);
  };

  const start = () => {
    if (waitTimer) {
      clearTimeout(waitTimer);
      waitTimer = null;
    }
    try {
      muteBackgroundMusicForRecognition();
      recognition.start();
    } catch {
      restoreBackgroundMusic();
      if (state.pendingListenStart === start) state.pendingListenStart = null;
      onStartError?.();
    }
  };

  if (state.guideSpeaking) {
    state.pendingListenStart = start;
    return;
  }

  start();
}

speechSynthesisApi?.addEventListener?.("voiceschanged", getGentleChineseVoice);

function playBackgroundMusic() {
  backgroundMusic.volume = state.guideSpeaking ? 0.08 : 0.24;
  const playPromise = backgroundMusic.play();
  playPromise?.catch?.(() => {
    ambientStatus.textContent = "环境音：点击后开启";
  });
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function updateBackgroundMusic() {
  if (state.ambient) playBackgroundMusic();
  else stopBackgroundMusic();
}

function duckBackgroundMusic() {
  if (state.ambient) backgroundMusic.volume = 0.08;
}

function muteBackgroundMusicForRecognition() {
  if (state.ambient) backgroundMusic.volume = 0.015;
}

function restoreBackgroundMusic() {
  if (state.ambient) backgroundMusic.volume = 0.24;
}

function preloadImages() {
  [
    "./assets/prelude-bg.png",
    "./assets/prologue-bg.png",
    "./assets/thread-choice-bg.png",
    "./assets/first-needle-bg.png",
    "./assets/first-needle-red-bg.png",
    "./assets/first-needle-cyan-bg.png",
    "./assets/first-needle-gold-bg.png",
    "./assets/first-needle-ink-bg.png",
    "./assets/first-needle-white-bg.png",
    "./assets/tiger-eye-bg.png",
    "./assets/landscape-bg.png",
    "./assets/flower-bg.png",
    "./assets/majestic-tiger-bg.png",
    "./assets/quiet-tiger-bg.png",
    "./assets/guardian-tiger-bg.png",
    "./assets/distant-landscape-bg.png",
    "./assets/quiet-landscape-bg.png",
    "./assets/vast-landscape-bg.png",
    "./assets/growth-flower-bg.png",
    "./assets/reunion-flower-bg.png",
    "./assets/elegant-flower-bg.png",
    "./assets/reverse-tiger-bg.png",
    "./assets/reverse-flower-bg.png",
    "./assets/reverse-landscape-bg.png",
  ].forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

function getFirstNeedleBg() {
  const bgByColor = {
    朱砂: firstNeedleRedBg,
    天青: firstNeedleCyanBg,
    赤金: firstNeedleGoldBg,
    玄青: firstNeedleInkBg,
    月白: firstNeedleWhiteBg,
  };

  return bgByColor[state.selectedColor] || firstNeedleBg;
}

function renderStep() {
  const current = steps[state.step];
  preludeText.textContent = current.text;
  mutedText.textContent = current.note;

  actions.innerHTML = "";
  current.buttons.forEach((button) => {
    const el = document.createElement("button");
    el.className = button.type === "primary" ? "primary-btn" : "secondary-btn";
    el.type = "button";
    el.dataset.action = button.action;
    el.textContent = button.label;
    actions.appendChild(el);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-current", index === state.step);
  });

  ambientStatus.textContent = `环境音：${state.ambient === null ? "未设置" : state.ambient ? "已开启" : "静音"}`;
  const micLabel = {
    idle: "未开启",
    requesting: "等待授权",
    ready: "已准备",
    denied: "未授权",
    unsupported: "不支持",
    listening: "正在聆听",
    heard: "已听见：开始",
  }[state.mic];
  micStatus.textContent = `麦克风：${micLabel}`;
}

function nextStep() {
  state.step = Math.min(state.step + 1, steps.length - 1);
  renderStep();
}

async function requestMic() {
  if (!navigator.mediaDevices?.getUserMedia) {
    state.mic = "unsupported";
    renderStep();
    setTimeout(nextStep, 500);
    return;
  }

  state.mic = "requesting";
  renderStep();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    state.mic = "ready";
    state.voiceEnabled = true;
    renderStep();
    setTimeout(nextStep, 500);
  } catch {
    state.mic = "denied";
    state.voiceEnabled = false;
    renderStep();
  }
}

async function beginVoiceOnlyExperience() {
  if (voiceGate.classList.contains("is-hidden")) return;

  if (!SpeechRecognition) {
    micStatus.textContent = "语音识别：当前浏览器不支持";
    voiceGate.querySelector("span").textContent = "当前浏览器不支持语音识别";
    voiceGate.querySelector("strong").textContent = "请使用 Chrome 或 Edge 重新打开页面。";
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    micStatus.textContent = "麦克风：当前浏览器不支持";
    voiceGate.querySelector("span").textContent = "当前浏览器无法开启麦克风";
    voiceGate.querySelector("strong").textContent = "请使用支持麦克风权限的浏览器重新打开。";
    return;
  }

  micStatus.textContent = "麦克风：请求授权中";
  voiceGate.querySelector("span").textContent = "正在开启语音";
  voiceGate.querySelector("strong").textContent = "请在浏览器弹窗中允许麦克风。";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    state.mic = "ready";
    state.voiceEnabled = true;
    if (state.ambient === null) {
      state.ambient = true;
      updateBackgroundMusic();
      ambientStatus.textContent = "环境音：已开启";
    }
    micStatus.textContent = "麦克风：已开启";
    voiceGate.classList.add("is-hidden");
    setTimeout(listenFromPrelude, 360);
  } catch {
    state.mic = "denied";
    state.voiceEnabled = false;
    micStatus.textContent = "麦克风：未授权";
    voiceGate.querySelector("span").textContent = "需要开启麦克风";
    voiceGate.querySelector("strong").textContent = "请允许麦克风后刷新页面，再轻触开启语音体验。";
  }
}

function startVoiceTest() {
  if (!SpeechRecognition) {
    state.mic = "unsupported";
    state.voiceEnabled = false;
    renderStep();
    setTimeout(showPrologue, 650);
    return;
  }

  state.mic = "listening";
  renderStep();

  const recognition = new SpeechRecognition();
  state.recognition = recognition;
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const result = Array.from(event.results)
      .map((item) => item[0].transcript)
      .join("");

    if (result.includes("开始")) {
      state.mic = "heard";
      state.voiceEnabled = true;
      renderStep();
      setTimeout(showPrologue, 650);
    } else {
      state.mic = "ready";
      preludeText.textContent = "暂时没有听清。你可以再试一次，或直接进入。";
      mutedText.textContent = `刚才识别到：“${result || "无内容"}”。`;
    }
  };

  recognition.onerror = () => {
    state.mic = "ready";
    preludeText.textContent = "暂时没有听清。你可以再试一次，或直接进入。";
    mutedText.textContent = "如果浏览器限制语音识别，点击“直接进入”即可继续体验。";
    renderStep();
  };

  recognition.onend = () => {
    state.recognition = null;
    if (state.mic === "listening") {
      state.mic = "ready";
      renderStep();
    }
  };

  startRecognitionWhenGuideQuiet(recognition, () => {
    state.mic = "ready";
    preludeText.textContent = "语音识别正在切换，请稍后再说一次。";
    renderStep();
  });
}

function listenForKeywords({ keywords, onMatch, onFail }) {
  if (!SpeechRecognition || !state.voiceEnabled) {
    onFail?.("当前浏览器不支持语音识别，请刷新后重新开启语音。");
    return;
  }

  if (state.recognition) {
    state.recognition.stop();
  }

  const recognition = new SpeechRecognition();
  state.recognition = recognition;
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = async (event) => {
    const result = Array.from(event.results)
      .map((item) => item[0].transcript)
      .join("");

    const guide = await requestGuide(result);
    if (applyGuideAction(guide, result)) {
      return;
    }

    const matched = keywords.find((keyword) => result.includes(keyword));

    if (matched) {
      setGuideMessage({
        status: "湘绣引导者",
        transcript: result,
        reply: "我听见了关键词，先按你的选择继续。",
        afterSpeech: () => onMatch(matched, result),
      });
    } else {
      onFail?.(`暂时没有听清关键词。刚才识别到：“${result || "无内容"}”。`);
    }
  };

  recognition.onerror = () => {
    onFail?.("暂时没有听清，请再说一次。");
  };

  recognition.onend = () => {
    if (state.recognition === recognition) {
      state.recognition = null;
    }
  };

  startRecognitionWhenGuideQuiet(recognition, () => {
    onFail?.("语音识别正在切换，请稍后再说一次。");
  });
}

function setGuideMessage({ status = "湘绣引导者", transcript = "", reply = "", narrate = true, afterSpeech = null }) {
  guideStatus.textContent = status;
  if (transcript) guideTranscript.textContent = `你说：${transcript}`;

  let actionTimer = null;
  let actionDone = false;
  const runAfterSpeechOnce = () => {
    if (actionDone) return;
    actionDone = true;
    if (actionTimer) {
      clearTimeout(actionTimer);
      actionTimer = null;
    }
    afterSpeech?.();
  };

  if (reply) {
    guideReply.textContent = reply;
    if (narrate) {
      if (afterSpeech) {
        const safeDelay = Math.min(18000, Math.max(2400, reply.length * 320 + 1200));
        actionTimer = setTimeout(runAfterSpeechOnce, safeDelay);
      }
      speakGuideReply(reply, runAfterSpeechOnce);
    } else {
      runAfterSpeechOnce();
    }
  } else {
    runAfterSpeechOnce();
  }
}

function getVisibleSceneName() {
  return document.querySelector(".scene.is-visible")?.dataset.scene || "prelude";
}

function getGuidePageState() {
  return {
    scene: getVisibleSceneName(),
    selectedColor: state.selectedColor,
    selectedNeedle: state.selectedNeedle,
    selectedTigerMood: state.selectedTigerMood,
    selectedLandscapeMood: state.selectedLandscapeMood,
    selectedFlowerMood: state.selectedFlowerMood,
    lastSecretBranch: state.lastSecretBranch,
    hasInheritanceSentence: Boolean(state.inheritanceSentence),
    hasGeneratedPattern: Boolean(state.generatedPatternUrl),
  };
}

async function requestGuide(text) {
  setGuideMessage({
    status: "湘绣引导者正在理解",
    transcript: text,
    reply: "让我想一想，你这句话该落在哪一针。",
    narrate: false,
  });

  try {
    const response = await fetch(apiUrl("/api/guide-chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        state: getGuidePageState(),
      }),
    });

    if (!response.ok) throw new Error("guide failed");
    return response.json();
  } catch {
    setGuideMessage({
      status: "湘绣引导者",
      transcript: text,
      reply: "我暂时没有连上引导模型，会先按关键词继续帮你判断。",
    });
    return null;
  }
}

function handleBackByScene() {
  const scene = getVisibleSceneName();

  if (scene === "prologue") backToPrelude();
  else if (scene === "thread-choice") backToPrologue();
  else if (scene === "first-needle") backToThreadChoice();
  else if (scene === "tiger-eye" || scene === "landscape" || scene === "flower") backToFirstNeedle();
  else if (scene.includes("tiger") && scene !== "tiger-eye") backToTigerEye();
  else if (scene.includes("landscape") && scene !== "landscape") backToLandscape();
  else if (scene.includes("flower") && scene !== "flower") backToFlower();
  else if (scene === "double-secret") backToSecretSource();
  else if (scene === "inheritance") backToDoubleSecret();
}

function getCompletedArtworkBranchByScene(scene = getVisibleSceneName()) {
  if (["majestic-tiger", "quiet-tiger", "guardian-tiger"].includes(scene)) return "tiger";
  if (["distant-landscape", "quiet-landscape", "vast-landscape"].includes(scene)) return "landscape";
  if (["growth-flower", "reunion-flower", "elegant-flower"].includes(scene)) return "flower";
  return "";
}

function handleContinueByScene() {
  const scene = getVisibleSceneName();
  const completedBranch = getCompletedArtworkBranchByScene(scene);

  if (completedBranch) showDoubleSecret(completedBranch);
  else if (scene === "prelude") showPrologue();
  else if (scene === "prologue") showThreadChoice();
  else if (scene === "thread-choice") showFirstNeedle();
  else if (scene === "first-needle") enterSelectedBranch();
  else if (scene === "double-secret") showInheritance();
  else if (scene === "inheritance") {
    if (state.generatedPatternUrl) saveInheritanceSentence();
    else generateEmbroideryPattern();
  }
}

function applyGuideAction(guide, rawText) {
  if (!guide || !guide.intent || guide.intent === "no_action") {
    if (guide?.reply) {
      setGuideMessage({ status: "湘绣引导者", transcript: rawText, reply: guide.reply });
    }
    return false;
  }

  const { intent, value } = guide;

  const runAction = () => {
    const scene = getVisibleSceneName();
    if (intent === "start" || intent === "continue") handleContinueByScene();
    else if (intent === "select_color" && value) selectColor(value);
    else if (intent === "select_needle" && value) selectNeedle(value);
    else if (intent === "select_tiger_mood" && value) selectTigerMood(value);
    else if (intent === "select_landscape_mood" && value) selectLandscapeMood(value);
    else if (intent === "select_flower_mood" && value) selectFlowerMood(value);
    else if (intent === "continue_secret") showDoubleSecret(getCompletedArtworkBranchByScene() || state.lastSecretBranch || state.activeStitchBranch || "tiger");
    else if (intent === "generate_pattern") generateEmbroideryPattern();
    else if (intent === "save_inheritance") {
      if (scene === "double-secret") showInheritance();
      else saveInheritanceSentence();
    }
    else if (intent === "clear_inheritance") clearInheritanceSentence();
    else if (intent === "back") handleBackByScene();
    else if (intent === "restart") restart();
  };

  const canRun =
    intent === "start" ||
    intent === "continue" ||
    intent === "continue_secret" ||
    intent === "generate_pattern" ||
    intent === "save_inheritance" ||
    intent === "clear_inheritance" ||
    intent === "back" ||
    intent === "restart" ||
    (intent === "select_color" && value) ||
    (intent === "select_needle" && value) ||
    (intent === "select_tiger_mood" && value) ||
    (intent === "select_landscape_mood" && value) ||
    (intent === "select_flower_mood" && value);

  if (!canRun) return false;

  setGuideMessage({
    status: guide.source === "model" ? "湘绣引导者" : "湘绣引导者（本地判断）",
    transcript: rawText,
    reply: guide.reply || "好，我们继续。",
    afterSpeech: runAction,
  });

  return true;
}

function transitionTo({ fromScene, toScene, fromBg, toBg, after }) {
  if (state.transitioning) return;
  state.transitioning = true;
  root.classList.add("transitioning");

  if (state.recognition) state.recognition.stop();
  state.guideSpeechId += 1;
  state.guideSpeechDone = null;
  if (speechSynthesisApi) speechSynthesisApi.cancel();
  if (state.guideSpeechTimer) {
    clearTimeout(state.guideSpeechTimer);
    state.guideSpeechTimer = null;
  }
  state.guideSpeaking = false;
  state.pendingListenStart = null;
  state.guideSpeechDone = null;
  restoreBackgroundMusic();

  const sameBg = fromBg && toBg && fromBg === toBg;

  if (!sameBg) {
    fromBg?.classList.add("is-exiting");
    toBg.classList.add("is-active");
  }

  setTimeout(() => {
    fromScene.classList.remove("is-visible");
    toScene.classList.add("is-visible");
    after?.();
  }, 260);

  setTimeout(() => {
    if (!sameBg) {
      fromBg?.classList.remove("is-active", "is-exiting");
    }
    root.classList.remove("transitioning");
    state.transitioning = false;
  }, 1250);
}

function showPrologue() {
  transitionTo({
    fromScene: preludeScene,
    toScene: prologueScene,
    fromBg: preludeBg,
    toBg: prologueBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenFromPrologue, 420);
      }
    },
  });
}

function showThreadChoice() {
  transitionTo({
    fromScene: prologueScene,
    toScene: threadChoiceScene,
    fromBg: prologueBg,
    toBg: threadChoiceBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForColor, 420);
      }
    },
  });
}

function listenFromPrologue() {
  const prompt = prologueScene.querySelector(".prompt-box span");
  const keyword = prologueScene.querySelector(".prompt-box strong");
  prompt.textContent = "正在聆听";
  keyword.textContent = "开始";

  listenForKeywords({
    keywords: ["开始", "选线", "进入选线"],
    onMatch: () => {
      prompt.textContent = "已听见";
      showThreadChoice();
    },
    onFail: (message) => {
      prompt.textContent = message;
      keyword.textContent = "开始";
      if (prologueScene.classList.contains("is-visible") && state.voiceEnabled) {
        setTimeout(listenFromPrologue, 1200);
      }
    },
  });
}

function listenFromPrelude() {
  preludeText.textContent = "语音已开启。准备好后，请说：开始。";
  mutedText.textContent = "听到“开始”之后，画面才会进入序章。你也可以使用下方按钮继续准备。";
  micStatus.textContent = "麦克风：正在聆听“开始”";

  listenForKeywords({
    keywords: ["开始"],
    onMatch: () => {
      micStatus.textContent = "麦克风：已听见开始";
      showPrologue();
    },
    onFail: (message) => {
      mutedText.textContent = message;
      if (preludeScene.classList.contains("is-visible") && state.voiceEnabled) {
        setTimeout(listenFromPrelude, 1200);
      }
    },
  });
}

function resetJourneyState() {
  state.step = 0;
  state.selectedColor = null;
  state.selectedNeedle = null;
  state.selectedTigerMood = null;
  state.selectedLandscapeMood = null;
  state.selectedFlowerMood = null;
  state.selectedDistantLandscapeDone = false;
  state.selectedQuietLandscapeDone = false;
  state.selectedVastLandscapeDone = false;
  state.selectedGrowthFlowerDone = false;
  state.selectedReunionFlowerDone = false;
  state.selectedElegantFlowerDone = false;
  state.selectedMajesticTigerDone = false;
  state.selectedQuietTigerDone = false;
  state.selectedGuardianTigerDone = false;
  state.activeStitchBranch = null;
  state.lastSecretSource = null;
  state.lastSecretBg = null;
  state.lastSecretBranch = null;
  selectedColorLabel.textContent = "朱砂 / 天青 / 赤金 / 玄青 / 月白";
  selectedNeedleLabel.textContent = "虎眼 / 山水 / 花叶";
  selectedTigerMoodLabel.textContent = "威严 / 安静 / 守护";
  selectedLandscapeMoodLabel.textContent = "清远 / 宁静 / 辽阔";
  selectedFlowerMoodLabel.textContent = "生长 / 团圆 / 清雅";
}

function restart() {
  const currentScene = document.querySelector(".scene.is-visible") || prologueScene;
  const currentBg = document.querySelector(".stage-bg.is-active") || prologueBg;
  resetJourneyState();

  transitionTo({
    fromScene: currentScene,
    toScene: preludeScene,
    fromBg: currentBg,
    toBg: preludeBg,
    after: () => {
      voiceGate.classList.remove("is-hidden");
      voiceGate.querySelector("span").textContent = "轻触任意处开启语音";
      voiceGate.querySelector("strong").textContent = "开启后，请按画面提示说出关键词";
    },
  });
}

function backToPrologue() {
  transitionTo({
    fromScene: threadChoiceScene,
    toScene: prologueScene,
    fromBg: threadChoiceBg,
    toBg: prologueBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenFromPrologue, 420);
      }
    },
  });
}

function showFirstNeedle() {
  if (!state.selectedColor) {
    selectedColorLabel.textContent = "请先选择一种丝线颜色";
    setTimeout(() => {
      if (!state.selectedColor && threadChoiceScene.classList.contains("is-visible")) {
        selectedColorLabel.textContent = "朱砂 / 天青 / 赤金 / 玄青 / 月白";
      }
    }, 1400);
    return;
  }

  chosenThreadText.textContent = `你选择了${state.selectedColor}。这束丝线已经醒来，正等待落下第一针。`;

  transitionTo({
    fromScene: threadChoiceScene,
    toScene: firstNeedleScene,
    fromBg: threadChoiceBg,
    toBg: getFirstNeedleBg(),
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForNeedle, 420);
      }
    },
  });
}

function backToThreadChoice() {
  transitionTo({
    fromScene: firstNeedleScene,
    toScene: threadChoiceScene,
    fromBg: getFirstNeedleBg(),
    toBg: threadChoiceBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForColor, 420);
      }
    },
  });
}

function selectColor(color) {
  state.selectedColor = color;
  selectedColorLabel.textContent = color;
  threadStory.innerHTML = `
    <p>${colorCopy[color]}</p>
    <p>这一束丝线已经被你唤醒。下一步，它会穿过素缎，成为这幅湘绣的第一道气息。</p>
  `;

  document.querySelectorAll(".color-btn").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.color === color);
  });

  if (threadChoiceScene.classList.contains("is-visible")) {
    setTimeout(showFirstNeedle, 620);
  }
}

function listenForColor() {
  selectedColorLabel.textContent = "正在聆听...";

  const keywords = Object.values(colorAliases).flat();
  listenForKeywords({
    keywords,
    onMatch: (matched) => {
      const color = Object.entries(colorAliases).find(([, aliases]) => aliases.includes(matched))?.[0];
      if (color) selectColor(color);
    },
    onFail: (message) => {
      selectedColorLabel.textContent = message;
      setTimeout(() => {
        if (!state.selectedColor && threadChoiceScene.classList.contains("is-visible") && state.voiceEnabled) {
          selectedColorLabel.textContent = "朱砂 / 天青 / 赤金 / 玄青 / 月白";
          listenForColor();
        }
      }, 1600);
    },
  });
}

function selectNeedle(needle) {
  state.selectedNeedle = needle;
  selectedNeedleLabel.textContent = needle;

  const needleCopy = {
    虎眼: "第一针落在虎眼。光从眼中出现，整幅绣像被唤醒。",
    山水: "第一针落在山水。远山浮出，湘江的雾气开始流动。",
    花叶: "第一针落在花叶。枝叶舒展，画面里有了生长的声音。",
  };

  document.querySelector("#needleStory").innerHTML = `
    <p>${needleCopy[needle]}</p>
    <p>针脚已经有了方向。下一步，这幅湘绣将沿着你的选择进入不同的故事。</p>
  `;

  document.querySelectorAll(".choice-btn").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.needle === needle);
  });

  if (firstNeedleScene.classList.contains("is-visible")) {
    setTimeout(enterSelectedBranch, 620);
  }
}

function listenForNeedle() {
  selectedNeedleLabel.textContent = "正在聆听...";

  listenForKeywords({
    keywords: ["虎眼", "山水", "花叶"],
    onMatch: (matched) => selectNeedle(matched),
    onFail: (message) => {
      selectedNeedleLabel.textContent = message;
      setTimeout(() => {
        if (!state.selectedNeedle && firstNeedleScene.classList.contains("is-visible") && state.voiceEnabled) {
          selectedNeedleLabel.textContent = "虎眼 / 山水 / 花叶";
          listenForNeedle();
        }
      }, 1600);
    },
  });
}

function enterSelectedBranch() {
  if (!state.selectedNeedle) {
    selectedNeedleLabel.textContent = "请先选择第一针落在哪里";
    setTimeout(() => {
      if (!state.selectedNeedle && firstNeedleScene.classList.contains("is-visible")) {
        selectedNeedleLabel.textContent = "虎眼 / 山水 / 花叶";
      }
    }, 1400);
    return;
  }

  if (state.selectedNeedle === "虎眼") {
    showTigerStitching();
    return;
  }

  if (state.selectedNeedle === "山水") {
    showLandscapeStitching();
    return;
  }

  if (state.selectedNeedle === "花叶") {
    showFlowerStitching();
  }
}

function showTigerStitching() {
  state.activeStitchBranch = "tiger";
  stitchVideo.src = "./assets/tiger-stitch.mp4";
  stitchKicker.textContent = "针线正在成形";
  stitchCaption.textContent = "丝线穿过素缎，虎眼在针脚之间慢慢醒来。";

  transitionTo({
    fromScene: firstNeedleScene,
    toScene: stitchingVideoScene,
    fromBg: getFirstNeedleBg(),
    toBg: getFirstNeedleBg(),
    after: () => {
      playStitchVideo();
    },
  });
}

function showLandscapeStitching() {
  state.activeStitchBranch = "landscape";
  stitchVideo.src = "./assets/landscape-stitch.mp4";
  stitchKicker.textContent = "山水正在成形";
  stitchCaption.textContent = "青线铺开水纹，远山和晨雾在针脚之间慢慢浮现。";

  transitionTo({
    fromScene: firstNeedleScene,
    toScene: stitchingVideoScene,
    fromBg: getFirstNeedleBg(),
    toBg: getFirstNeedleBg(),
    after: () => {
      playStitchVideo();
    },
  });
}

function showFlowerStitching() {
  state.activeStitchBranch = "flower";
  stitchVideo.src = "./assets/flower-stitch.mp4";
  stitchKicker.textContent = "花叶正在成形";
  stitchCaption.textContent = "朱砂与月白绣出花瓣，天青叶脉在针脚之间慢慢舒展。";

  transitionTo({
    fromScene: firstNeedleScene,
    toScene: stitchingVideoScene,
    fromBg: getFirstNeedleBg(),
    toBg: getFirstNeedleBg(),
    after: () => {
      playStitchVideo();
    },
  });
}

function playStitchVideo() {
  stitchVideo.currentTime = 0;
  stitchVideo.play().catch(() => {
    setTimeout(showCompletedBranch, 900);
  });
}

function showCompletedBranch() {
  if (state.activeStitchBranch === "majestic-tiger") {
    showMajesticTiger();
    return;
  }

  if (state.activeStitchBranch === "quiet-tiger") {
    showQuietTiger();
    return;
  }

  if (state.activeStitchBranch === "guardian-tiger") {
    showGuardianTiger();
    return;
  }

  if (state.activeStitchBranch === "distant-landscape") {
    showDistantLandscape();
    return;
  }

  if (state.activeStitchBranch === "quiet-landscape") {
    showQuietLandscape();
    return;
  }

  if (state.activeStitchBranch === "vast-landscape") {
    showVastLandscape();
    return;
  }

  if (state.activeStitchBranch === "growth-flower") {
    showGrowthFlower();
    return;
  }

  if (state.activeStitchBranch === "reunion-flower") {
    showReunionFlower();
    return;
  }

  if (state.activeStitchBranch === "elegant-flower") {
    showElegantFlower();
    return;
  }

  if (state.activeStitchBranch === "flower") {
    showFlower();
    return;
  }

  if (state.activeStitchBranch === "landscape") {
    showLandscape();
    return;
  }

  showTigerEye();
}

function showTigerEye() {
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: tigerEyeScene,
    fromBg: getFirstNeedleBg(),
    toBg: tigerEyeBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) {
        setTimeout(listenForTigerMood, 420);
      }
    },
  });
}

function showMajesticTigerStitching() {
  state.activeStitchBranch = "majestic-tiger";
  stitchVideo.src = "./assets/majestic-tiger-stitch.mp4";
  stitchKicker.textContent = "威严正在成形";
  stitchCaption.textContent = "金线托起瞳光，墨线压住暗处，虎眼在针脚之间变得锋利。";

  transitionTo({
    fromScene: tigerEyeScene,
    toScene: stitchingVideoScene,
    fromBg: tigerEyeBg,
    toBg: tigerEyeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showMajesticTiger() {
  state.selectedMajesticTigerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: majesticTigerScene,
    fromBg: tigerEyeBg,
    toBg: majesticTigerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("tiger", backToTigerEye), 420);
    },
  });
}

function showQuietTigerStitching() {
  state.activeStitchBranch = "quiet-tiger";
  stitchVideo.src = "./assets/quiet-tiger-stitch.mp4";
  stitchKicker.textContent = "安静正在成形";
  stitchCaption.textContent = "浅光沿着针脚收拢，虎眼在丝线之间慢慢沉静下来。";

  transitionTo({
    fromScene: tigerEyeScene,
    toScene: stitchingVideoScene,
    fromBg: tigerEyeBg,
    toBg: tigerEyeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showQuietTiger() {
  state.selectedQuietTigerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: quietTigerScene,
    fromBg: tigerEyeBg,
    toBg: quietTigerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("tiger", backToTigerEye), 420);
    },
  });
}

function showGuardianTigerStitching() {
  state.activeStitchBranch = "guardian-tiger";
  stitchVideo.src = "./assets/guardian-tiger-stitch.mp4";
  stitchKicker.textContent = "守护正在成形";
  stitchCaption.textContent = "深线压出山影，暖金瞳光在针脚中心慢慢稳住。";

  transitionTo({
    fromScene: tigerEyeScene,
    toScene: stitchingVideoScene,
    fromBg: tigerEyeBg,
    toBg: tigerEyeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showGuardianTiger() {
  state.selectedGuardianTigerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: guardianTigerScene,
    fromBg: tigerEyeBg,
    toBg: guardianTigerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("tiger", backToTigerEye), 420);
    },
  });
}

function showLandscape() {
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: landscapeScene,
    fromBg: getFirstNeedleBg(),
    toBg: landscapeBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) {
        setTimeout(listenForLandscapeMood, 420);
      }
    },
  });
}

function showDistantLandscapeStitching() {
  state.activeStitchBranch = "distant-landscape";
  stitchVideo.src = "./assets/distant-landscape-stitch.mp4";
  stitchKicker.textContent = "清远正在成形";
  stitchCaption.textContent = "天青线推开远山，月白雾气在针脚之间慢慢铺展。";

  transitionTo({
    fromScene: landscapeScene,
    toScene: stitchingVideoScene,
    fromBg: landscapeBg,
    toBg: landscapeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showDistantLandscape() {
  state.selectedDistantLandscapeDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: distantLandscapeScene,
    fromBg: landscapeBg,
    toBg: distantLandscapeBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("landscape", backToLandscape), 420);
    },
  });
}

function showQuietLandscapeStitching() {
  state.activeStitchBranch = "quiet-landscape";
  stitchVideo.src = "./assets/quiet-landscape-stitch.mp4";
  stitchKicker.textContent = "宁静正在成形";
  stitchCaption.textContent = "淡青线铺开水纹，月白雾气在针脚之间慢慢收住声音。";

  transitionTo({
    fromScene: landscapeScene,
    toScene: stitchingVideoScene,
    fromBg: landscapeBg,
    toBg: landscapeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showQuietLandscape() {
  state.selectedQuietLandscapeDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: quietLandscapeScene,
    fromBg: landscapeBg,
    toBg: quietLandscapeBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("landscape", backToLandscape), 420);
    },
  });
}

function showVastLandscapeStitching() {
  state.activeStitchBranch = "vast-landscape";
  stitchVideo.src = "./assets/vast-landscape-stitch.mp4";
  stitchKicker.textContent = "辽阔正在成形";
  stitchCaption.textContent = "江水沿着丝线展开，群山在针脚之间向远处退开。";

  transitionTo({
    fromScene: landscapeScene,
    toScene: stitchingVideoScene,
    fromBg: landscapeBg,
    toBg: landscapeBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showVastLandscape() {
  state.selectedVastLandscapeDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: vastLandscapeScene,
    fromBg: landscapeBg,
    toBg: vastLandscapeBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("landscape", backToLandscape), 420);
    },
  });
}

function showFlower() {
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: flowerScene,
    fromBg: getFirstNeedleBg(),
    toBg: flowerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) {
        setTimeout(listenForFlowerMood, 420);
      }
    },
  });
}

function showGrowthFlowerStitching() {
  state.activeStitchBranch = "growth-flower";
  stitchVideo.src = "./assets/growth-flower-stitch.mp4";
  stitchKicker.textContent = "生长正在成形";
  stitchCaption.textContent = "天青叶脉向外延展，月白花瓣在针脚之间慢慢舒展。";

  transitionTo({
    fromScene: flowerScene,
    toScene: stitchingVideoScene,
    fromBg: flowerBg,
    toBg: flowerBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showGrowthFlower() {
  state.selectedGrowthFlowerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: growthFlowerScene,
    fromBg: flowerBg,
    toBg: growthFlowerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("flower", backToFlower), 420);
    },
  });
}

function showReunionFlowerStitching() {
  state.activeStitchBranch = "reunion-flower";
  stitchVideo.src = "./assets/reunion-flower-stitch.mp4";
  stitchKicker.textContent = "团圆正在成形";
  stitchCaption.textContent = "朱砂枝条彼此靠近，月白花瓣在针脚之间慢慢围合。";

  transitionTo({
    fromScene: flowerScene,
    toScene: stitchingVideoScene,
    fromBg: flowerBg,
    toBg: flowerBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showReunionFlower() {
  state.selectedReunionFlowerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: reunionFlowerScene,
    fromBg: flowerBg,
    toBg: reunionFlowerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("flower", backToFlower), 420);
    },
  });
}

function showElegantFlowerStitching() {
  state.activeStitchBranch = "elegant-flower";
  stitchVideo.src = "./assets/elegant-flower-stitch.mp4";
  stitchKicker.textContent = "清雅正在成形";
  stitchCaption.textContent = "月白花瓣收住光，天青叶片在针脚之间轻轻舒展。";

  transitionTo({
    fromScene: flowerScene,
    toScene: stitchingVideoScene,
    fromBg: flowerBg,
    toBg: flowerBg,
    after: () => {
      playStitchVideo();
    },
  });
}

function showElegantFlower() {
  state.selectedElegantFlowerDone = true;
  transitionTo({
    fromScene: stitchingVideoScene,
    toScene: elegantFlowerScene,
    fromBg: flowerBg,
    toBg: elegantFlowerBg,
    after: () => {
      stitchVideo.pause();
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork("flower", backToFlower), 420);
    },
  });
}

function backToFirstNeedle() {
  let currentScene = tigerEyeScene;
  let currentBg = tigerEyeBg;

  if (landscapeScene.classList.contains("is-visible")) {
    currentScene = landscapeScene;
    currentBg = landscapeBg;
  }

  if (distantLandscapeScene.classList.contains("is-visible")) {
    currentScene = distantLandscapeScene;
    currentBg = distantLandscapeBg;
  }

  if (quietLandscapeScene.classList.contains("is-visible")) {
    currentScene = quietLandscapeScene;
    currentBg = quietLandscapeBg;
  }

  if (vastLandscapeScene.classList.contains("is-visible")) {
    currentScene = vastLandscapeScene;
    currentBg = vastLandscapeBg;
  }

  if (flowerScene.classList.contains("is-visible")) {
    currentScene = flowerScene;
    currentBg = flowerBg;
  }

  if (growthFlowerScene.classList.contains("is-visible")) {
    currentScene = growthFlowerScene;
    currentBg = growthFlowerBg;
  }

  if (reunionFlowerScene.classList.contains("is-visible")) {
    currentScene = reunionFlowerScene;
    currentBg = reunionFlowerBg;
  }

  if (elegantFlowerScene.classList.contains("is-visible")) {
    currentScene = elegantFlowerScene;
    currentBg = elegantFlowerBg;
  }

  if (majesticTigerScene.classList.contains("is-visible")) {
    currentScene = majesticTigerScene;
    currentBg = majesticTigerBg;
  }

  if (quietTigerScene.classList.contains("is-visible")) {
    currentScene = quietTigerScene;
    currentBg = quietTigerBg;
  }

  if (guardianTigerScene.classList.contains("is-visible")) {
    currentScene = guardianTigerScene;
    currentBg = guardianTigerBg;
  }

  transitionTo({
    fromScene: currentScene,
    toScene: firstNeedleScene,
    fromBg: currentBg,
    toBg: getFirstNeedleBg(),
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForNeedle, 420);
      }
    },
  });
}

function selectFlowerMood(mood) {
  state.selectedFlowerMood = mood;
  selectedFlowerMoodLabel.textContent = mood;

  if (mood === "生长") {
    flowerStory.innerHTML = `
      <p>枝叶继续向外延展。它们不喧哗，却有一种向上的力量。</p>
      <p>针脚将继续牵出新枝。请稍候，生长花叶正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-flower-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.flowerMood === mood);
    });

    setTimeout(showGrowthFlowerStitching, 520);
    return;
  }

  if (mood === "团圆") {
    flowerStory.innerHTML = `
      <p>花叶围合成温柔的形状。线与线相遇，像人在岁月里重新靠近。</p>
      <p>针脚将继续围合枝叶。请稍候，团圆花叶正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-flower-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.flowerMood === mood);
    });

    setTimeout(showReunionFlowerStitching, 520);
    return;
  }

  if (mood === "清雅") {
    flowerStory.innerHTML = `
      <p>画面留出更多空白。花只开一半，却更显得含蓄、安静。</p>
      <p>针脚将继续收住花影。请稍候，清雅花叶正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-flower-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.flowerMood === mood);
    });

    setTimeout(showElegantFlowerStitching, 520);
    return;
  }

  const flowerCopy = {
    生长: "枝叶继续向外延展。它们不喧哗，却有一种向上的力量。",
    团圆: "花叶围合成温柔的形状。线与线相遇，像人在岁月里重新靠近。",
    清雅: "画面留出更多空白。花只开一半，却更显得含蓄、安静。",
  };

  flowerStory.innerHTML = `
    <p>${flowerCopy[mood]}</p>
    <p>朱砂、月白与天青在丝面上交织成祝愿。花叶已经完成，接下来可以继续进入双面绣的秘密。</p>
  `;

  document.querySelectorAll("[data-flower-mood]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.flowerMood === mood);
  });
}

function listenForFlowerMood() {
  selectedFlowerMoodLabel.textContent = "正在聆听...";

  listenForKeywords({
    keywords: ["生长", "团圆", "清雅"],
    onMatch: (matched) => selectFlowerMood(matched),
    onFail: (message) => {
      selectedFlowerMoodLabel.textContent = message;
      setTimeout(() => {
        if (!state.selectedFlowerMood && flowerScene.classList.contains("is-visible") && state.voiceEnabled) {
          selectedFlowerMoodLabel.textContent = "生长 / 团圆 / 清雅";
          listenForFlowerMood();
        }
      }, 1600);
    },
  });
}

function selectLandscapeMood(mood) {
  state.selectedLandscapeMood = mood;
  selectedLandscapeMoodLabel.textContent = mood;

  if (mood === "清远") {
    landscapeStory.innerHTML = `
      <p>画面变得疏朗。山在远处，水在更远处，人的心也慢慢安静下来。</p>
      <p>针脚将继续铺开远山。请稍候，清远山水正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-landscape-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.landscapeMood === mood);
    });

    setTimeout(showDistantLandscapeStitching, 520);
    return;
  }

  if (mood === "宁静") {
    landscapeStory.innerHTML = `
      <p>细线收住了声音。只有水纹轻轻动着，像一段被保存下来的清晨。</p>
      <p>针脚将继续铺开静水。请稍候，宁静山水正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-landscape-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.landscapeMood === mood);
    });

    setTimeout(showQuietLandscapeStitching, 520);
    return;
  }

  if (mood === "辽阔") {
    landscapeStory.innerHTML = `
      <p>绣面向远处展开。山水不再只是景物，而像一条通向记忆深处的路。</p>
      <p>针脚将继续铺开长河。请稍候，辽阔山水正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-landscape-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.landscapeMood === mood);
    });

    setTimeout(showVastLandscapeStitching, 520);
    return;
  }

  const landscapeCopy = {
    清远: "画面变得疏朗。山在远处，水在更远处，人的心也慢慢安静下来。",
    宁静: "细线收住了声音。只有水纹轻轻动着，像一段被保存下来的清晨。",
    辽阔: "绣面向远处展开。山水不再只是景物，而像一条通向记忆深处的路。",
  };

  landscapeStory.innerHTML = `
    <p>${landscapeCopy[mood]}</p>
    <p>青线、月白与玄青在布面上层层递进。山水已经完成，接下来可以继续进入双面绣的秘密。</p>
  `;

  document.querySelectorAll("[data-landscape-mood]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.landscapeMood === mood);
  });
}

function listenForLandscapeMood() {
  selectedLandscapeMoodLabel.textContent = "正在聆听...";

  listenForKeywords({
    keywords: ["清远", "宁静", "辽阔"],
    onMatch: (matched) => selectLandscapeMood(matched),
    onFail: (message) => {
      selectedLandscapeMoodLabel.textContent = message;
      setTimeout(() => {
        if (!state.selectedLandscapeMood && landscapeScene.classList.contains("is-visible") && state.voiceEnabled) {
          selectedLandscapeMoodLabel.textContent = "清远 / 宁静 / 辽阔";
          listenForLandscapeMood();
        }
      }, 1600);
    },
  });
}

function selectTigerMood(mood) {
  state.selectedTigerMood = mood;
  selectedTigerMoodLabel.textContent = mood;

  if (mood === "威严") {
    tigerStory.innerHTML = `
      <p>虎眼变得锐利。山风从画面深处吹来，它像站在岭上，注视远方。</p>
      <p>针脚将继续加深瞳光。请稍候，威严虎眼正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-tiger-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.tigerMood === mood);
    });

    setTimeout(showMajesticTigerStitching, 520);
    return;
  }

  if (mood === "安静") {
    tigerStory.innerHTML = `
      <p>虎眼变得柔和。月光落在它的眉骨上，它像听见了很久以前的声音。</p>
      <p>针脚将继续收住光影。请稍候，安静虎眼正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-tiger-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.tigerMood === mood);
    });

    setTimeout(showQuietTigerStitching, 520);
    return;
  }

  if (mood === "守护") {
    tigerStory.innerHTML = `
      <p>虎眼沉稳而明亮。它不是为了攻击而存在，而像守在门前，守住一段记忆。</p>
      <p>针脚将继续压出山影。请稍候，守护虎眼正在进入最后的绣制。</p>
    `;

    document.querySelectorAll("[data-tiger-mood]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.tigerMood === mood);
    });

    setTimeout(showGuardianTigerStitching, 520);
    return;
  }

  const tigerCopy = {
    威严: "虎眼变得锐利。山风从画面深处吹来，它像站在岭上，注视远方。",
    安静: "虎眼变得柔和。月光落在它的眉骨上，它像听见了很久以前的声音。",
    守护: "虎眼沉稳而明亮。它不是为了攻击而存在，而像守在门前，守住一段记忆。",
  };

  tigerStory.innerHTML = `
    <p>${tigerCopy[mood]}</p>
    <p>针脚一层层压住光，也一层层放出神。虎眼已经完成，接下来可以继续进入双面绣的秘密。</p>
  `;

  document.querySelectorAll("[data-tiger-mood]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.tigerMood === mood);
  });
}

function listenForTigerMood() {
  selectedTigerMoodLabel.textContent = "正在聆听...";

  listenForKeywords({
    keywords: ["威严", "安静", "守护"],
    onMatch: (matched) => selectTigerMood(matched),
    onFail: (message) => {
      selectedTigerMoodLabel.textContent = message;
      setTimeout(() => {
        if (!state.selectedTigerMood && tigerEyeScene.classList.contains("is-visible") && state.voiceEnabled) {
          selectedTigerMoodLabel.textContent = "威严 / 安静 / 守护";
          listenForTigerMood();
        }
      }, 1600);
    },
  });
}

function backToTigerEye() {
  let currentScene = majesticTigerScene;
  let currentBg = majesticTigerBg;

  if (quietTigerScene.classList.contains("is-visible")) {
    currentScene = quietTigerScene;
    currentBg = quietTigerBg;
  }

  if (guardianTigerScene.classList.contains("is-visible")) {
    currentScene = guardianTigerScene;
    currentBg = guardianTigerBg;
  }

  transitionTo({
    fromScene: currentScene,
    toScene: tigerEyeScene,
    fromBg: currentBg,
    toBg: tigerEyeBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForTigerMood, 420);
      }
    },
  });
}

function backToLandscape() {
  let currentScene = distantLandscapeScene;
  let currentBg = distantLandscapeBg;

  if (quietLandscapeScene.classList.contains("is-visible")) {
    currentScene = quietLandscapeScene;
    currentBg = quietLandscapeBg;
  }

  if (vastLandscapeScene.classList.contains("is-visible")) {
    currentScene = vastLandscapeScene;
    currentBg = vastLandscapeBg;
  }

  transitionTo({
    fromScene: currentScene,
    toScene: landscapeScene,
    fromBg: currentBg,
    toBg: landscapeBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForLandscapeMood, 420);
      }
    },
  });
}

function backToFlower() {
  let currentScene = growthFlowerScene;
  let currentBg = growthFlowerBg;

  if (reunionFlowerScene.classList.contains("is-visible")) {
    currentScene = reunionFlowerScene;
    currentBg = reunionFlowerBg;
  }

  if (elegantFlowerScene.classList.contains("is-visible")) {
    currentScene = elegantFlowerScene;
    currentBg = elegantFlowerBg;
  }

  transitionTo({
    fromScene: currentScene,
    toScene: flowerScene,
    fromBg: currentBg,
    toBg: flowerBg,
    after: () => {
      if (state.voiceEnabled) {
        setTimeout(listenForFlowerMood, 420);
      }
    },
  });
}

function listenForCompletedArtwork(branch, backFn) {
  listenForKeywords({
    keywords: ["继续", "双面绣", "秘密", "返回", "上一幅"],
    onMatch: (matched) => {
      if (matched === "返回" || matched === "上一幅") {
        backFn();
        return;
      }

      showDoubleSecret(branch);
    },
    onFail: () => {
      if (state.voiceEnabled) {
        setTimeout(() => listenForCompletedArtwork(branch, backFn), 1200);
      }
    },
  });
}

function getVisibleArtworkScene() {
  const candidates = [
    [majesticTigerScene, majesticTigerBg],
    [quietTigerScene, quietTigerBg],
    [guardianTigerScene, guardianTigerBg],
    [distantLandscapeScene, distantLandscapeBg],
    [quietLandscapeScene, quietLandscapeBg],
    [vastLandscapeScene, vastLandscapeBg],
    [growthFlowerScene, growthFlowerBg],
    [reunionFlowerScene, reunionFlowerBg],
    [elegantFlowerScene, elegantFlowerBg],
    [tigerEyeScene, tigerEyeBg],
    [landscapeScene, landscapeBg],
    [flowerScene, flowerBg],
  ];

  return candidates.find(([scene]) => scene.classList.contains("is-visible")) || [firstNeedleScene, firstNeedleBg];
}

function showDoubleSecret(branch) {
  const [fromScene, fromBg] = getVisibleArtworkScene();
  const branchMap = {
    tiger: {
      bg: reverseTigerBg,
      label: "虎眼反转",
      copy: `
        <p>虎眼退到后方，窗前的绣娘与倒影来到眼前。双面绣让注视被翻转，也让观看者意识到：背面并不是隐藏处。</p>
        <p>一根线穿过素绡，两面的图像同时被照顾。正面要有神，反面也要有形；前景是当下，虚影是来处。</p>
        <p>这就是双面绣的秘密：每一针都在两面之间建立秩序。</p>
      `,
    },
    landscape: {
      bg: reverseLandscapeBg,
      label: "山水反转",
      copy: `
        <p>远山与水纹来到前方，松石退成雾里的影。山水被翻转后，空间不再只是远近，而像一层层被丝线保存的时间。</p>
        <p>双面绣的针脚不能只服务一面。此面山水清朗，彼面松石仍须成形；线从这里起，也必须在那里收。</p>
        <p>这就是双面绣的秘密：一面见山河，一面见针法。</p>
      `,
    },
    flower: {
      bg: reverseFlowerBg,
      label: "花叶反转",
      copy: `
        <p>窗格与花叶来到前方，盛放的花影退到后面。花叶的反转让柔软变得更有层次，也让背面的秩序被看见。</p>
        <p>花瓣、叶脉、卷草与散线彼此呼应。前面清晰，后面朦胧，却都由同一组针脚维系。</p>
        <p>这就是双面绣的秘密：看似两幅，其实同线同心。</p>
      `,
    },
  };
  const target = branchMap[branch];

  state.lastSecretSource = fromScene;
  state.lastSecretBg = fromBg;
  state.lastSecretBranch = branch;
  doubleSecretBranch.textContent = target.label;
  doubleSecretStory.innerHTML = target.copy;

  transitionTo({
    fromScene,
    toScene: doubleSecretScene,
    fromBg,
    toBg: target.bg,
    after: () => {
      if (state.voiceEnabled) setTimeout(listenForDoubleSecretCommands, 420);
    },
  });
}

function listenForDoubleSecretCommands() {
  listenForKeywords({
    keywords: ["传承", "一句话", "留下", "返回", "上一幅", "重新开始"],
    onMatch: (matched) => {
      if (matched === "返回" || matched === "上一幅") {
        backToSecretSource();
        return;
      }

      if (matched === "重新开始") {
        restart();
        return;
      }

      showInheritance();
    },
    onFail: () => {
      if (doubleSecretScene.classList.contains("is-visible") && state.voiceEnabled) {
        setTimeout(listenForDoubleSecretCommands, 1200);
      }
    },
  });
}

function backToSecretSource() {
  if (!state.lastSecretSource || !state.lastSecretBg || !state.lastSecretBranch) return;

  const bgMap = {
    tiger: reverseTigerBg,
    landscape: reverseLandscapeBg,
    flower: reverseFlowerBg,
  };

  transitionTo({
    fromScene: doubleSecretScene,
    toScene: state.lastSecretSource,
    fromBg: bgMap[state.lastSecretBranch],
    toBg: state.lastSecretBg,
    after: () => {
      if (state.voiceEnabled) setTimeout(() => listenForCompletedArtwork(state.lastSecretBranch, state.lastSecretBranch === "tiger" ? backToTigerEye : state.lastSecretBranch === "landscape" ? backToLandscape : backToFlower), 420);
    },
  });
}

function getSecretBg() {
  const bgMap = {
    tiger: reverseTigerBg,
    landscape: reverseLandscapeBg,
    flower: reverseFlowerBg,
  };

  return bgMap[state.lastSecretBranch] || reverseTigerBg;
}

function normalizeInheritanceSentence(value) {
  return value.replace(/\s+/g, " ").trim().slice(0, 80);
}

function updateInheritanceSentence(value, status = "正在生成绣签") {
  const sentence = normalizeInheritanceSentence(value);
  state.inheritanceSentence = sentence;
  inheritanceInput.value = sentence;
  inheritanceCount.textContent = String(sentence.length);
  inheritancePreview.textContent = sentence || "一句话尚未成形";
  inheritanceStatus.textContent = sentence ? status : "等待输入";
  state.inheritanceSaved = false;
}

function getGenerationContext() {
  const branch = state.lastSecretBranch || "tiger";
  const branchLabelMap = {
    tiger: "虎眼",
    landscape: "山水",
    flower: "花叶",
  };
  const moodMap = {
    tiger: state.selectedTigerMood,
    landscape: state.selectedLandscapeMood,
    flower: state.selectedFlowerMood,
  };

  return {
    branch,
    branchLabel: branchLabelMap[branch] || "虎眼",
    color: state.selectedColor || "月白",
    needle: state.selectedNeedle || branchLabelMap[branch] || "虎眼",
    mood: moodMap[branch] || "传承",
  };
}

function resetGeneratedPattern(message = "等待一句话") {
  state.generatedPatternUrl = "";
  state.generatedPatternPrompt = "";
  patternStatus.textContent = message;
  patternInterpretation.textContent = "说出一句想留下的话，再说“生成图样”，系统会把它化成一幅新的湘绣纹样。";
  generatedPatternImage.removeAttribute("src");
  patternGenerator.classList.remove("is-loading");
  patternGenerator.querySelector(".pattern-preview").classList.remove("has-image");
  patternPlaceholder.textContent = "绣布待启";
  closePatternLightbox();
}

function openPatternLightbox() {
  if (!state.generatedPatternUrl) return;

  lightboxImage.src = state.generatedPatternUrl;
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
}

function closePatternLightbox() {
  imageLightbox.classList.remove("is-open");
  imageLightbox.setAttribute("aria-hidden", "true");
}

function handlePatternPreviewKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  openPatternLightbox();
}

async function refreshBackendStatus() {
  try {
    const response = await fetch(apiUrl("/api/status"), { cache: "no-store" });
    if (!response.ok) throw new Error("status failed");
    const status = await response.json();
    state.backendAvailable = true;
    state.imageApiKeyReady = Boolean(status.hasKey);

    if (!state.imageApiKeyReady && inheritanceScene.classList.contains("is-visible")) {
      patternStatus.textContent = "等待通义 API Key";
      patternInterpretation.textContent = "点击“生成图样”时，网页会先请你输入通义 DashScope API Key。";
    }

    return status;
  } catch {
    state.backendAvailable = false;
    state.imageApiKeyReady = false;
    patternStatus.textContent = "后端未启动";
    patternInterpretation.textContent = "请通过 outputs 文件夹里的“打开预览.bat”启动网页，不要直接双击 index.html。";
    return null;
  }
}

async function configureImageApiKey() {
  const apiKey = window.prompt("请输入通义 DashScope API Key。本次只保存在本地后端内存里，不会写入网页源码。");

  if (!apiKey) {
    patternStatus.textContent = "缺少通义 API Key";
    patternInterpretation.textContent = "需要输入通义 DashScope API Key 后才能生成绣品图样。";
    return false;
  }

  try {
    const response = await fetch(apiUrl("/api/configure-key"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "API Key 配置失败");
    }

    state.backendAvailable = true;
    state.imageApiKeyReady = true;
    patternStatus.textContent = "通义 API Key 已就绪";
    return true;
  } catch (error) {
    state.backendAvailable = false;
    patternStatus.textContent = "后端连接失败";
    patternInterpretation.textContent = error.message || "请确认已经通过“打开预览.bat”启动网页服务。";
    return false;
  }
}

async function changeImageApiKey() {
  state.imageApiKeyReady = false;
  const configured = await configureImageApiKey();

  if (configured) {
    patternInterpretation.textContent = "新的通义 DashScope API Key 已写入本地后端内存。可以重新点击“生成图样”。";
  }

  return configured;
}

async function ensureImageApiReady() {
  const status = await refreshBackendStatus();

  if (!status) return false;
  if (status.hasKey) return true;

  return configureImageApiKey();
}

async function generateEmbroideryPattern() {
  const sentence = normalizeInheritanceSentence(inheritanceInput.value);

  if (!sentence) {
    inheritanceStatus.textContent = "请先留下一句话，再生成图样。";
    patternStatus.textContent = "缺少一句话";
    if (state.voiceEnabled) setTimeout(listenForInheritanceSentence, 600);
    return;
  }

  const apiReady = await ensureImageApiReady();
  if (!apiReady) return;

  updateInheritanceSentence(sentence, "正在生成绣品图样");
  patternGenerator.classList.add("is-loading");
  patternGenerator.querySelector(".pattern-preview").classList.remove("has-image");
  patternStatus.textContent = "针线正在构图";
  patternPlaceholder.textContent = "生成中...";
  patternInterpretation.textContent = "系统正在把你的语句转化为湘绣图样，请稍候。";

  try {
    const response = await fetch(apiUrl("/api/generate-embroidery"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sentence,
        ...getGenerationContext(),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (result.code === "MISSING_API_KEY" || result.code === "INVALID_API_KEY") {
        state.imageApiKeyReady = false;
        patternStatus.textContent = result.code === "INVALID_API_KEY" ? "通义 Key 无效" : "缺少通义 Key";
        patternInterpretation.textContent = result.error || "请更换一个有效的通义 DashScope API Key。";
        const configured = await changeImageApiKey();
        if (configured) {
          return generateEmbroideryPattern();
        }
      }
      throw new Error(result.error || "生成接口暂时不可用");
    }

    if (!result.imageUrl) {
      throw new Error("接口没有返回图片");
    }

    state.generatedPatternUrl = result.imageUrl;
    state.generatedPatternPrompt = result.prompt || "";
    generatedPatternImage.src = result.imageUrl;
    patternGenerator.classList.remove("is-loading");
    patternGenerator.querySelector(".pattern-preview").classList.add("has-image");
    patternStatus.textContent = "绣样已生成";
    patternInterpretation.textContent = result.interpretation || "这幅图样已根据你的传承语句生成。";
    inheritanceStatus.textContent = "图样已生成。你可以封存此句，或说“重新生成”。";

    if (state.voiceEnabled) {
      setTimeout(listenForInheritanceDecision, 800);
    }
  } catch (error) {
    patternGenerator.classList.remove("is-loading");
    patternStatus.textContent = "生成失败";
    patternPlaceholder.textContent = "暂未成图";
    patternInterpretation.textContent = error.message || "请确认后端服务已经启动，并且 API Key 已配置。";
    inheritanceStatus.textContent = "图样生成失败，可以稍后重试。";
  }
}

function showInheritance() {
  const secretBg = getSecretBg();

  transitionTo({
    fromScene: doubleSecretScene,
    toScene: inheritanceScene,
    fromBg: secretBg,
    toBg: secretBg,
    after: () => {
      updateInheritanceSentence(state.inheritanceSentence, state.inheritanceSentence ? "可以继续修改" : "等待输入");
      if (state.voiceEnabled) setTimeout(listenForInheritanceSentence, 520);
    },
  });
}

function backToDoubleSecret() {
  const secretBg = getSecretBg();

  transitionTo({
    fromScene: inheritanceScene,
    toScene: doubleSecretScene,
    fromBg: secretBg,
    toBg: secretBg,
    after: () => {
      if (state.voiceEnabled) setTimeout(listenForDoubleSecretCommands, 420);
    },
  });
}

function listenForInheritanceSentence() {
  if (!SpeechRecognition || !state.voiceEnabled) {
    inheritanceStatus.textContent = "当前无法使用语音，请刷新后重新开启语音。";
    return;
  }

  if (state.recognition) {
    state.recognition.stop();
  }

  inheritanceStatus.textContent = "正在聆听，请说出一句想留下的话...";

  const recognition = new SpeechRecognition();
  state.recognition = recognition;
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const result = Array.from(event.results)
      .map((item) => item[0].transcript)
      .join("");

    updateInheritanceSentence(result, "已听见。请说“封存”“重说”或“返回”。");
    setTimeout(listenForInheritanceDecision, 700);
  };

  recognition.onerror = () => {
    inheritanceStatus.textContent = "暂时没有听清，请再说一次。";
    if (inheritanceScene.classList.contains("is-visible") && state.voiceEnabled) {
      setTimeout(listenForInheritanceSentence, 1200);
    }
  };

  recognition.onend = () => {
    if (state.recognition === recognition) {
      state.recognition = null;
    }
  };

  startRecognitionWhenGuideQuiet(recognition, () => {
    inheritanceStatus.textContent = "语音识别正在切换，请稍后再说一次。";
  });
}

function listenForInheritanceDecision() {
  listenForKeywords({
    keywords: ["生成图样", "生成", "出图", "重新生成", "更换Key", "换Key", "更换密钥", "封存", "保存", "完成", "结束", "最后", "继续", "重说", "重写", "返回", "双面绣", "重新开始"],
    onMatch: (matched) => {
      if (matched === "生成图样" || matched === "生成" || matched === "出图" || matched === "重新生成") {
        generateEmbroideryPattern();
        return;
      }

      if (matched === "更换Key" || matched === "换Key" || matched === "更换密钥") {
        changeImageApiKey();
        return;
      }

      if (matched === "封存" || matched === "保存" || matched === "完成" || matched === "结束" || matched === "最后") {
        saveInheritanceSentence();
        return;
      }

      if (matched === "继续") {
        handleContinueByScene();
        return;
      }

      if (matched === "重说" || matched === "重写") {
        clearInheritanceSentence();
        setTimeout(listenForInheritanceSentence, 420);
        return;
      }

      if (matched === "重新开始") {
        restart();
        return;
      }

      backToDoubleSecret();
    },
    onFail: () => {
      if (inheritanceScene.classList.contains("is-visible") && state.voiceEnabled) {
        setTimeout(listenForInheritanceDecision, 1200);
      }
    },
  });
}

function clearInheritanceSentence() {
  updateInheritanceSentence("", "等待输入");
  resetGeneratedPattern();
}

function saveInheritanceSentence() {
  const sentence = normalizeInheritanceSentence(inheritanceInput.value);

  if (!sentence) {
    inheritanceStatus.textContent = "请先留下一句话。";
    if (state.voiceEnabled) setTimeout(listenForInheritanceSentence, 600);
    return;
  }

  state.inheritanceSentence = sentence;
  state.inheritanceSaved = true;
  inheritancePreview.textContent = `“${sentence}”`;
  inheritanceStatus.textContent = "已封存为本次体验的传承绣签";

  try {
    localStorage.setItem("xiangEmbroideryInheritanceSentence", sentence);
  } catch {
    // Local storage may be unavailable in some privacy modes.
  }

  setTimeout(() => {
    if (inheritanceScene.classList.contains("is-visible") && state.voiceEnabled) {
      inheritanceStatus.textContent = "已封存。你可以说“重新开始”再体验一次。";
      listenForKeywords({
        keywords: ["重新开始", "返回"],
        onMatch: (matched) => {
          if (matched === "返回") backToDoubleSecret();
          else restart();
        },
        onFail: () => {},
      });
    }
  }, 800);
}

function initRuntimeHints() {
  if (window.location.protocol === "file:") {
    micStatus.textContent = "麦克风：请用本地服务打开";
    voiceGate.querySelector("span").textContent = "请用打开预览.bat 启动";
    voiceGate.querySelector("strong").textContent = "直接双击 index.html 时，语音权限和生图接口都可能不可用。";
    patternStatus.textContent = "后端未启动";
    patternInterpretation.textContent = "请通过 outputs 文件夹里的“打开预览.bat”打开网页，再生成图样。";
    return;
  }

  refreshBackendStatus();
}

document.addEventListener("click", (event) => {
  const flowerMoodButton = event.target.closest("button[data-flower-mood]");
  if (flowerMoodButton) {
    selectFlowerMood(flowerMoodButton.dataset.flowerMood);
    return;
  }

  const landscapeMoodButton = event.target.closest("button[data-landscape-mood]");
  if (landscapeMoodButton) {
    selectLandscapeMood(landscapeMoodButton.dataset.landscapeMood);
    return;
  }

  const tigerMoodButton = event.target.closest("button[data-tiger-mood]");
  if (tigerMoodButton) {
    selectTigerMood(tigerMoodButton.dataset.tigerMood);
    return;
  }

  const needleButton = event.target.closest("button[data-needle]");
  if (needleButton) {
    selectNeedle(needleButton.dataset.needle);
    return;
  }

  const colorButton = event.target.closest("button[data-color]");
  if (colorButton) {
    selectColor(colorButton.dataset.color);
    return;
  }

  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "next") nextStep();
  if (action === "ambient-on") {
    state.ambient = true;
    updateBackgroundMusic();
    nextStep();
  }
  if (action === "ambient-off") {
    state.ambient = false;
    updateBackgroundMusic();
    nextStep();
  }
  if (action === "mic") requestMic();
  if (action === "skip-mic") {
    state.mic = "denied";
    state.voiceEnabled = false;
    nextStep();
  }
  if (action === "voice-test") startVoiceTest();
  if (action === "to-prologue") showPrologue();
  if (action === "restart") restart();
  if (action === "listen-prologue") listenFromPrologue();
  if (action === "continue") showThreadChoice();
  if (action === "back-prologue") backToPrologue();
  if (action === "listen-color") listenForColor();
  if (action === "next-needle") showFirstNeedle();
  if (action === "back-thread") backToThreadChoice();
  if (action === "listen-needle") listenForNeedle();
  if (action === "next-branch") enterSelectedBranch();
  if (action === "skip-video") showCompletedBranch();
  if (action === "back-needle") backToFirstNeedle();
  if (action === "back-needle-from-landscape") backToFirstNeedle();
  if (action === "back-needle-from-flower") backToFirstNeedle();
  if (action === "back-tiger") backToTigerEye();
  if (action === "back-landscape") backToLandscape();
  if (action === "back-flower") backToFlower();
  if (action === "back-secret-source") backToSecretSource();
  if (action === "next-inheritance") showInheritance();
  if (action === "back-double-secret") backToDoubleSecret();
  if (action === "listen-inheritance") listenForInheritanceSentence();
  if (action === "clear-inheritance") clearInheritanceSentence();
  if (action === "generate-pattern") generateEmbroideryPattern();
  if (action === "change-api-key") changeImageApiKey();
  if (action === "save-inheritance") saveInheritanceSentence();
  if (action === "listen-tiger") listenForTigerMood();
  if (action === "listen-landscape") listenForLandscapeMood();
  if (action === "listen-flower") listenForFlowerMood();
  if (action === "finish-tiger") {
    const message = state.selectedTigerMood
      ? `虎眼已完成：${state.selectedTigerMood}。下一步将进入“双面绣的秘密”。`
      : "请先选择虎眼气质。";
    alert(message);
  }
  if (action === "finish-majestic-tiger") {
    showDoubleSecret("tiger");
  }
  if (action === "finish-quiet-tiger") {
    showDoubleSecret("tiger");
  }
  if (action === "finish-guardian-tiger") {
    showDoubleSecret("tiger");
  }
  if (action === "finish-landscape") {
    const message = state.selectedLandscapeMood
      ? `山水已完成：${state.selectedLandscapeMood}。下一步将进入“双面绣的秘密”。`
      : "请先选择山水气息。";
    alert(message);
  }
  if (action === "finish-distant-landscape") {
    showDoubleSecret("landscape");
  }
  if (action === "finish-quiet-landscape") {
    showDoubleSecret("landscape");
  }
  if (action === "finish-vast-landscape") {
    showDoubleSecret("landscape");
  }
  if (action === "finish-flower") {
    const message = state.selectedFlowerMood
      ? `花叶已完成：${state.selectedFlowerMood}。下一步将进入“双面绣的秘密”。`
      : "请先选择花叶寓意。";
    alert(message);
  }
  if (action === "finish-growth-flower") {
    showDoubleSecret("flower");
  }
  if (action === "finish-reunion-flower") {
    showDoubleSecret("flower");
  }
  if (action === "finish-elegant-flower") {
    showDoubleSecret("flower");
  }
});

stitchVideo.addEventListener("ended", showCompletedBranch);
voiceGate.addEventListener("click", beginVoiceOnlyExperience);
voiceGate.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    beginVoiceOnlyExperience();
  }
});
patternPreview.addEventListener("click", openPatternLightbox);
patternPreview.addEventListener("keydown", handlePatternPreviewKeydown);
lightboxClose.addEventListener("click", closePatternLightbox);
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) {
    closePatternLightbox();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageLightbox.classList.contains("is-open")) {
    closePatternLightbox();
  }
});
inheritanceInput.addEventListener("input", () => {
  updateInheritanceSentence(inheritanceInput.value, "正在生成绣签");
  if (!inheritanceInput.value.trim()) {
    resetGeneratedPattern();
  } else if (state.generatedPatternUrl) {
    resetGeneratedPattern("等待重新生成");
  } else if (!state.generatedPatternUrl) {
    patternStatus.textContent = "等待生成";
  }
});

try {
  const savedSentence = localStorage.getItem("xiangEmbroideryInheritanceSentence");
  if (savedSentence) {
    updateInheritanceSentence(savedSentence, "已载入上次封存的一句话");
    state.inheritanceSaved = true;
  }
} catch {
  // Local storage may be unavailable in some privacy modes.
}

preloadImages();
initRuntimeHints();
renderStep();
