export function formatOffers(data: any) : Offer[]{
    // Data is an array of objects (offers)
    return data.map((offer: any) => {
        return {
            id: offer.id,
            url: offer.url,
            keywords: offer.keywords?.split(','),
            description: offer.description,
            type: offer.type,
            owner: offer.owner,
            lines_count: offer.lines_count,
            files_count: offer.files_count,
        } as Offer;
    })
}