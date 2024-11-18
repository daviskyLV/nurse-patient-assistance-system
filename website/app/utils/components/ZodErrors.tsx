// https://strapi.io/blog/epic-next-js-14-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js
export function ZodErrors({ error }: { error: string[] }) {
    if (!error) return null;
    return error.map((err: string, index: number) => (
        <div key={index} className="text-pink-500 text-xs italic mt-1 py-2">
            {err}
        </div>
    ));
}