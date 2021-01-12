import type WithAPIVersion from "./WithAPIVersion";
import type WithKind from "./WithKind";
import type WithMetadata from "./WithMetadata";

export default
interface KubernetesObject extends WithAPIVersion, WithKind, WithMetadata {

}
