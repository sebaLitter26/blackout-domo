export interface DynamicSearchResult<T> {
    lastSearch: string | null;
    searchResult: T[];
}