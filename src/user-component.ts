import { renderBlock } from "./lib.js";
import { FavouritePlace } from "./search-results.js";
import { User } from "./User.js";

export function getUserData(): User | null {
  const userJSON = localStorage.getItem("user");

  if (userJSON === null) {
    console.log("Данные для user отсутствуют");
    return null;
  } else {
    const user = JSON.parse(userJSON);
    if (user instanceof User) {
      return user;
    } else {
      console.log("Данные для user некорректны");
      return null;
    }
  }
}

export function getFavoritesAmount(): number | null {
  const favoriteItemsJSON = localStorage.getItem("favoriteItems");

  if (favoriteItemsJSON === null) {
    console.log("Данные для favoritesAmount отсутствуют");
    return null;
  } else {
    const favoriteItems: FavouritePlace[] = JSON.parse(favoriteItemsJSON);
    return favoriteItems.length;
  }
}

export function renderUserBlock(
  user: User | null,
  favoriteItemsAmount?: number | null
): void {
  const favoritesCaption = favoriteItemsAmount
    ? favoriteItemsAmount
    : "ничего нет";
  const hasFavoriteItems = favoriteItemsAmount ? true : false;

  renderBlock(
    "user-block",
    `
    <div class="header-container">
      <img class="avatar" src=${user?.avatarUrl} alt=${user?.userName} />
      <div class="info">
          <p class="name">${user?.userName}</p>
          <p class="fav">
            <i class="heart-icon${
              hasFavoriteItems ? " active" : ""
            }"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  );
}
