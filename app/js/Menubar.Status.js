import { UIPanel } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

function MenubarStatus( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu right' );

	// darkmode
	var darkmode = new UIBoolean( editor.config.getKey( 'darkmode' ), strings.getKey( 'menubar/status/darkmode' ) );
	darkmode.text.setColor( '#888' );
	darkmode.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'darkmode', value );

		if ( value === true ) {

			editor.signals.sceneGraphChanged.dispatch();

		}

	} );
	container.add( darkmode );

	return container;

}

export { MenubarStatus };
