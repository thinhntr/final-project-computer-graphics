import { UIPanel } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

function MenubarStatus( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu right' );

	var autosave = new UIBoolean( editor.config.getKey( 'autosave' ), strings.getKey( 'menubar/status/autosave' ) );
	autosave.text.setColor( '#888' );
	autosave.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'autosave', value );

		if ( value === true ) {

			editor.signals.sceneGraphChanged.dispatch();

		}

	} );
	container.add( autosave );

	editor.signals.savingStarted.add( function () {

		autosave.text.setTextDecoration( 'underline' );

	} );

	editor.signals.savingFinished.add( function () {

		autosave.text.setTextDecoration( 'none' );

	} );

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

	editor.signals.dark.add( function () {

		darkmode.text.setTextDecoration( 'underline' );

	} );

	editor.signals.light.add( function () {

		darkmode.text.setTextDecoration( 'none' );

	} );

	//

	return container;

}

export { MenubarStatus };
