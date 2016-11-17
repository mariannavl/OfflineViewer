$(document).ready(function () {
  var
    accordion = $(".accordion"),
    accordionNavigation = accordion.find(".accordion-navigation");
    accordionNavigation.find("a").on("click", function (e) {
    e.preventDefault();

    var _this = $(this),
    content = $(_this.attr("href"));

    if (content.hasClass("active")) {
      content.removeClass("active");
    } else {
      content.addClass("active");
    }
  });
});
