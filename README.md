### Developed and Maintained by: Roney Dsilva

# Tabbed Iframes Module Documentation

The Tabbed Iframes module enables the creation of tabbed interfaces containing iframes. Below, you'll find the documentation for configuring the Tabbed Iframes module:

## Tabbed Iframes Properties

1. **ID**: Unique identifier for the tabbed iframe. (Required)
2. **Auto Iframe Mode**: Enables automatic iframe mode. (Default: true)
3. **Auto Item Active**: Automatically sets the active item. (Default: true)
4. **Auto Show New Tab**: Automatically shows new tabs. (Default: true)
5. **Allow Duplicates**: Allows duplicate items in the tabbed interface. (Default: true)
6. **Use Navbar Items**: Enables the use of navbar items. (Default: true)

## Actions

The Tabbed Iframes module also provides the following actions:

1. **Add Tab**: Adds a new tab with the specified ID, Title, and Iframe source URL. If Auto Show New Tab is enabled, the newly added tab will be activated automatically.
2. **Activate Tab**: Activates the tab with the specified ID, making it the active tab.
3. **Close Tab**: Closes the tab with the specified ID. If Auto Active is enabled and the closed tab was active, the active tab will be set to null.
4. **Refresh Iframe**: Refreshes the content of the iframe associated with the specified tab ID by reloading its source URL.



