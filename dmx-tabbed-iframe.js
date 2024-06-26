/*
 * Version: 1.0.0
 * Author: Lavi Sidana
 * Date: April 19, 2024
 * Description: This file contains JavaScript code that is being used for tabbed iframe rendering and other user actions.
 */

dmx.Component('tabbed-iframe', {
  initialData: {
    id: null,
    active_tab: null,
    tabs: [],
    loading_screen: 750 //todo remove if not used
  },

  attributes: {
    id: { default: null },
    noload: { type: Boolean, default: false },
    auto_iframe_mode: { type: Boolean, default: false },
    auto_item_active: { type: Boolean, default: true },
    auto_show_new_tab: { type: Boolean, default: true },
    allow_duplicates: { type: Boolean, default: false },
    use_navbar_items: { type: Boolean, default: false },
    hide_iframe_elements: { default: "" }
  },

  methods: {
    addTab: function (title, href) {
      this.addTab(title, href);
    },
    activateTab: function (tabId) {
      this.set('active_tab', tabId);
    },
    closeTab: function (tabId) {
      const tabs = this.get('tabs');
      const index = this.get('tabs').findIndex(tab => tab.id === tabId);
      if (index !== -1) {
        this.get('tabs').splice(index, 1);
        if (this.props.auto_item_active && this.get('active_tab') === tabId) {
          this.set('active_tab', null);
        }
      }
    },
    refreshIframe: function (tabId) {
      const iframe = document.getElementById(tabId + '-iframe');
      if (iframe) {
        iframe.src = iframe.src; // Reload iframe content
      }
    },
    load: function () {
      this.load(this.$node);
    }
  },
  addClassIframeElements: function (tabId, elements) {
    const iframe = document.getElementById(tabId + '-iframe');

    iframe.addEventListener('load', function () {

      var iframeContent = iframe.contentWindow || iframe.contentDocument;

      var iframeDocument = iframeContent.document || iframeContent;

      elements.forEach((element, index) => {
        let elementInsideIframe = iframeDocument.querySelector(element.selector);
        if (elementInsideIframe) {
          elementInsideIframe.classList.add(element.class);
        }
      });
    });
  },
  hideIframeElements: function (tabId) {
    let elements = [];

    if (this.props.hide_iframe_elements != "") {
      elements = this.props.hide_iframe_elements.split(",").map(function (item) {
        return { selector: item.trim(), class: 'd-none' };
      }).filter(function (item) {
        return item.selector !== "";
      });
    }

    elements.push({ selector: 'body', class: 'iframe-mode' });
    this.addClassIframeElements(tabId, elements);
  },
  hideElement: function (elem) {
    document.getElementById(elem).hidden = true;
  },
  showElement: function (elem) {
    document.getElementById(elem).hidden = false;
  },
  searchInArrayOfObjects: function (array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  },
  closeTabs: async function (all = true) { //False means close all except active;
    let tabs = this.get('tabs');
    let activeIndex;
    tabs.forEach((tab, index) => {
      if (tab.id == this.get('active_tab') && !all) {
        activeIndex = index;
        return;
      }

      this.deleteTab(tab.id);
      return;
    });
    this.set('tabs', all ? [] : [tabs[activeIndex]]);
  },
  activateTab: function (tabId) {
    this.set('active_tab', tabId);
    let tab = document.querySelector(`#${tabId}-tab`);
    bootstrap.Tab.getInstance(tab).show();
  },
  deleteTab: function (tabId) {
    const tabPane = document.getElementById(tabId);
    const tabLinkParent = document.getElementById(`${tabId}-tab`).parentNode;
    tabPane.parentNode.removeChild(tabPane);
    tabLinkParent.parentNode.removeChild(tabLinkParent);
  },
  closeTab: async function (tabId) {
    const tabs = this.get('tabs');
    const index = tabs.findIndex(tab => tab.id === tabId);


    let showIndex;

    if (index > -1) {
      this.get('tabs').splice(index, 1);
      showIndex = this.get('tabs').length > index ? index : index - 1;
    }
    this.deleteTab(tabId);


    if (this.get('tabs').length == 0) {
      showElement('emptyTab');
    } else if (this.props.auto_item_active) {
      let tabid = tabs[showIndex].id;
      this.activateTab(tabid);
    } else {
      this.showElement('emptyTab')
    }
  },
  load: function (node) {
    if (this.get('iframeInstance')) {
      return;
    }

    const id = this.props.id || 'tabbed-iframe';

    node.innerHTML = `
      <div class="content-wrapper iframe-mode" data-widget="iframe" data-loading-screen="${this.props.loading_screen}">
        <div class="nav navbar navbar-expand-lg navbar-white navbar-light border-bottom p-0">

            <div class="nav-item dropdown">
              <button class="bg-danger dropdown-toggle nav-link text-white" data-bs-toggle="dropdown" role="button" aria-expanded="false">Close</button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item close" data-type="all" href="#">Close all</button></li>
                <li><button class="dropdown-item close" data-type="exceptActive" href="#">Close all Other</button></li>
              </ul>
            </div>
              <button class="nav-link bg-light" id="scrollLeft"><i class="fas fa-angle-double-left"></i></button>
            <ul class="navbar-nav w-100 bg-light overflow-hidden" id="${id}-tabs">
            </ul>
              <button class="nav-link bg-light" id="scrollRight"><i class="fas fa-angle-double-right"></i></button>
              <button class="nav-link bg-light" id="fullscreenToggle"><i class="fas fa-expand"></i></button>

        </div>
        <div class="tab-content" id="${id}-tab-content">
          <div class="tab-empty" id = "emptyTab" style="width: 100%;display: -ms-flexbox;display: flex;-ms-flex-pack: center;justify-content: center;-ms-flex-align: center;align-items: center;">
              <h2 class="display-4">No tab selected!</h2>
          </div>
          <div class="tab-loading" id="loadingTab" style="position: absolute;left: 0;width: 100%;display: none;background-color: #f4f6f9;">
              <div>
                  <h2 class="display-4">Tab is loading <i class="fa fa-sync fa-spin"></i></h2>
              </div>
          </div>
        </div>
      </div>
    `;
    const closeButtons = document.querySelectorAll('.close');

    // Add event listeners to filter buttons
    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const dataType = button.getAttribute('data-type');

        if (dataType === "all") {
          this.closeTabs();
        } else if (dataType === "exceptActive") {
          this.closeTabs(false);
        }
      });
    });

    { // function to add scroll functionality for tabs
      const content = document.getElementById(`${id}-tabs`);
      const scrollLeftBtn = document.getElementById('scrollLeft');
      const scrollRightBtn = document.getElementById('scrollRight');

      // Function to scroll the content to the left
      scrollLeftBtn.addEventListener('click', function () {
        content.scrollLeft -= 50; // Adjust the value as needed
      });

      // Function to scroll the content to the right
      scrollRightBtn.addEventListener('click', function () {
        content.scrollLeft += 50; // Adjust the value as needed
      });
    }

    {
      const fullscreenToggleBtn = document.getElementById('fullscreenToggle');

      fullscreenToggleBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          document.querySelector('.content-wrapper.iframe-mode').requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    if (this.props.auto_iframe_mode) {
      document.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (!this.props.use_navbar_items) {
            let navbar = document.querySelector('nav');
            if (navbar.contains(link)) {
              return;
            }
          }
          let href = "";
          if (e.target.tagName === "A") {
            href = e.target.href;
          } else if (e.target.tagName === "SPAN") {
            href = e.target.parentElement.href;
          }
          let title = e.target.textContent.trim();
          this.addTab(title, href);
          // this.hideElement('emptyTab');
        })
      })
    }
    this.set('iframeInstance', true);
  },
  addTab: function (title, href) {
    if (!this.props.allow_duplicates) {
      const tabs = this.get('tabs');
      const index = tabs.findIndex(tab => tab.href === href);

      if (index != -1) {
        let tab = tabs[index];
        this.activateTab(tab.id);
        return;
      }
    }
    // Generate unique ID for the tab
    const id = this.props.id || 'tabbed-iframe';
    const tabId = id + "-" + Math.random().toString(36).substr(2, 9);
    const tab = { id: tabId, href: href, title: title };
    const content = `<iframe id="${tabId}-iframe" src="${href}" style="height: 100%; width: 100%; border: none;min-height: 100vh;"></iframe>`;

    this.get('tabs').push(tab);

    // Create tab link
    const tabLink = document.createElement('a');
    tabLink.classList.add('nav-link', 'position-relative');
    tabLink.setAttribute('id', tabId + '-tab');
    tabLink.setAttribute('data-bs-toggle', 'tab');
    tabLink.setAttribute('href', '#' + tabId);
    tabLink.setAttribute('role', 'tab');
    tabLink.setAttribute('aria-controls', tabId);
    tabLink.setAttribute('aria-selected', 'false');
    tabLink.textContent = title;

    // Create close button
    const closeButton = document.createElement('a');
    closeButton.classList.add('close-button', 'position-absolute', 'top-0', 'end-0', 'm-1');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = '<i class="fas fa-times position-absolute"></i>';
    closeButton.addEventListener('click', () => {
      this.closeTab(tabId);
    });

    // Add close button to tab link
    tabLink.appendChild(closeButton);

    // Create tab pane
    const tabPane = document.createElement('div');
    tabPane.classList.add('tab-pane', 'fade');
    tabPane.setAttribute('id', tabId);
    tabPane.setAttribute('role', 'tabpanel');
    tabPane.setAttribute('aria-labelledby', tabId + '-tab');
    tabPane.innerHTML = content;

    // Add tab link and pane to their respective containers
    document.getElementById(`${id}-tabs`).appendChild(document.createElement('li')).appendChild(tabLink);
    document.getElementById(`${id}-tab-content`).appendChild(tabPane);

    const iframe = document.getElementById(`${tabId}-iframe`);
    const loadingMessage = document.getElementById('loadingTab');

    // Hide loading message when the iframe finishes loading
    iframe.onload = iframe.onreadystatechange = function () {
      loadingMessage.style.display = "none";
      iframe.style.display = "block";
    };

    tabLink.addEventListener('shown.bs.tab', (e) => {
      this.hideElement('emptyTab');
    });

    // Activate the new tab
    var bsTab = new bootstrap.Tab(tabLink);
    if (this.props.auto_show_new_tab) {
      loadingMessage.style.display = "contents";
      this.set('active_tab', tabId);
      this.hideIframeElements(tabId);
      bsTab.show();
    }
  },
  init: function (node) {
    if (this.props.noload) {
      return;
    }
    this.load(node);

  },

  update: function (props) {
  }
});

dmx.Component('iframe-data', {
  initialData: {
    id: null,
    data: null
  },

  attributes: {
    id: { default: null },
    noload: { type: Boolean, default: false },
  },

  init: async function (node) {
    let data = await window.parent.dmx.app.data;
    this.set('data', data);
  },

  getObjectProperties: function (obj) {
    let properties = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        properties[key] = obj[key];
      }
    }
    return properties;
  },

  beforeDestroy: function () {

  }
});
