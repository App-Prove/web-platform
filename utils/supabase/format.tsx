export function formatOffers(data: any) : Offer[]{
    // Data is an array of objects (offers)
    return data.map((offer: any) => {
        return {
            id: offer.id,
            url: offer.url,
            badges: offer.keywords.split(','),
            description: offer.description,
            budget: offer.budget,
            from: offer.from,
            to: offer.to,
            participants: offer.participants,
            type: offer.type,
            owner: offer.owner,
            lines_count: offer.lines_count,
            files_count: offer.files_count,
        } as Offer;
    })
}