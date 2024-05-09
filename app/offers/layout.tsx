export const dynamic = 'force-dynamic'

export default function Layout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {

    return (
        <div className="flex gap-6 flex-col w-full">
            {children}
        </div>
    )
}
