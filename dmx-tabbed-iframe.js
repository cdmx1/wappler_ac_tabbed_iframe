dmx.Component('tabbed-iframe', {
  initialData: {
    id: null,
    active_tab: null,
    tabs: [],
    loading_screen: 750
  },

  attributes: {
    id: { default: null },
    auto_iframe_mode: { type: Boolean, default: true },
    auto_item_active: { type: Boolean, default: true },
    auto_show_new_tab: { type: Boolean, default: true },
    allow_duplicates: { type: Boolean, default: true },
    use_navbar_items: { type: Boolean, default: true }
  },

  methods: {
    addTab: function (tabId, tabTitle, iframeSrc) {
      this.get('tabs').push({ id: tabId, title: tabTitle, src: iframeSrc });
      if (this.props.auto_show_new_tab) {
        this.activateTab(tabId);
      }
    },
    activateTab: function (tabId) {
      this.set('active_tab', tabId);
    },
    closeTab: function (tabId) {
      const tabs = this.get('tabs');
      const index = tabs.findIndex(tab => tab.id === tabId);
      if (index !== -1) {
        tabs.splice(index, 1);
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
    }
  },

  render: function (node) {
    const id = this.props.id || 'tabbed-iframe';
    const useNavbarItems = this.props.use_navbar_items ? `
      <a class="nav-link bg-light" href="#" data-widget="iframe-scrollleft"><i class="fas fa-angle-double-left"></i></a>
      <ul class="navbar-nav" role="tablist">
        ${this.get('tabs').map(tab => `
          <li class="nav-item ${this.get('active_tab') === tab.id ? 'active' : ''}" role="presentation">
            <a class="nav-link ${this.get('active_tab') === tab.id ? 'active' : ''}" data-toggle="row" id="tab-${tab.id}" href="#panel-${tab.id}" role="tab" aria-controls="panel-${tab.id}" aria-selected="${this.get('active_tab') === tab.id}">${tab.title}</a>
          </li>
        `).join('')}
      </ul>
      <a class="nav-link bg-light" href="#" data-widget="iframe-scrollright"><i class="fas fa-angle-double-right"></i></a>
      <a class="nav-link bg-light" href="#" data-widget="iframe-fullscreen"><i class="fas fa-expand"></i></a>
    ` : '';

    node.innerHTML = `
      <div class="content-wrapper iframe-mode" data-widget="iframe" data-loading-screen="${this.props.loading_screen}">
        <div class="nav navbar navbar-expand-lg navbar-white navbar-light border-bottom p-0">
          <a class="nav-link bg-danger" href="#" data-widget="iframe-close">Close</a>
          ${useNavbarItems}
        </div>
        <div class="tab-content">
          ${this.get('tabs').map(tab => `
            <div class="tab-pane fade ${this.get('active_tab') === tab.id ? 'active show' : ''}" id="panel-${tab.id}" role="tabpanel" aria-labelledby="tab-${tab.id}">
              <iframe id="${tab.id}-iframe" src="${tab.src}" style="height: 100%; width: 100%; border: none;"></iframe>
            </div>
          `).join('')}
          <div class="tab-empty">
            <h2 class="display-4">No tab selected!</h2>
          </div>
          <div class="tab-loading">
            <div>
              <h2 class="display-4">Tab is loading <i class="fa fa-sync fa-spin"></i></h2>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  update: function (props) {
    // Update any relevant properties
    // (Not necessary for this implementation)
  }
});
