export interface BookDetails extends BooksCounter{
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string,
}

export interface BooksCounter {
    id: number,
    count: number,
}

export interface Book extends BookDetails, BooksCounter {}
