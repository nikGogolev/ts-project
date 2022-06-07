import { renderBlock } from "./lib.js";
import { FavouritePlace } from "./search-results.js";
import { User } from "./User.js";

export function getUserData(): User {
  const user: unknown = JSON.parse(localStorage.getItem("user"));
  if (user === null) {
    console.log("Данные для user отсутствуют");
    return null;
  }
  if (user instanceof User) {
    return user;
  } else {
    console.log("Данные для user некорректны");
    return null;
  }
}

export function getFavoritesAmount(): number {
  const favoriteItems: FavouritePlace[] = JSON.parse(
    localStorage.getItem("favoriteItems")
  );
  if (favoriteItems?.length === 0) {
    console.log("Данные для favoritesAmount отсутствуют");
    return null;
  }
  return favoriteItems?.length;
}

export function renderUserBlock(
  user: User,
  favoriteItemsAmount?: number
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
