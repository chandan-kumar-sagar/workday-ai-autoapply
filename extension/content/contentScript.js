/**
 * MIT License
 * Created by Chandan Kumar
 * Copyright (c) 2026
 */
console.log("✅ Workday AutoFill Extension Loaded");

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * GET FIELD LABEL
 */
function getFieldLabel(field) {
  // Method 1
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.innerText.trim();
  }

  // Method 2
  const labelledBy = field.getAttribute("aria-labelledby");
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) return label.innerText.trim();
  }

  // Method 3
  const container =
    field.closest('[data-automation-id="formField"]') ||
    field.closest("div");

  if (container) {
    const label = container.querySelector("label");
    if (label) return label.innerText.trim();
  }

  // Method 4
  const ariaLabel = field.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.trim();

  // Method 5
  const placeholder = field.getAttribute("placeholder");
  if (placeholder) return placeholder.trim();

  return null;
}

/**
 * FILL FIELD
 */
async function fillField(field, value) {
  try {
    field.focus();

    await wait(200);

    const tagName = field.tagName.toUpperCase();
    const role = field.getAttribute("role");
    const autoId = field.getAttribute("data-automation-id");

    // Workday Dropdown
    if (role === "combobox" || autoId === "dropdown") {
      await fillWorkdayDropdown(field, value);
      return;
    }

    // INPUT / TEXTAREA
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      const prototype =
        tagName === "INPUT"
          ? HTMLInputElement.prototype
          : HTMLTextAreaElement.prototype;

      const nativeSetter = Object.getOwnPropertyDescriptor(
        prototype,
        "value"
      ).set;

      nativeSetter.call(field, value);
    }

    // SELECT
    if (tagName === "SELECT") {
      field.value = value;
    }

    // Trigger React Events
    field.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    field.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    field.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
      })
    );

    field.dispatchEvent(
      new KeyboardEvent("keyup", {
        bubbles: true,
      })
    );

    field.dispatchEvent(
      new Event("blur", { bubbles: true })
    );

    await wait(300);
  } catch (error) {
    console.log("❌ Fill Error:", error);
  }
}

/**
 * WORKDAY DROPDOWN
 */
async function fillWorkdayDropdown(field, value) {
  try {
    field.click();

    await wait(1000);

    const options = Array.from(
      document.querySelectorAll(
        '[role="option"], [data-automation-id="menuItem"]'
      )
    );

    if (!options.length) {
      console.log("⚠️ No dropdown options found");
      return;
    }

    const match =
      options.find((opt) => {
        const text = opt.innerText.toLowerCase();

        return (
          text.includes(value.toLowerCase()) ||
          value.toLowerCase().includes(text)
        );
      }) || options[0];

    console.log(`✅ Selecting option: ${match.innerText}`);

    match.click();

    await wait(500);
  } catch (error) {
    console.log("❌ Dropdown Error:", error);
  }
}

/**
 * STATIC FIELD MATCHES
 */
function getStaticFieldValue(label) {
  const lower = label.toLowerCase();

  const staticMap = {
    "how did you hear about us": "LinkedIn",
    source: "LinkedIn",

    gender: "Male",
    "notice period": "Immediate",
    "work authorization": "Yes",
    "authorized to work": "Yes",
    sponsorship: "No",
    "visa sponsorship": "No",
  };

  for (const key in staticMap) {
    if (lower.includes(key)) {
      console.log(`🧠 Static Match: ${label}`);
      return staticMap[key];
    }
  }

  return null;
}

/**
 * API FIELD MAPPING
 */
async function getMappedValue(fieldLabel) {
  try {
    // Skip useless labels
    const skipWords = [
      "yes",
      "no",
      "agree",
      "disagree",
      "male",
      "female",
    ];

    if (
      skipWords.includes(
        fieldLabel.trim().toLowerCase()
      )
    ) {
      console.log(
        `⏭️ Skipping useless field: ${fieldLabel}`
      );
      return "";
    }

    // 1. BACKEND REQUEST FIRST (Get real data from resume)
    const response = await fetch(
      "http://localhost:5000/api/automation/map-field",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldLabel,
        }),
      }
    );

    const data = await response.json();
    const backendValue = data?.result?.value;

    if (backendValue) {
      return backendValue;
    }

    // 2. STATIC MATCH FALLBACK (For things not in resume like gender/sponsorship)
    const staticValue = getStaticFieldValue(fieldLabel);

    if (staticValue) {
      return staticValue;
    }

    return "";
  } catch (error) {
    console.log("❌ Mapping Error:", error);
    return "";
  }
}

