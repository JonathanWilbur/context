# The Wildboar Context Library

* Author: [Jonathan M. Wilbur](https://github.com/JonathanWilbur) <[jonathan@wilbur.space](mailto:jonathan@wilbur.space)>
* Copyright Year: 2021
* License: [MIT License](https://mit-license.org/)

Over the years, I have come to believe in functional programming. I have seen
firsthand how complex object-oriented programs can become, and for little value.
Of all of the named benefits of object-oriented programming, I can only name
inheritance as a benefit that is (currently) exclusive to it.

I think the most valuable benefit of functional programs is how easy they are
to test. The more stateless these functions are, the less setup you require.
With a program composed of only pure functions, tests can be executed with
minimal setup, because you just pass in the same arguments every time and you
will get the same result. If you have the state of your application distributed
throughout the codebase, a bug in a function could have come from anywhere.

Functional programs can be easy to test and debug, but only to the extent that
functions are pure. When you compose a program out of pure functions, which, in turn,
may themselves be composed of more pure functions, and possibly with recursion, the
state that becomes available to more deeply nested functions can tend to shrink.

For instance, a top level function of your program, `run_server()` may receive
a configuration object that contains the database credentials. If `run_server()`
calls a pure function, say `warm_up_cache()`, without passing in those
credentials and that second pure function `warm_up_cache()` has to call another
pure function, say `get_users_from_database()`, that depends on those
credentials, the only ways to get those credentials to that depending function
are to:

1. Pass the credentials into the second function so it can pass it into the
   third, or
2. Import the credentials into the function with the third function, which would
   make the third function impure.

As a program becomes more complex, it becomes more difficult to predict what
inputs a function will need. For just about anything server-side, many functions
will need access to:

- Logging
- Configuration
- The database

Less frequently, functions will also need access to these (inclusively):

- Message queues
- Object stores
- Caches
- Containers
- Authentication
- Authorization

That means that, as your pure functional program grows, it becomes increasingly
difficult to predict what inputs your function will need. Some have argued that
you should never pass in what you don't need into a function, because you will
establish a new dependency, but my counter-argument to that is that the use of
something is not a dependency: the use merely fulfills the dependency that
already exists.

For this reason, I believe that the ideal computer program will take the form
of mostly pure functions that pass the _entire state of the program_ to each
other. For those familiar, this will look a lot like dependency injection, but
on steroids. Many programs, like OpenSSL and Dovecot, already do this, and they
call this global state the "context."

Here is an example of a traditionally-designed program:

```typescript
import db from "./db";
import log from "./log";
import config from "./config";

function do_something (): void {
    db.users.delete_all(config.bad_boys);
    log.info("Deleted all bad boys.");
}
```

And here is an example of how this would be done using the paradigm I have
described:

```typescript
function do_something (ctx: Context): void {
    const { db, log, config } = ctx;
    db.users.delete_all(config.bad_boys);
    log.info("Deleted all bad boys.");
}
```

This library is for building a context to pass between such pure functions in
a program. This context object to be passed between all functions has some, if
not all, of the following functionalities covered by its properties:

- Configuration
- Logging
- Database Access
- Caching
- Message Queues
- Object Stores / File Stores
- Containers
- Authorization
- Authentication
- Initialization
- Execution

These functionalities are covered by what are called "plugins." Somewhat in
contradiction with what I have said earlier, these plugins are abstract classes
that define a modicum of functions that each plugin, when instantiated, should
provide. For instance, a log of any kind should support `info()`, `warn()`,
`error()`, and `debug()`. As another example, any cache should have some way
reading a string, boolean, and integer value.

Each plugin implements a Kubernetes-object-like interface, having `kind`,
`apiVersion` and `metadata` properties. There is no `spec` field containing the
substance of the plugin itself. Those properties are directly properties of the
plugin for this technical reason: `this` becomes scoped to the `spec` object
instead of the plugin, which makes usage of the plugin difficult.

It may seem contradictory to the principles above to use OOP for the plugin
system, when I specifically described why I favor functional programming.
However, the plugin system is exactly the corner case where the inheritance of
OOP really shines. Also, many libraries still use OOP, so it may be necessary
for plugins to store stateful data that is unique to each plugin, such as a live
connection to a database.

Remember that the point of this architecture is not
for there to be _no state_, but rather, for it to be united under a single
context object that is passed between all functions. As long as these stateful
objects are part of the context object rather than scattered throughout the
program in other objects, there is no contradiction in my principles.

## Plugin Lifecycles

Plugins follow a lifecycle, which is constituted of these phases:

1. Unloaded
2. Loaded
3. Activated
4. Deactivated

"Unloaded" means, in the context of a NodeJS program, that the ECMAScript module
containing the plugin was not loaded by the NodeJS runtime.
"Loaded" means that it is.

"Activated" means that the plugin was initialized. If this is a plugin for, say,
accessing an object store, this might mean performing the TLS handshake,
authenticating over HTTPS, and storing the connection object within the plugin
object for later use.

"Deactivated" means that the steps performed to activate the plugin were undone.
Continuing on the example above, this means that the plugin would sign-out over
HTTPS, gracefully terminate the TLS and TCP connection, and delete the
connection object from the object's state. During this process, the object must
be entirely reset so that it is able to be re-activated without any change in
behavior.

Plugins must follow the phases of the above lifecycle in the order that they
appear, looping back around. Loading and unloading a plugin should not have any
side-effects; this _would_ be a requirement, but some third-party libraries
used by such plugins will execute code when loaded, so this cannot always be
enforced.

## Plugin Types

What follows is an overview of each plugin type, in alphabetical order, with the
exception of the initialization ("init") plugins, which will be discussed first.

### Init Plugins

Init plugins handle "initialization," which, in this context, means "finding
and loading the configuration plugin." Init plugins are a lot like configuration
plugins, but they have two notable constraints: the plugin must not require any
initialization itself, and the choice of init plugin must be hard-coded into
the program itself. The point of the initialization is not to contain any
configuration information: it is only to find and load the configuration plugin.

Examples of viable init plugins are:

- Those that obtain information from environment variables.
- Those that obtain information from command-line arguments.
- Those that obtain information from local files.

To elaborate upon what an init plugin would do, let's say you have an
environment variables-based init plugin. This plugin would, as stated above, be
hard-coded to load when the program starts up. This plugin might read an
environment variable, such as `PLUGINS_DIRECTORY` and recursively load all
NodeJS modules within that directory. Then, another environment variable, such
as `CONFIGURATION_PLUGIN_UUID`, could be used to select which of the loaded
configuration plugins to activate.

If more plugins are needed (any they probably would be), they should be loaded
using information obtained from the configuration plugin. At this point, the
init plugin has fulfilled its purpose.

### Authentication Plugins

Authentication plugins are generic abstract classes, and are meant to be
subtyped to a non-generic abstract class for each authentication mechanism. The
argument type and response type for each authentication mechanism are intended
to populate the argument and response types of each of the following three
methods that authentication plugins define:

- `login()`
- `logout()`
- `check()`

### Authorization Plugins

I don't really know how this will work just yet.

### Backup Plugins

Though backups should generally be dealt with behind the
scenes, some applications demand awareness of their own backups. Backup plugins
implement three generic methods for backing up data, restoring it, and
retrieving information about the backup history.

- `backup()` - Initiates a backup
- `restore()` - Restores from a specific backup
- `history()` - Returns an async iterator that returns backups in reverse-chronological order

### Cache Plugins

Cache plugins are intended to mediate access to a cache, which may be external,
such as a Redis server or a Memcached server, or which may be an in-memory
(or even on-disk) store. Data stored in a cache should not be expected to
survive program failures or restarts. This data is expected to be safe from
corruption.

At a minimum, a cache plugin should define methods for reading strings,
booleans, integers, and floating-point numbers from the underlying cache, but
support for reading more data types may be added by subtypes of the cache
plugin; such additional types may be complex structured types.

### Circuit Breaker Plugins

I don't really know how this will work just yet. The idea behind these is to
have something that terminates the program, or some functionality of the
program, if some assertion is falsified. One possible implementation uses
the Kubernetes labels associated with plugins to determine which plugins to
deactivate in the event that an assertion is falsified.

### Configuration Plugins

Configuration plugins are intended to mediate access to a source of
configuration information. The value of using a configuration plugin provided by
these facts:

1. Many programs are hard-coded to use a configuration file having a specific
   format, but the use of configuration plugins is meant to abstract away this
   detail and make programs amenable to using a variety of sources of
   configuration information.
2. Configuration information may be stored in a format that may still not be
   useful when simply deserialized. More transformations may have to be applied
   to the deserialized data to convert it to useful in-memory data structures.

   For example, configuration files may store cryptographic keys with PEM
   encoding, which is a textual format. To use these files to cryptographically
   sign data in a NodeJS application, they must first be converted to instances
   of `crypto.KeyObject`. If the configuration source could only return the
   textual encoding of this key, we would have to convert it to an instance of
   `crypto.KeyObject` every time this key is used. Instead, our configuration
   plugin can apply this transformation on the deserialized output, which would
   abstract away the details of how this key is stored.
3. The use of a configuration plugin allows us to prohibit writes to the
   configuration source, which is a bad practice. A program should never write
   to its own configuration.
4. The use of a configuration plugin allows us to easily intercept reads and see
   what parts of the application are reading what configuration values.
5. The use of a configuration plugin allows us to generation "virtual
   configuration values" that are generated from real configuration values.
6. The use of a configuration plugin allows us to handle defaulting logic.
   Configuration plugins can fallback upon default values when optional values
   are not specified.

Configuration plugins use a simple API consisting of two functions: `load()` and
`get()`.

`load()` loads information from the configuration store, deserializes
it, applies any necessary transformations upon it (such as converting
PEM-encoded keys into instances of `crypto.KeyObject` or converting
ISO 8601-formatted timestamps into `Date` objects), and populates a private
configuration cache with this data.

`get()` is used to retrieve values from the private configuration, using a
JSON-path-like key to lookup the value. It may seem unnecessary to mediate
access to this object using this, but doing so makes the object immutable
(thereby preventing the bad practice of the program writing to its own
configuration) and allows us to intercept reads in such a way that gives us
access to the full path. Other methods, such as using the `Proxy` object only
give us access to the property name, but not its full path. One downside of
doing this is that typescript does not know the data type of the value it
is retrieving. This is why `get()` takes one type parameter: to indicate the
type of the returned value.

In the future, `get()` might be removed entirely, because of these downsides:

- It is slower than direct access to the configuration object.
- We lose type information.
- It is not easily portable to more strongly-type languages.

Further some of the aforementioned benefits of intercepting this are
questionable:

- Profiling access to configuration should be done using conventional debugging
  tools, and is not very valuable to begin with.
- Making the object read-only could be done with an [ImmutableJS Record](https://immutable-js.github.io/immutable-js/docs/#/Record).

The alternative would be direct access to the configuration object.

### Console Plugins

I don't really know how this will work just yet. Console plugins would take a
sequence of tokens, parse them into statements and execute something based on
each statement. In other words, console plugins create a console-based
interactivity with the application.

### Container Plugins

I don't really know how this will work just yet.

### Database Plugins

I don't really know how this will work just yet.

### Email Plugins

Email Plugins enable your application to send emails, as you might expect. They
have one method:

```
send({
    from,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
})
```

Receiving is not currently supported, but it may be in the future.

### Execution Plugins

Execution plugins abstract away the execution of functions from the locations
and means by which they are executed. An execution plugin could be a simple
wrapper for a local function, but it could also be a stub function that
executes a serverless function on a remote machine. Execution plugins are
expected to be subtyped for each abstract operation. For example, an operation
for, say, creating a user account could have both local and serverless
execution plugins defined and switch between the two. More intelligent plugins
may be able to "offshore" or "outsource" work to remote machines via RPC
mechanisms if local resources are constrained.

It may seem obtuse to wrap every function of a program in a plugin, but that is
not expected. Such overhead would be catastrophic. Instead, execution plugins
are intended to abstract away user-facing / outwardly-exposed operations. If
the implementing program exposes a HTTP-based REST API, individual
method-and-path tuples of the API would correspond to abstract subtypes of the
execution plugin, and individual execution mechanisms would correspond to the
concrete subtypes of the operation-specific abstract subtype.

Every execution plugin exposes one simple method: `call()` which takes a
context object as the first argument and an arguments object as the second
argument. We use an arguments object rather than positional arguments as inputs
to `call()` to remove any dependency on the positional ordering of arguments
supplied to the function.

### Fax Plugins

Fax plugins enable an application to send faxes. They provide one method,
`send()`.

### Hook Plugins

Hook plugins notify a remote system about something happening within the
application. The most common example of a "hook," as we use the term in this
context, would be a webhook. Hook plugins are like execution plugins, but they
return no value from the promise. Only a simple resolve or reject indicates
whether the notification was sent successfully. Hook plugins have a single
method, `call()`, just like execution plugins.

### Licensing Plugins

Licensing plugins check individual permissions of an application one-by-one,
using a UUID to identify the permission and returning a simple `true` or `false`
to indicate whether the particular permission is granted. Optionally, the
validity times of that permission may be returned as well. This is done with
the licensing plugin's method `check()`.

In the future, there may be a method for renewing licenses.

REVIEW: What about when a certain number / amount of something is licensed?
This seems to have serious overlap with authorization and quotas.

### Logging Plugins

A logging plugin resembles the logging API of most applications, exposing four
methods:

- `debug()` - For information useful only during debugging
- `info()` - For mundane information
- `warn()` - For warning about future potential operational failures
- `error()` - For reporting operation failures

All of them except for the last take a string as an argument. `error()` takes
an `Error`, and the displayed message of the error may be taken from
`Error.message`.

### Multimedia Messaging Service (MMS) Plugins

MMS Plugins enable applications to send MMS messages (text messages) to phones.
These plugins have one method: `send(to, from, content)`.

### Queue Plugins

I don't really know how this will work just yet.

### Storage Plugins

Storage plugins abstract away various object stores, such as S3,
Azure Blob Storage, Minio, and even the local file system. I have researched
what these object stores have in common, and I identified these operations that
seem to be at the core of all object stores:

- `checkBucket`
- `checkObject`
- `copyObject`
- `createBucket`
- `deleteBucket`
- `deleteObject`
- `deleteObjects`
- `deleteObjectTagging`
- `getObject`
- `getObjectTagging`
- `getPresignedURL`
- `listBuckets`
- `listObjects`
- `listObjectVersions`
- `putObject`
- `putObjectTagging`

Some of these operations will not translate well to file systems, so if file
systems are needed, care must be taken to ensure that dependent programs can
survive the nuances of using a file system.

This abstraction also obscures some of the more advanced features of these
object stores. These advanced features, if needed, may be introduced in an
abstract subtype of the storage plugin class, then implemented by concrete
subtypes of the application-specific abstract subtype.

## Plugins that may never be

- Database plugins
- Internationalization plugins

## To Do

- [ ] `ListenerPlugin`
- [ ] `NotificationPlugin`
- [ ] `SearchPlugin`
- [ ] `QuotaPlugin`
- [ ] `VaultPlugin`
