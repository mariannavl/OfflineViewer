var Viewer = new Marionette.Application();

Viewer.addRegions({
    modelsMenu: "#models-list",
    uploadMenu: "#models-upload",
    loadedMenu: "#models-loaded",
    options: "#options",
    optionsMenu: "#options-menu",
    navigationMenu: "#navigation-menu",
    navigationOptions: "#navigation-options",
    renderModeMenu: "#render-mode",
    viewer: "#viewer",
    cube: '#cube',
    tools: ".hide-show",
    selectedObjectsContainer: "#selected-objects-container",
    hiddenObjectsContainer: "#hidden-objects-container",
    rectangleselection: "#rectangle-selection-container",
    lightsOptions: "#light-settings-container",
    colorSettings: "#color-settings-container",
    materialSettings: "#material-settings-container",
    modalRegion: "#modal-region",
    modelTreeContainer: "#modeltree-container"
});

Viewer.on("models:changeNavigation", function (type) {
    alert(type);
});

/*Viewer.on("models:toggle", function (name) {
 alert(name);
 });*/

/*Viewer.on("viewer:changeNav", function(newNav) {
 alert(newNav);
 });*/

/*Viewer.on("viewer:changeRenderMode", function(newRenderMode) {
 alert(newRenderMode);
 });*/

Viewer.on("viewer:clear", function () {
    alert("Clear the viewer.");
});

Viewer.on("start", function () {
    Viewer.ModelsMenu.Controller.displayModelsMenu();
    Viewer.ModelsMenu.Controller.displayUploadMenu();
    Viewer.ModelsMenu.Controller.displayLoadedMenu();
    Viewer.Navigation.Controller.displayNavigationMenu();
    Viewer.Navigation.Controller.displayNavigationOptionsMenu();
    Viewer.RenderMode.Controller.displayRenderModeMenu();
    var toolsController = new Viewer.Tools.Controller();
    toolsController.show();
    // Viewer.Screen.Controllers.Controller.displayScreen();
    Viewer.ObjecTables.Controller.displayHiddenObjectsTable();
    Viewer.ObjecTables.Controller.displaySelectedObjectsTable();
    Viewer.LightsOptions.Controller.displayLightsMenu();
    Viewer.LightsOptions.Controller.displayColorMenu();
    Viewer.LightsOptions.Controller.displayMaterialMenu();
    Viewer.Update.Controller.init();
    Viewer.ModelTree.Controller.displayModelTree();
});
