import { placesCoordinates, renderBlock, renderToast } from "./lib.js";
import { renderSearchResultsBlock } from "./search-results.js";

export interface SearchFormData {
  city: string;
  startDate: number;
  endDate: number;
  maxPrice: number;
}

export interface Place {
  bookedDates: unknown[];
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  remoteness: number;
}

interface PlaceCallback {
  (error?: Error, result?: Place[]): void;
}

interface requestParameters {
  coordinates: string;
  checkinDate: number;
  checkoutDate: number;
  maxPrice: number;
}

export const callback: PlaceCallback = (error, result) => {
  if (error === null && result !== null) {
    renderSearchResultsBlock(result);
  } else {
    renderToast({ type: "error", text: "Повторите поиск" });
  }
};

export async function search(
  searchParams: SearchFormData,
  callback: PlaceCallback
): Promise<void> {
  const f = await fetch(
    `http://127.0.0.1:3030/places?coordinates=${placesCoordinates.get(
      searchParams.city
    )}&checkInDate=${searchParams.startDate}&checkOutDate=${
      searchParams.endDate
    }&maxPrice=${+searchParams.maxPrice}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );
  const d = await f.json();

  setTimeout(() => {
    if (Math.random() > 0.5) {
      callback(null, d);
      setTimeout(() => {
        renderToast(
          { text: "Поиск устарел. Повторите поиск", type: "error" },
          {
            name: "Повторить поиск",
            handler: () => {
              search(collectSearchParams(), callback);
            },
          }
        );
      }, 20000);
    } else {
      callback(new Error("My Error"));
    }
  }, 500);
}

export function collectSearchParams(): SearchFormData {
  return {
    city: (document.getElementById("city") as HTMLTextAreaElement).value,
    startDate: +new Date(
      (document.getElementById("check-in-date") as HTMLTextAreaElement).value
    ),
    endDate: +new Date(
      (document.getElementById("check-out-date") as HTMLTextAreaElement).value
    ),
    maxPrice: +(document.getElementById("max-price") as HTMLTextAreaElement)
      .value,
  };
}

export function renderSearchFormBlock(
  startDate?: string,
  endDate?: string
): void {
  const minDate = new Date().toISOString().slice(0, 10);

  const today = new Date();
  const month = new Date().getMonth() === 12 ? 1 : new Date().getMonth() + 1;
  const nextMonthLastDay = new Date(today.getFullYear(), month + 1, 0);
  const maxDate = nextMonthLastDay.toISOString().slice(0, 10);

  const tempDate = new Date();
  tempDate.setDate(today.getDate() + 1);
  startDate = tempDate.toISOString().slice(0, 10);
  tempDate.setDate(tempDate.getDate() + 2);
  endDate = tempDate.toISOString().slice(0, 10);

  renderBlock(
    "search-form-block",
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value=${startDate} min=${minDate} max=${maxDate} name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value=${endDate} min=${minDate} max=${maxDate} name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  );
}
