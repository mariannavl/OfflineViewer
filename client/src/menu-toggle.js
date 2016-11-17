$(document).ready(function () {
  $(".menu-toggle").on("click", function (e) {
    e.preventDefault();

    var
      _this = $(this),
      target = $(_this.data("target")),
      targetWidth = parseInt(target.data("width")),
      mainContainer = $("#viewer").parent(),
      mainContainerWidth = parseInt(mainContainer.data("width")),
      newWidth;

    if (target.hasClass("hide")) {
      newWidth = mainContainerWidth - targetWidth;

      mainContainer
      .removeClass("large-" + mainContainerWidth)
      .addClass("large-" + newWidth)
      .data("width", newWidth.toString());

      target.removeClass("hide");
    } else {
      newWidth = mainContainerWidth + targetWidth;

      mainContainer
      .removeClass("large-" + mainContainerWidth)
      .addClass("large-" + newWidth)
      .data("width", newWidth.toString());

      target.addClass("hide");
    }
  });
});
