export function cloneDate(date: Date): Date;

export function addDays(date: Date, days: number): Date;

export const backendPort: number;
export const localStorageKey: string;

interface FlatRentFlat {
  id: string;
  title: string;
  details: string;
  photos: string[];
  coordinates: number[];
  bookedDates: Date[];
  totalPrice: number;
}

export interface FlatRentParameters {
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit?: number;
}

export class FlatRentSdk {
  get(id: string): Promise<Object | null>;

  search(parameters: FlatRentParameters): Promise<FlatRentFlat[]>;

  book(flatId: number | string, checkInDate: Date, checkOutDate: Date): number;

  private _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date): void;

  private _resetTime(date: Date);

  private _calculateDifferenceInDays(startDate: Date, endDate: Date): number;

  private _generateDateRange(from: Date, to: Date): Date[];

  private _generateTransactionI(): number;

  private _areAllDatesAvailable(flat: FlatRentFlat, dateRange: Date[]);

  private _formatFlatObject(flat: FlatRentFlat, nightNumber: number);

  private _readDatabase(): FlatRentFlat[] | null;

  private _writeDatabase(database: FlatRentFlat[]): void;

  private _syncDatabase(database: FlatRentFlat[]): void;
}
