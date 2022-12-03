
export interface Image {
    imagen: string;
}

export interface StringSplitterData {
    propertyPath: string;
}

export interface DispatchCheckBoxData {
    iconResolverCallback: (data: any) => DispatchCheckBoxStyles;
}

export interface StringShowMoreData {
    propertyPath: string | undefined;
    maxLength: number | undefined;
}

interface DispatchCheckBoxStyles{
    icon: string;
    color: string;
}