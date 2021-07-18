import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

function openlink( link , title) {
	var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
	window.open(link, title ,windowFeatures)
}

function MenubarExAnimation( editor ) {

	var strings = editor.strings;
	var link = '../../examples/animation/'
	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/ExAnimation' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

    // Animation 1
	var Animation1 = new UIRow();
	Animation1.setClass( 'option' );
	Animation1.setTextContent( strings.getKey( 'menubar/ExAnimation/Animation1' ) );
	Animation1.onClick( function () {
		openlink(link + 'exam_1/index.html');
	} );
	options.add( Animation1 );

	// Animation 2
	var Animation2 = new UIRow();
	Animation2.setClass( 'option' );
	Animation2.setTextContent( strings.getKey( 'menubar/ExAnimation/Animation2' ) );
	Animation2.onClick( function () {
		openlink(link + 'exam_2/index.html');
	} );
	options.add( Animation2 );

	// Animation 3
	var Animation3 = new UIRow();
	Animation3.setClass( 'option' );
	Animation3.setTextContent( strings.getKey( 'menubar/ExAnimation/Animation3' ) );
	Animation3.onClick( function () {
		openlink(link + 'exam_3/index.html');
	} );
	options.add( Animation3 );


	return container;

}

export { MenubarExAnimation};
