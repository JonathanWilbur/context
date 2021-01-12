import AuthenticationPlugin from "./plugins/AuthenticationPlugin";
import BackupPlugin from "./plugins/BackupPlugin";
import CachePlugin from "./plugins/CachePlugin";
import ChatPlugin from "./plugins/ChatPlugin";
import ConfigurationPlugin from "./plugins/ConfigurationPlugin";
import EmailPlugin from "./plugins/EmailPlugin";
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
    AuthenticationPluginType extends AuthenticationPlugin = AuthenticationPlugin,
    BackupPluginType extends BackupPlugin = BackupPlugin,
    CachePluginType extends CachePlugin = CachePlugin,
    ChatPluginType extends ChatPlugin = ChatPlugin,
    ConfigPluginType extends ConfigurationPlugin = ConfigurationPlugin,
    EmailPluginType extends EmailPlugin = EmailPlugin,
    FaxPluginType extends FaxPlugin = FaxPlugin,
    LoggingPluginType extends LoggingPlugin = LoggingPlugin,
    MMSPluginType extends MMSPlugin = MMSPlugin,
    StoragePluginType extends StoragePlugin = StoragePlugin,
> {
    init: InitPlugin;
    authn?: AuthenticationPluginType;
    backups?: BackupPluginType;
    cache?: CachePluginType;
    chat?: ChatPluginType;
    config?: ConfigPluginType;
    email?: EmailPluginType;
    fax?: FaxPluginType;
    log?: LoggingPluginType;
    mms?: MMSPluginType;
    store?: StoragePluginType;
}
