console.log(" Workday AutoFill Extension Loaded");

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function getFieldLabel(field) {
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.innerText.replace(/\*/g, "").trim();
  }
  const labelledBy = field.getAttribute("aria-labelledby");
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) return label.innerText.replace(/\*/g, "").trim();
  }
  const ariaLabel = field.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.replace(/\*/g, "").trim();
  const placeholder = field.getAttribute("placeholder");
  if (placeholder) return placeholder.replace(/\*/g, "").trim();
  if (field.previousElementSibling && field.previousElementSibling.tagName === "LABEL") {
    return field.previousElementSibling.innerText.replace(/\*/g, "").trim();
  }
  let parent = field.parentElement;
  for (let i = 0; i < 4; i++) {
    if (!parent) break;
    const label = parent.querySelector("label");
    if (label) return label.innerText.replace(/\*/g, "").trim();
    parent = parent.parentElement;
  }
  const workdayContainer = field.closest('[data-automation-id="formField"], [data-automation-id="formField-container"]');
  if (workdayContainer) {
    const label = workdayContainer.querySelector('label, [data-automation-id="label"]');
    if (label) return label.innerText.replace(/\*/g, "").trim();
  }
  const nameAttr = field.getAttribute("name");
  if (nameAttr) {
    const spaced = nameAttr.replace(/([A-Z])/g, " $1");
    return spaced.replace(/_/g, " ").trim();
  }
  return null;
}

async function fillField(field, value) {
  try {
    field.focus();
    await wait(200);
    const tagName = field.tagName.toUpperCase();
    const role = field.getAttribute("role");
    const autoId = field.getAttribute("data-automation-id");
    if (role === "combobox" || autoId === "dropdown") {
      await fillWorkdayDropdown(field, value);
      return;
    }
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      const prototype = tagName === "INPUT" ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
      nativeSetter.call(field, value);
    }
    if (tagName === "SELECT") {
      field.value = value;
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
    field.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
    field.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
    field.dispatchEvent(new Event("blur", { bubbles: true }));
    await wait(300);
  } catch (error) {
    console.log(" Fill Error:", error);
  }
}

async function fillWorkdayDropdown(field, value) {
  try {
    field.click();
    await wait(1000);
    const options = Array.from(document.querySelectorAll('[role="option"], [data-automation-id="menuItem"]'));
    if (!options.length) {
      console.log(" No dropdown options found");
      return;
    }
    const match = options.find((opt) => {
      const text = opt.innerText.toLowerCase();
      return text.includes(value.toLowerCase()) || value.toLowerCase().includes(text);
    }) || options[0];
    console.log(` Selecting option: ${match.innerText}`);
    match.click();
    await wait(500);
  } catch (error) {
    console.log(" Dropdown Error:", error);
  }
}

function getStaticFieldValue(label) {
  const lower = label.toLowerCase();
  const staticMap = {
    "how did you hear about us": "LinkedIn",
    "source": "LinkedIn",
    "gender": "Male",
    "notice period": "Immediate",
    "work authorization": "Yes",
    "authorized to work": "Yes",
    "sponsorship": "No",
    "visa sponsorship": "No",
  };
  for (const key in staticMap) {
    if (lower.includes(key)) {
      console.log(`Static Match: ${label}`);
      return staticMap[key];
    }
  }
  return null;
}

let activeBackendUrl = null;

async function detectActiveBackend() {
  if (activeBackendUrl) return activeBackendUrl;

  // 1. Check if user configured a custom backend URL in extension settings
  try {
    const data = await chrome.storage.local.get("customBackendUrl");
    if (data && data.customBackendUrl) {
      console.log(`🔌 Using custom backend URL from storage: ${data.customBackendUrl}`);
      activeBackendUrl = data.customBackendUrl;
      return activeBackendUrl;
    }
  } catch (err) {
    console.warn("Could not read custom backend URL from storage:", err.message);
  }

  // 2. Otherwise auto-detect which candidate is active
  const candidateUrls = [
    "http://localhost:5000",
    "https://workday-ai-autoapply-production.up.railway.app"
  ];

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s timeout
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data && data.message === "Workday AI Auto Apply API") {
          console.log(`🔌 Connected to active backend at: ${url}`);
          activeBackendUrl = url;
          return url;
        }
      }
    } catch (e) {
      console.warn(`Backend ping failed for ${url}:`, e.message);
    }
  }

  // Default fallback if no backend is active
  activeBackendUrl = "http://localhost:5000";
  return activeBackendUrl;
}

