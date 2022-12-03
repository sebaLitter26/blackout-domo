export interface DynamicTableColumnMenuData {
    options: DynamicTableColumnMenuOption[];
}

export interface DynamicTableColumnMenuOption<T = any, K = void> {
    icon?: string | ((data: T) => string);
    description: string | ((data: T) => string);
    optionFn?: (data: T) => K;
}