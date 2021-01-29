import Plugin from "../Plugin";
import PluginKind from "../PluginKind";
import type WithAuthenticated from "../WithAuthenticated";

export default
abstract class AuthenticationPlugin <
    LoginRequest extends Record<string, any> = Record<string, any>,
    LoginResponse extends WithAuthenticated = WithAuthenticated,
    LogoutRequest extends Record<string, any> = Record<string, any>,
    LogoutResponse extends WithAuthenticated = WithAuthenticated,
    CheckRequest extends Record<string, any> = Record<string, any>,
    CheckResponse extends WithAuthenticated = WithAuthenticated,
> extends Plugin {
    public readonly kind: PluginKind.AuthenticationPlugin = PluginKind.AuthenticationPlugin as const;
    /**
     * This should be one of the identifiers registered here:
     * https://www.iana.org/assignments/sasl-mechanisms/sasl-mechanisms.xhtml
     */
    public abstract saslMechanism: string;
    public abstract login (args: LoginRequest): Promise<LoginResponse>;
    public abstract logout (args: LogoutRequest): Promise<LogoutResponse>;
    public abstract check (args: CheckRequest): Promise<CheckResponse>;
}
