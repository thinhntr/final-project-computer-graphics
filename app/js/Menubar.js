import { UIPanel } from './libs/ui.js';

import { MenubarAdd } from './Menubar.Add.js';
import { MenubarEdit } from './Menubar.Edit.js';
import { MenubarFile } from './Menubar.File.js';
import { MenubarView } from './Menubar.View.js';
import { MenubarPlay } from './Menubar.Play.js';
import { MenubarStatus } from './Menubar.Status.js';
import { MenubarExAnimation } from './Menubar.ExAnimation.js';

function Menubar( editor ) {

	var container = new UIPanel();
	container.setId( 'menubar' );

	container.add( new MenubarFile( editor ) );
	container.add( new MenubarEdit( editor ) );
	container.add( new MenubarAdd( editor ) );
	container.add( new MenubarPlay( editor ) );
	container.add( new MenubarView( editor ) );
	container.add( new MenubarExAnimation( editor ) );
	container.add( new MenubarStatus( editor ) );

	return container;

}

export { Menubar };
