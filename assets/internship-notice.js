(function () {
  function installInternshipNotice() {
    var firstBox = document.getElementById("other1");
    var boxes = firstBox && firstBox.closest(".softr-slot-container");
    if (!boxes || document.getElementById("yvn-internship-notice")) return;

    var notice = document.createElement("div");
    notice.id = "yvn-internship-notice";
    notice.setAttribute("role", "note");
    notice.style.cssText = "margin:0 0 24px;padding:20px 24px;border-left:4px solid #e64a5c;border-radius:12px;background:#fff0f2;color:#161522;font-family:Inter,Arial,sans-serif;font-size:18px;line-height:1.55;";
    notice.innerHTML = "<strong style=\"font-weight:700;\">Please note:</strong> We currently have no internship openings. The criteria and resources below are provided as general guidance to help you understand the skills and background we typically look for in candidates.";
    boxes.parentNode.insertBefore(notice, boxes);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installInternshipNotice);
  } else {
    installInternshipNotice();
  }
}());
