(function () {
  "use strict";

  var intentProfiles = {
    explore: {
      label: "Explore a field",
      destination: "education/index.html",
      reason: "This path helps you discover fields, disciplines, and areas you may want to explore further.",
      careerContext: "Explore any career family below that interests you. Your starting goal does not select or rank a career."
    },
    learn: {
      label: "Learn something",
      destination: "learning-paths.html",
      reason: "This path takes you to structured learning paths designed to help you build knowledge step by step.",
      careerContext: "Learning can connect to many career directions. Review every family below and choose the one you want to explore."
    },
    solve: {
      label: "Solve a problem",
      destination: "applications.html",
      reason: "This path takes you to SolveMotion Labs applications built to help address specific real-world problems.",
      careerContext: "Problem solving appears across many professions. Explore any career family below without treating the list as a ranking or prediction."
    },
    build: {
      label: "Build something",
      destination: "products/solvestudio.html",
      reason: "This path takes you to SolveStudio, where ideas can be shaped into structured projects using governed development workflows.",
      careerContext: "Building and creating can support many professional paths. Choose any family below that you want to investigate further."
    },
    student: {
      label: "Student",
      destination: "education/index.html",
      reason: "This path takes students into SolveMotion Labs Education, where they can begin with governed learning domains and continue into structured learning paths.",
      careerContext: "Being a student does not determine a career. Use the families below as optional starting points for exploration."
    }
  };

  var careerFamilies = [
    {
      id: "movement-performance",
      label: "Movement, Kinesiology & Performance Careers",
      evidence: "Movement and kinesiology",
      application: "SolveMotion",
      applicationDestination: "products/solvemotion.html",
      educationalNextStepLabel: "Explore Kinesiology Education",
      educationalNextStepDestination: "education/kinesiology.html",
      description: "Explore careers connected to human movement, kinesiology, physical performance, rehabilitation, biomechanics, and related movement disciplines."
    },
    {
      id: "psychology-cognition",
      label: "Psychology, Cognition & Human Behavior Careers",
      evidence: "Psychology and cognition",
      application: "SolveMind",
      applicationDestination: "products/solvemind.html",
      educationalNextStepLabel: "Explore Psychology Education",
      educationalNextStepDestination: "education/psychology.html",
      description: "Explore careers connected to psychology, cognition, human behavior, mental processes, research, and related behavioral disciplines."
    },
    {
      id: "criminology-investigation",
      label: "Criminology, Investigation & Evidence Careers",
      evidence: "Criminology and investigation",
      application: "SolveCrime",
      applicationDestination: "products/solvecrime.html",
      educationalNextStepLabel: "Explore Criminology Education",
      educationalNextStepDestination: "education/criminology.html",
      description: "Explore careers connected to criminology, investigation, evidence, structured inquiry, analysis, and related investigative disciplines."
    },
    {
      id: "pharmacy-medication",
      label: "Pharmacy, Medication & Pharmaceutical Careers",
      evidence: "Pharmacy and medication learning",
      application: "SolvePharmacy",
      applicationDestination: "products/solvepharmacy.html",
      educationalNextStepLabel: "Explore Pharmacy Education",
      educationalNextStepDestination: "education/pharmacy.html",
      description: "Explore careers connected to pharmacy, medication, pharmaceutical science, medication safety, research, and related pharmaceutical disciplines."
    },
    {
      id: "recovery-wearables",
      label: "Recovery, Wearables & Health Data Careers",
      evidence: "Recovery and wearable signals",
      application: "SolveOura",
      applicationDestination: "products/solveoura.html",
      educationalNextStepLabel: "Explore Recovery & Wearable Learning",
      educationalNextStepDestination: "education/roadmap.html",
      description: "Explore careers connected to recovery, wearable technology, health data, human performance signals, and related data-informed health disciplines."
    }
  ];

  var selectedDestination = "";

  function getElement(id) {
    return document.getElementById(id);
  }

  function findCareerFamily(familyId) {
    for (var i = 0; i < careerFamilies.length; i++) {
      if (careerFamilies[i].id === familyId) {
        return careerFamilies[i];
      }
    }

    return null;
  }

  function showCareerFamilySelection(event) {
    var family = findCareerFamily(event.currentTarget.value);
    var selectionPanel = getElement("career-family-selection");
    var selectedLabel = getElement("career-family-selected-label");
    var selectedDescription = getElement("career-family-selected-description");
    var applicationName = getElement("career-family-application-name");
    var applicationLink = getElement("career-family-application-link");
    var educationLink = getElement("career-family-education-link");

    if (!family || !selectionPanel || !selectedLabel || !selectedDescription || !applicationName || !applicationLink || !educationLink) {
      return;
    }

    selectedLabel.textContent = family.label;
    selectedDescription.textContent = family.description;
    applicationName.textContent = family.application;
    applicationLink.textContent = "Explore " + family.application;
    applicationLink.href = family.applicationDestination;
    educationLink.textContent = family.educationalNextStepLabel;
    educationLink.href = family.educationalNextStepDestination;
    selectionPanel.hidden = false;
  }

  function renderCareerFamilies() {
    var options = getElement("career-family-options");

    if (!options || options.childNodes.length > 0) {
      return;
    }

    for (var i = 0; i < careerFamilies.length; i++) {
      var family = careerFamilies[i];

      var input = document.createElement("input");
      input.className = "visitor-goal-input";
      input.type = "radio";
      input.name = "career-family";
      input.id = "career-family-" + family.id;
      input.value = family.id;

      var label = document.createElement("label");
      label.className = "visitor-goal-option";
      label.setAttribute("for", input.id);

      var title = document.createElement("span");
      title.className = "career-discovery-title";
      title.textContent = family.label;

      var evidence = document.createElement("span");
      evidence.className = "career-discovery-evidence";
      evidence.textContent = family.evidence;

      var description = document.createElement("span");
      description.className = "career-discovery-description";
      description.textContent = family.description;

      var application = document.createElement("span");
      application.className = "career-discovery-application";
      application.textContent = "Explore with " + family.application;

      label.appendChild(title);
      label.appendChild(evidence);
      label.appendChild(description);
      label.appendChild(application);
      input.addEventListener("change", showCareerFamilySelection);

      options.appendChild(input);
      options.appendChild(label);
    }
  }

  function showRecommendation(event) {
    var intent = event.currentTarget.value;
    var profile = intentProfiles[intent];

    if (!profile) {
      selectedDestination = "";
      return;
    }

    var panel = getElement("visitor-goal-recommendation");
    var selectedIntent = getElement("visitor-goal-selected-intent");
    var why = getElement("visitor-goal-why");
    var nextAction = getElement("visitor-goal-next-action");
    var familyExploration = getElement("career-family-exploration");
    var familyContext = getElement("career-family-context");
    var familySelection = getElement("career-family-selection");

    if (
      !panel ||
      !selectedIntent ||
      !why ||
      !nextAction ||
      !familyExploration ||
      !familyContext ||
      !familySelection
    ) {
      selectedDestination = "";
      return;
    }

    selectedDestination = profile.destination;
    selectedIntent.textContent = profile.label;
    why.textContent = profile.reason;
    familyContext.textContent = profile.careerContext;

    renderCareerFamilies();

    panel.hidden = false;
    familyExploration.hidden = false;
    familySelection.hidden = true;
    nextAction.disabled = false;
  }

  function continueToRecommendation() {
    if (!selectedDestination) {
      return;
    }

    window.location.href = selectedDestination;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var inputs = document.querySelectorAll("input[name='visitor-goal']");
    var nextAction = getElement("visitor-goal-next-action");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("change", showRecommendation);
    }

    if (nextAction) {
      nextAction.addEventListener("click", continueToRecommendation);
    }
  });
})();
document
  .querySelectorAll(
    "#ecosystem-map .ecosystem-platform-node, #ecosystem-map .ecosystem-domain-node"
  )
  .forEach(function (node) {
    node.addEventListener("click", function () {
      var isExpanded = node.getAttribute("aria-expanded") === "true";
      node.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      node.classList.toggle("is-explanation-open", !isExpanded);
    });
  });
