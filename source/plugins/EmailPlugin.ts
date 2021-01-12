import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface Attachment {
    contentType: string;
    content: Buffer;
}

export
interface EmailUser {
    displayName: string;
    emailAddress: string;
}

export
interface SendEmailArgs {
    from: EmailUser;
    to?: EmailUser[];
    cc?: EmailUser[];
    bcc?: EmailUser[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: Attachment[];
}

export default
abstract class EmailPlugin extends Plugin {
    public readonly kind: PluginKind.EmailPlugin = PluginKind.EmailPlugin as const;
    public abstract send (args: SendEmailArgs): Promise<void>;
}