/**
 * WAIT FOR DYNAMIC CONTENT
 */
function waitForDynamicContent() {
  return new Promise((resolve) => {
    const selector =
      'input, textarea, select, [role="combobox"]';

    if (document.querySelectorAll(selector).length > 0) {
      return resolve();
    }

    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 5000);

    const observer = new MutationObserver(() => {
      if (
        document.querySelectorAll(selector).length > 0
      ) {
        clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// MAIN AUTOFILL
// ─────────────────────────────────────────────────────────────

async function autofillForm() {
  console.log("🚀 Starting Autofill...");

  await waitForDynamicContent();

  const fields = Array.from(
    document.querySelectorAll(
      'input, textarea, select, [role="combobox"], [data-automation-id="dropdown"]'
    )
  ).filter((field) => {
    const type = field.type?.toLowerCase();

    // Skip invalid types
    if (
      [
        "hidden",
        "submit",
        "button",
        "file",
        "search",
      ].includes(type)
    ) {
      return false;
    }

    if (field.disabled || field.readOnly) {
      return false;
    }

    // Visible fields only
    const rect = field.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  });

  console.log(`📋 Found ${fields.length} valid fields`);

  for (const field of fields) {
    try {
      const label = getFieldLabel(field);

      if (!label) continue;

      console.log(`🔍 Mapping: "${label}"`);

      const value = await getMappedValue(label);

      if (!value) {
        console.log(`⏭️ Skipping "${label}"`);
        continue;
      }

      console.log(
        `✅ Filling "${label}" => "${value}"`
      );

      await fillField(field, value);

      // Delay between fields
      await wait(800);
    } catch (error) {
      console.log("❌ Field Error:", error);
    }
  }

  console.log("🎉 Autofill Completed!");
}

// ─────────────────────────────────────────────────────────────
// AUTO NEXT STEP
// ─────────────────────────────────────────────────────────────

async function autoNextStep() {
  await wait(2000);

  const nextButton = Array.from(
    document.querySelectorAll("button")
  ).find((btn) => {
    const text = btn.innerText.toLowerCase();

    return (
      text.includes("next") ||
      text.includes("continue") ||
      text.includes("save and continue")
    );
  });

  if (!nextButton) {
    return false;
  }

  console.log("➡️ Clicking Next Button");

  nextButton.click();

  return true;
}

// ─────────────────────────────────────────────────────────────
// MULTI STEP AUTOMATION
// ─────────────────────────────────────────────────────────────

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
        console.log("🛑 No next button found");
        break;
      }

      step++;

      await wait(5000);

      const currentPage = location.href;

      if (currentPage === previousPage) {
        console.log(
          "⚠️ Same page detected (validation issue possible)"
        );
        break;
      }

      previousPage = currentPage;
    }
  } finally {
    console.log("✅ Automation Finished");

    isProcessing = false;
  }
}

// ─────────────────────────────────────────────────────────────
// MESSAGE LISTENER
// ─────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "START_AUTOFILL") {
      startAutomation();

      sendResponse({
        status: "started",
      });
    }

    return true;
  }
);

// ─────────────────────────────────────────────────────────────
// FLOATING BUTTON
// ─────────────────────────────────────────────────────────────

function createAutofillButton() {
  if (
    document.getElementById("wd-autofill-btn")
  ) {
    return;
  }

  const button = document.createElement("button");

  button.id = "wd-autofill-btn";

  button.innerText = "⚡ Auto Fill";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "999999",
    padding: "12px 20px",
    background:
      "linear-gradient(135deg, #76b900, #4a8c00)",
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

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

window.addEventListener("load", () => {
  setTimeout(createAutofillButton, 3000);
});