import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface Attachment {
    filename: string;
    contentType: string;
    content: Buffer;
    headers?: Record<string, string>;
}

export
interface EmailUser {
    displayName: string;
    emailAddress: string;
}

export
interface SendEmailArgs {
    from: EmailUser;
    replyTo?: EmailUser;
    sender?: EmailUser;
    to?: EmailUser[];
    cc?: EmailUser[];
    bcc?: EmailUser[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: Attachment[];
}

export default
abstract class SMTPPlugin extends Plugin {
    public readonly kind: PluginKind.SMTPPlugin = PluginKind.SMTPPlugin as const;
    public abstract send (args: SendEmailArgs): Promise<void>;
}
