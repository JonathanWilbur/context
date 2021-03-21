import AuthenticationPlugin from "./plugins/AuthenticationPlugin";
import BackupPlugin from "./plugins/BackupPlugin";
import CachePlugin from "./plugins/CachePlugin";
import ChatPlugin from "./plugins/ChatPlugin";
import ConfigurationPlugin from "./plugins/ConfigurationPlugin";
import SMTPPlugin from "./plugins/SMTPPlugin";
import FaxPlugin from "./plugins/FaxPlugin";
import InitPlugin from "./plugins/InitPlugin";
import LoggingPlugin from "./plugins/LoggingPlugin";
import MMSPlugin from "./plugins/MMSPlugin";
import StoragePlugin from "./plugins/StoragePlugin";

/**
 * When defining your own application-specific context, pass in `never` as
 * type parameters for members of the context you do not expect to use.
 */
export default
interface Context <
    AuthenticationPluginType extends AuthenticationPlugin | null = null,
    BackupPluginType extends BackupPlugin | null = null,
    CachePluginType extends CachePlugin | null = null,
    ChatPluginType extends ChatPlugin | null = null,
    ConfigPluginType extends ConfigurationPlugin | null = null,
    SMTPPluginType extends SMTPPlugin | null = null,
    FaxPluginType extends FaxPlugin | null = null,
    LoggingPluginType extends LoggingPlugin | null = null,
    MMSPluginType extends MMSPlugin | null = null,
    StoragePluginType extends StoragePlugin | null = null,
> {
    init: InitPlugin;
    authn?: AuthenticationPluginType;
    backups?: BackupPluginType;
    cache?: CachePluginType;
    chat?: ChatPluginType;
    config?: ConfigPluginType;
    email?: SMTPPluginType;
    fax?: FaxPluginType;
    log?: LoggingPluginType;
    mms?: MMSPluginType;
    store?: StoragePluginType;
}
