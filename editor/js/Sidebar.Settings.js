import { UIPanel, UIRow, UISelect, UISpan, UIText, UIInteger } from './libs/ui.js';

import { SidebarSettingsViewport } from './Sidebar.Settings.Viewport.js';
import { SidebarSettingsShortcuts } from './Sidebar.Settings.Shortcuts.js';
import { SidebarSettingsHistory } from './Sidebar.Settings.History.js';

function SidebarSettings( editor ) {

	var config = editor.config;
	var strings = editor.strings;

	var container = new UISpan();

	var settings = new UIPanel();
	settings.setBorderTop( '0' );
	settings.setPaddingTop( '20px' );

	//

	container.add( new SidebarSettingsViewport( editor ) );
	container.add( new SidebarSettingsShortcuts( editor ) );
	container.add( new SidebarSettingsHistory( editor ) );

	return container;

}

export { SidebarSettings };
