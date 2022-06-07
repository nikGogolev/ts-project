import { renderBlock, renderToast } from "./lib.js";
import { collectSearchParams, Place, SearchFormData } from "./search-form.js";

export interface FavouritePlace {
  id: number;
  name: string;
  img: string;
}

export function renderSearchStubBlock(): void {
  renderBlock(
    "search-results-block",
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  );
}

export function renderEmptyOrErrorSearchBlock(reasonMessage: string): void {
  renderBlock(
    "search-results-block",
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  );
}

export function toggleFavoriteItem(place: FavouritePlace): void {
  const favoritesElements = document.querySelectorAll(".favorites");

  const localStorageFavouriteItems: FavouritePlace[] = JSON.parse(
    localStorage.getItem("favoriteItems")
  );
  if (!localStorageFavouriteItems) {
    const favoriteItems: FavouritePlace[] = [];
    favoriteItems.push(place);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    favoritesElements.forEach((el: HTMLElement) => {
      if (+el.dataset.id === +place.id) {
        el.classList.add("active");
      }
    });
  } else {
    if (
      localStorageFavouriteItems.reduce(
        (prev, current) => prev || current.id === place.id,
        false
      )
    ) {
      localStorage.setItem(
        "favoriteItems",
        JSON.stringify(
          localStorageFavouriteItems.filter((item) => item.id !== place.id)
        )
      );
      favoritesElements.forEach((el: HTMLElement) => {
        if (+el.dataset.id === +place.id) {
          el.classList.remove("active");
        }
      });
    } else {
      localStorageFavouriteItems.push(place);
      localStorage.setItem(
        "favoriteItems",
        JSON.stringify(localStorageFavouriteItems)
      );
      favoritesElements.forEach((el: HTMLElement) => {
        if (+el.dataset.id === +place.id) {
          el.classList.add("active");
        }
      });
    }
  }
}

export async function bookPlace(
  id: number,
  searchParams: SearchFormData
): Promise<void> {
  const f = await fetch(
    `http://127.0.0.1:3030/places/${id}?checkInDate=${searchParams.startDate}&checkOutDate=${searchParams.endDate}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );
  const d = await f.json();
  if (d.name === "BadRequest") {
    renderToast({
      type: "error",
      text: "Данные даты не доступны для бронирования",
    });
  } else {
    renderToast({
      type: "success",
      text: `Отель ${d.name} забронирован на даты с ${new Date(
        d.bookedDates[0] / 1000
      )} по ${new Date(d.bookedDates[d.bookedDates.length - 1] / 1000)}`,
    });
  }

  console.log(d);
}

export function renderSearchResultsBlock(results: Place[]): void {
  const localStorageFavouriteItems: FavouritePlace[] = JSON.parse(
    localStorage.getItem("favoriteItems")
  );
  let resultsHTML = "";
  results.forEach((result) => {
    const faforiteIsActive = !!localStorageFavouriteItems?.find(
      (el) => +el.id === +result.id
    );

    resultsHTML += `<li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites ${
              faforiteIsActive ? "active" : ""
            }" data-id=${result.id} data-name=${result.name} data-img=${
      result.image
    }></div>
            <img class="result-img" src=${result.image} alt="">
          </div>	
          <div class="result-info">
            <div class="result-info--header">
              <p>${result.name}</p>
              <p class="price">${result.price}&#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> ${
              result.remoteness
            }км от вас</div>
            <div class="result-info--descr">${result.description}</div>
            <div class="result-info--footer">
              <div>
                <button class="book-btn" data-id=${
                  result.id
                }>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>`;
  });
  console.log(resultsHTML);
  renderBlock(
    "search-results-block",
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
    ${resultsHTML}
    </ul>
    `
  );

  const favoriteItems = document.getElementsByClassName("favorites");
  for (let i = 0; i < favoriteItems.length; i++) {
    favoriteItems[i].addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement) {
        toggleFavoriteItem({
          id: +e.target.dataset.id,
          name: e.target.dataset.name,
          img: e.target.dataset.img,
        });
      }
    });
  }

  const bookButtons = document.getElementsByClassName("book-btn");
  console.log(bookButtons);

  for (let i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener("click", (e) => {
      console.log(e);

      if (e.target instanceof HTMLButtonElement) {
        console.log("book");

        bookPlace(+e.target.dataset.id, collectSearchParams());
      }
    });
  }
}