async function getMappedValue(fieldLabel) {
  try {
    const skipWords = ["yes", "no", "agree", "disagree", "male", "female"];
    if (skipWords.includes(fieldLabel.trim().toLowerCase())) {
      console.log(`⏭ Skipping useless field: ${fieldLabel}`);
      return "";
    }

    const baseUrl = await detectActiveBackend();
    try {
      const response = await fetch(`${baseUrl}/api/automation/map-field`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldLabel }),
      });
      const data = await response.json();
      if (data?.result?.value) {
        return data.result.value;
      }
    } catch (e) {
      console.warn(`Active backend fetch failed at ${baseUrl}:`, e.message);
      activeBackendUrl = null; // Clear cache on error to retry detection next time
    }

    const staticValue = getStaticFieldValue(fieldLabel);
    if (staticValue) return staticValue;
    return "";
  } catch (error) {
    console.log(" Mapping Error:", error);
    return "";
  }
}

function waitForDynamicContent() {
  return new Promise((resolve) => {
    const selector = 'input, textarea, select, [role="combobox"]';
    if (document.querySelectorAll(selector).length > 0) return resolve();
    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 5000);
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(selector).length > 0) {
        clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function autofillForm() {
  console.log(" Starting Autofill...");
  await waitForDynamicContent();
  const fields = Array.from(document.querySelectorAll('input, textarea, select, [role="combobox"], [data-automation-id="dropdown"]')).filter((field) => {
    const type = field.type?.toLowerCase();
    if (["hidden", "submit", "button", "file", "search"].includes(type)) return false;
    if (field.disabled || field.readOnly) return false;
    const rect = field.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  console.log(`Found ${fields.length} valid fields`);
  for (const field of fields) {
    try {
      const label = getFieldLabel(field);
      if (!label) {
        console.log(" No label found for field:", field);
        continue;
      }
      console.log(` Mapping: "${label}"`);
      const value = await getMappedValue(label);
      if (!value) {
        console.log(`Skipping "${label}"`);
        continue;
      }
      console.log(` Filling "${label}" => "${value}"`);
      await fillField(field, value);
      await wait(800);
    } catch (error) {
      console.log(" Field Error:", error);
    }
  }
  console.log(" Autofill Completed!");
}

async function autoNextStep() {
  await wait(2000);
  const nextButton = Array.from(document.querySelectorAll("button")).find((btn) => {
    const text = btn.innerText.toLowerCase();
    return text.includes("next") || text.includes("continue") || text.includes("save and continue");
  });
  if (!nextButton) return false;
  console.log(" Clicking Next Button");
  nextButton.click();
  return true;
}

let isProcessing = false;
const MAX_AUTO_STEPS = 10;

async function startAutomation() {
  if (isProcessing) return;
  isProcessing = true;
  let step = 0;
  let previousPage = location.href;
  try {
    while (step < MAX_AUTO_STEPS) {
      console.log(`\n── Step ${step + 1} ──`);
      await autofillForm();
      const nextClicked = await autoNextStep();
      if (!nextClicked) {
        console.log(" No next button found");
        break;
      }
      step++;
      await wait(5000);
      const currentPage = location.href;
      if (currentPage === previousPage) {
        console.log("Same page detected (validation issue possible)");
        break;
      }
      previousPage = currentPage;
    }
  } finally {
    console.log(" Automation Finished");
    isProcessing = false;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_AUTOFILL") {
    startAutomation();
    sendResponse({ status: "started" });
  }
  return true;
});

function createAutofillButton() {
  if (document.getElementById("wd-autofill-btn")) return;
  const button = document.createElement("button");
  button.id = "wd-autofill-btn";
  button.innerText = " Auto Fill";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "999999",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #00E5FF, #0052D4)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
  });
  button.addEventListener("click", startAutomation);
  document.body.appendChild(button);
}

window.addEventListener("load", () => {
  setTimeout(createAutofillButton, 3000);
});