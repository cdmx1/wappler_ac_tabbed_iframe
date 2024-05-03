### Developed and Maintained by: Lavi Sidana

## Tabbed Iframes Extension for Wappler

# Tabbed Iframes Module Documentation

The Tabbed Iframes module enables the creation of tabbed interfaces containing iframes. Below, you'll find the documentation for configuring the Tabbed Iframes module:

## Installation

To install this extension, follow these steps:

1. Download the extension files.
2. In Wappler, go to the Extensions Manager.
3. Click on "Add new extension" and select the downloaded extension files.
4. Follow the prompts to complete the installation.

## Usage

Once installed, you can use the tabbed iframes component in your Wappler projects. Here are the available properties for customization:

## Tabbed Iframes Properties

- **ID**: Unique ID for the component. (Required)
- **Auto Iframe Mode**: Enable or disable auto iframe mode. (Default: false)
- **Auto Item Active**: Enable or disable auto activation of new tabs. (Default: true)
- **Auto Show New Tab**: Automatically show new tabs. (Default: true)
- **Allow Duplicates**: Allow duplicate tabs. (Default: false)
- **Use Navbar Items**: Use navigation bar items. (Default: false)
- **No Auto Load**: Prevents iframes from loading content automatically. (Default: false)
- **Hide Iframe elements**: Hide specified elements within the iframes. Provide a comma-separated list of selectors.

## Actions

The Tabbed Iframes module also provides the following actions:

1. **Add Tab**: Adds a new tab with the specified ID, Title, and Iframe source URL. If Auto Show New Tab is enabled, the newly added tab will be activated automatically.
2. **Load** : Loads the iframe module. Mostly used when No auto-load is set to true.


# Tabbed Iframes Data Module

As Iframes are not able to share data with each other, you can use tabbed iframe data module it will return the data of the layout within the iframe


#### Tabbed Iframe Data Properties

- **ID**: Unique ID for the component.
- **No Auto Load**: Prevents iframes from loading content automatically.


## Instructions

Add the AC component to i.e "Tabbed  Iframe" to a layout page
Create another blank layout page without any content in it for your pages.

If you have any existing anchor tags on the layout by setting their href attribute to "#" , and on Dynamic events add action for "Add Tab" linking it to the page destined for rendering within the iframe.


If you wish to get content available form the main layout to your pages, add AC component  i.e "Tabbed Iframe Data" on your individual pages that require it, and you main layout data will be accessible on the "data" attribute of the component added on the pages

If you want to auto link all the hrefs present in the page which load's the layout, you can set Auto iframe mode to true.
