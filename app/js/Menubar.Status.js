import * as THREE from "./three.module.js";

import { UIPanel } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

function Checkbox(value, editor) {
	const signals = editor.signals;
	const body = document.body;
	if(value) {
		signals.sceneBackgroundChanged.dispatch(
      'Color',
      0x171717,
      '',
      '',
      ''
    );
		body.classList.add('dark-theme');
	} else {
		signals.sceneBackgroundChanged.dispatch(
      'Color',
      0xAAAAAA,
      '',
      '',
      ''
    );
		body.classList.remove('dark-theme');
	};
}

function MenubarStatus( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu right' );

	// darkmode
	var darkmode = new UIBoolean( editor.config.getKey( 'darkmode' ), strings.getKey( 'menubar/status/darkmode' ) );
	darkmode.text.setColor( '#888' );
	darkmode.onChange( function () {
		var value = this.getValue();
		Checkbox(value, editor);
	} );
	container.add( darkmode );

	return container;

}

export { MenubarStatus };
