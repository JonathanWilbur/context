import type WithAnnotations from "./WithAnnotations";
import type WithCreationTime from "./WithCreationTime";
import type WithGeneration from "./WithGeneration";
import type WithLabels from "./WithLabels";
import type WithName from "./WithName";
import type WithNamespace from "./WithNamespace";
import type WithUUID from "./WithUUID";

export default
interface Metadata extends
    Partial<WithAnnotations>,
    Partial<WithCreationTime>,
    Partial<WithGeneration>,
    Partial<WithLabels>,
    WithName,
    WithNamespace,
    WithUUID
{

}
