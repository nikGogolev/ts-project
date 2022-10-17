import { callback, collectSearchParams, search } from "./search.js";
import { renderSearchStubBlock } from "./search-results.js";
import {
  getFavoritesAmount,
  getUserData,
  renderUserBlock,
} from "./user-component.js";

import { renderToast, replacer, reviver } from "./lib.js";
import { renderSearchFormBlock } from "./search-form-render.js";

window.addEventListener("DOMContentLoaded", () => {
  renderUserBlock(getUserData(), getFavoritesAmount());
  renderSearchFormBlock();
  renderSearchStubBlock();
  renderToast(
    {
      text: "Это пример уведомления. Используйте его при необходимости",
      type: "success",
    },
    {
      name: "Понял",
      handler: () => {
        console.log("Уведомление закрыто");
      },
    }
  );
  const searchFormBlock = document.getElementById("search-form-block");
  if (searchFormBlock instanceof HTMLElement) {
    searchFormBlock.addEventListener("submit", (e) => {
      e.preventDefault();
      search(collectSearchParams(), callback);
    });
  } else {
    console.log(
      "index.ts: searchFormBlock is not HTMLFormElement",
      searchFormBlock
    );
  }
});
