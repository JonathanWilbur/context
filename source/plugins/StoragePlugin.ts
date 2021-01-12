import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface StorageObjectID {
    key: string;
    version?: string;
}

export
interface StorageObjectInfo extends StorageObjectID {
    lastModified?: Date;
    sizeInBytes?: number;
    storageClass?: string;
    owner?: string;
    etag?: string;
}

export
interface BucketID {
    name: string;
}

export
interface BucketInfo extends BucketID {
    versioning?: boolean;
}

export
interface StorageObjectPermissions {
    /**
     * Corresponds to the permission "c" in Azure Blob Storage.
     */
    create: boolean;

    /**
     * Corresponds to the permission "r" in Azure Blob Storage.
     */
    read: boolean;

    /**
     * Corresponds to the permission "w" in Azure Blob Storage.
     */
    update: boolean;

    /**
     * Corresponds to the permission "d" in Azure Blob Storage.
     */
    delete: boolean;

    /**
     * Corresponds to the permission "a" in Azure Blob Storage.
     */
    append: boolean;

    /**
     * Corresponds to the permission "c" in Azure Blob Storage.
     */
    createVersion: boolean;

    /**
     * Corresponds to the permission "r" in Azure Blob Storage.
     */
    readVersion: boolean;

    /**
     * Corresponds to the permission "x" in Azure Blob Storage.
     */
    deleteVersion: boolean;

    /**
     * Corresponds to the permission "t" in Azure Blob Storage.
     */
    readTags: boolean;

    /**
     * Corresponds to the permission "t" in Azure Blob Storage.
     */
    writeTags: boolean;
}

export
interface PresignedURLOptions {

    /**
     * Whether access should only be permitted over HTTPS.
     */
    httpsOnly?: boolean;

    /**
     * Defaults to now.
     */
    startDate?: Date;

    /**
     * No expiration if this is absent.
     */
    endDate?: Date;

    /**
     * Permissions associated with the URL.
     */
    permissions?: Partial<StorageObjectPermissions>;
}

export
type Tags = Record<string, string>;

// REVIEW: in `putObject`, do I need to redefine `content` as a `ReadableStream`?
export default
abstract class StoragePlugin extends Plugin {
    public readonly kind: PluginKind.StoragePlugin = PluginKind.StoragePlugin as const;
    public abstract checkBucket (bucketName: string): Promise<boolean>;
    public abstract checkObject (bucketName: string, oid: StorageObjectID): Promise<boolean>;
    public abstract copyObject (bucketName: string, srcOID: StorageObjectID, destOID: StorageObjectID, overwrite?: boolean): Promise<void>;
    public abstract createBucket (bucketName: string, options?: Record<string, string>): Promise<void>;
    public abstract deleteBucket (bucketName: string): Promise<void>;
    public abstract deleteObject (bucketName: string, oid: StorageObjectID): Promise<void>;
    public abstract deleteObjects (bucketName: string, objects: StorageObjectInfo[]): Promise<void>;
    public abstract deleteObjectTagging (bucketName: string, oid: StorageObjectID): Promise<void>;
    public abstract getObject (bucketName: string, oid: StorageObjectID): Promise<Buffer>;
    public abstract getObjectTagging (bucketName: string, oid: StorageObjectID): Promise<Tags>;
    public abstract getPresignedURL (bucketName: string, oid: StorageObjectID | undefined, options: PresignedURLOptions): Promise<string>;
    public abstract listBuckets (): Promise<AsyncIterableIterator<BucketInfo>>;
    public abstract listObjects (bucketName: string, prefix?: string): Promise<AsyncIterableIterator<StorageObjectInfo>>;
    public abstract listObjectVersions (bucketName: string, oid: StorageObjectID): Promise<AsyncIterableIterator<StorageObjectInfo>>;
    public abstract putObject (bucketName: string, oid: StorageObjectID, content: Buffer): Promise<void>;
    public abstract putObjectTagging (bucketName: string, oid: StorageObjectID, tags: Tags): Promise<void>;
}
