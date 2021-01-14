import type UUID from "./UUID";
import talc from "./talc";

export default
function uuidcmp (a: UUID, b: UUID): boolean {
    return (talc(a) === talc(b));
}
