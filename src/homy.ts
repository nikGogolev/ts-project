import { placesCoordinates } from "./lib.js";
import { Place, SearchFormData } from "./search.js";
import { Provider } from "./search-results.js";

export async function searchHomy(
  searchParams: SearchFormData
): Promise<Place[]> {
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
  const searchResult = await f.json();

  return searchResult.map((place) => {
    return { ...place, provider: Provider.Homy };
  });
}
