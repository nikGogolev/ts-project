import { renderToast } from "./lib.js";
import { Provider } from "./search-results.js";
import { searchHomy } from "./homy.js";
import { searchFlatRent } from "./flatRent.js";
import { renderSearchResultsBlock } from "./search-results-render.js";

export interface SearchFormData {
  city: string;
  startDate: number;
  endDate: number;
  maxPrice: number;
}

export interface Place {
  bookedDates: unknown[];
  description: string;
  id: number | string;
  image: string;
  name: string;
  price: number;
  provider: Provider;
  remoteness?: number;
}

export interface RenderFormParams {
  checkinDate: string;
  checkoutDate: string;
  minDate: string;
  maxDate: string;
}

interface PlaceCallback {
  (error?: Error, result?: Place[]): void;
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
  const homyResult = await searchHomy(searchParams);
  const flatRentResult = await searchFlatRent(searchParams);
  const results = [...homyResult, ...flatRentResult];
  setTimeout(() => {
    if (Math.random() > 0.5) {
      callback(null, results);
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
      }, 300000);
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

export function getRenderFormParams(
  checkinDate?: string,
  checkoutDate?: string
): RenderFormParams {
  const minDate = new Date().toISOString().slice(0, 10);

  const today = new Date();
  const month = new Date().getMonth() === 12 ? 1 : new Date().getMonth() + 1;
  const nextMonthLastDay = new Date(today.getFullYear(), month + 1, 0);
  const maxDate = nextMonthLastDay.toISOString().slice(0, 10);

  const tempDate = new Date();
  tempDate.setDate(today.getDate() + 1);
  checkinDate = tempDate.toISOString().slice(0, 10);
  tempDate.setDate(tempDate.getDate() + 2);
  checkoutDate = tempDate.toISOString().slice(0, 10);

  return { checkinDate, checkoutDate, minDate, maxDate };
}
