import {
  UIPanel,
  UIBreak,
  UIRow,
  UIColor,
  UISelect,
  UIText,
  UINumber,
} from "./libs/ui.js";
import { UIOutliner, UITexture } from "./libs/ui.three.js";

function SidebarScene(editor) {
  var signals = editor.signals;
  var strings = editor.strings;

  var container = new UIPanel();
  container.setBorderTop("0");
  container.setPaddingTop("20px");

  // outliner

  var nodeStates = new WeakMap();

  function buildOption(object, draggable) {
    var option = document.createElement("div");
    option.draggable = draggable;
    option.innerHTML = buildHTML(object);
    option.value = object.id;

    // opener

    if (nodeStates.has(object)) {
      var state = nodeStates.get(object);

      var opener = document.createElement("span");
      opener.classList.add("opener");

      if (object.children.length > 0) {
        opener.classList.add(state ? "open" : "closed");
      }

      opener.addEventListener(
        "click",
        function () {
          nodeStates.set(object, nodeStates.get(object) === false); // toggle
          refreshUI();
        },
        false
      );

      option.insertBefore(opener, option.firstChild);
    }

    return option;
  }

  function getMaterialName(material) {
    if (Array.isArray(material)) {
      var array = [];

      for (var i = 0; i < material.length; i++) {
        array.push(material[i].name);
      }

      return array.join(",");
    }

    return material.name;
  }

  function escapeHTML(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getObjectType(object) {
    if (object.isScene) return "Scene";
    if (object.isCamera) return "Camera";
    if (object.isLight) return "Light";
    if (object.isMesh) return "Mesh";
    if (object.isLine) return "Line";
    if (object.isPoints) return "Points";

    return "Object3D";
  }

  function buildHTML(object) {
    var html = `<span class="type ${getObjectType(
      object
    )}"></span> ${escapeHTML(object.name)}`;

    if (object.isMesh) {
      var geometry = object.geometry;
      var material = object.material;

      html += ` <span class="type Geometry"></span> ${escapeHTML(
        geometry.name
      )}`;
      html += ` <span class="type Material"></span> ${escapeHTML(
        getMaterialName(material)
      )}`;
    }

    html += getScript(object.uuid);

    return html;
  }

  function getScript(uuid) {
    if (editor.scripts[uuid] !== undefined) {
      return ' <span class="type Script"></span>';
    }

    return "";
  }

  var ignoreObjectSelectedSignal = false;

  var outliner = new UIOutliner(editor);
  outliner.setId("outliner");
  outliner.onChange(function () {
    ignoreObjectSelectedSignal = true;

    editor.selectById(parseInt(outliner.getValue()));

    ignoreObjectSelectedSignal = false;
  });
  outliner.onDblClick(function () {
    editor.focusById(parseInt(outliner.getValue()));
  });
  container.add(outliner);
  container.add(new UIBreak());

  // background

  function onBackgroundChanged() {
    signals.sceneBackgroundChanged.dispatch(
      backgroundType.getValue(),
      backgroundColor.getHexValue(),
      backgroundTexture.getValue(),
      backgroundEquirectangularTexture.getValue()
    );
  }

  var backgroundRow = new UIRow();

  var backgroundType = new UISelect()
    .setOptions({
      'None': '',
      'Color': 'Color',
      'Texture': 'Texture',
      'Equirectangular': 'Equirect'
    })
    .setWidth("150px");
  backgroundType.onChange(function () {
    onBackgroundChanged();
    refreshBackgroundUI();
  });
  backgroundType.setValue( 'Color' );

	backgroundRow.add( new UIText( strings.getKey( 'sidebar/scene/background' ) ).setWidth( '90px' ) );
	backgroundRow.add( backgroundType );

	var backgroundColor = new UIColor().setValue( '#000000' ).setMarginLeft( '8px' ).onInput( onBackgroundChanged );
	backgroundRow.add( backgroundColor );

	var backgroundTexture = new UITexture().setMarginLeft( '8px' ).onChange( onBackgroundChanged );
	backgroundTexture.setDisplay( 'none' );
	backgroundRow.add( backgroundTexture );

	var backgroundEquirectangularTexture = new UITexture().setMarginLeft( '8px' ).onChange( onBackgroundChanged );
	backgroundEquirectangularTexture.setDisplay( 'none' );
	backgroundRow.add( backgroundEquirectangularTexture );

	container.add( backgroundRow );

  //

  function refreshBackgroundUI() {
		var type = backgroundType.getValue();

		backgroundType.setWidth( type === 'None' ? '150px' : '110px' );
		backgroundColor.setDisplay( type === 'Color' ? '' : 'none' );
		backgroundTexture.setDisplay( type === 'Texture' ? '' : 'none' );
		backgroundEquirectangularTexture.setDisplay( type === 'Equirectangular' ? '' : 'none' );
	}

  //

  function refreshUI() {
    var camera = editor.camera;
    var scene = editor.scene;

    var options = [];

    options.push(buildOption(camera, false));
    options.push(buildOption(scene, false));

    (function addObjects(objects, pad) {
      for (var i = 0, l = objects.length; i < l; i++) {
        var object = objects[i];

        if (nodeStates.has(object) === false) {
          nodeStates.set(object, false);
        }

        var option = buildOption(object, true);
        option.style.paddingLeft = pad * 18 + "px";
        options.push(option);

        if (nodeStates.get(object) === true) {
          addObjects(object.children, pad + 1);
        }
      }
    })(scene.children, 0);

    outliner.setOptions(options);

    if (editor.selected !== null) {
      outliner.setValue(editor.selected.id);
    }

    if (scene.background) {
      if (scene.background.isColor) {
        backgroundType.setValue("Color");
        backgroundColor.setHexValue(scene.background.getHex());
      } else if (scene.background.isTexture) {
        if (scene.background.mapping === THREE.EquirectangularReflectionMapping) {
          backgroundType.setValue("Equirectangular");
          backgroundEquirectangularTexture.setValue(scene.background);
        } else {
          backgroundType.setValue("Texture");
          backgroundTexture.setValue(scene.background);
        }
      }
    } else {
      backgroundType.setValue("None");
    }

    refreshBackgroundUI();
  }

  refreshUI();

  // events

  signals.editorCleared.add(refreshUI);

  signals.sceneGraphChanged.add(refreshUI);


  signals.objectSelected.add(function (object) {
    if (ignoreObjectSelectedSignal === true) return;

    if (object !== null && object.parent !== null) {
      let needsRefresh = false;
      let parent = object.parent;

      while (parent !== editor.scene) {
        if (nodeStates.get(parent) !== true) {
          nodeStates.set(parent, true);
          needsRefresh = true;
        }

        parent = parent.parent;
      }

      if (needsRefresh) refreshUI();

      outliner.setValue(object.id);
    } else {
      outliner.setValue(null);
    }
  });

  return container;
}

export { SidebarScene };
