interface toastMessage {
  text: string;
  type: string;
}

interface toastAction {
  name: string;
  handler: () => void;
}

export const placesCoordinates = new Map<string, string>();

placesCoordinates.set("Санкт-Петербург", "59.9386,30.3141");

export function renderBlock(elementId: string, html: string) {
  const element = document.getElementById(elementId);
  element.innerHTML = html;
}

export function renderToast(message: toastMessage, action?: toastAction): void {
  let messageText = "";

  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || "Закрыть"}</button>
      </div>
    `;
  }

  renderBlock("toast-block", messageText);

  const button = document.getElementById("toast-main-action");
  if (button != null) {
    button.onclick = function () {
      if (action != null && action.handler != null) {
        action.handler();
      }
      renderToast(null);
    };
  }
}

interface JSONreplacer {
  dataType: string;
  value: [any, any][];
}

export function replacer<V>(key: string, value: V): JSONreplacer | V {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export enum sortType {
  cheap = "cheap",
  expensive = "expensive",
  close = "close",
}
