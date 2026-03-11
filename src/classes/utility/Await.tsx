export default async function Delay(milliseconds: number) {
    await new Promise((r) => setTimeout(r, milliseconds));
}