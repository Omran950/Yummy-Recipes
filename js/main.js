"use strict";

//=======================================NavBar=======================================================================//
let navbarSelector = $("#navBar");
let navWidth = $("#navBar .left-nav").outerWidth();

// NavBar Default Position
navbarSelector.css({
  transform: `translateX(${-navWidth}px)`,
});
$("#navBar .left-nav .links").slideUp(500);

//  NavBar Open and Close
function hideNavBar() {
  navbarSelector.css({
    transform: `translateX(${-navWidth}px)`,
    transition: " 1s",
  });
  $("#navBar .right-nav .open-close").removeClass("fa-xmark").addClass("fa-bars");
  $("#navBar .left-nav .links").slideToggle(500);
}

function showNavBar() {
  navbarSelector.css({
    transform: `translateX(0)`,
    transition: " 1s",
  });
  $("#navBar .right-nav .open-close").removeClass("fa-bars").addClass("fa-xmark");
  $("#navBar .left-nav .links").slideToggle(1200);
}

$("#navBar .right-nav .open-close").on("click", function () {
  if ($("#navBar .right-nav .open-close").hasClass("fa-bars")) {
    showNavBar();
  } else {
    hideNavBar();
  }
});

// NavBar links features
$("#navBar .left-nav ul li").on("click", function () {
  hideNavBar();
  $("#mealDetails").addClass("d-none");
  $("#main").removeClass("d-none");
  $("#main .container .search").addClass("d-none");
  $("#main .container .search input").val("");
});

//=======================================Loading=======================================================================//
$(
  "#navBar .left-nav ul .ingredients ,#navBar .left-nav ul .category ,#navBar .left-nav ul .area"
).on("click", function () {
  $("#loading").fadeIn();
  $("body").css("overflow", "hidden");
  $(document).ready(function () {
    $("#loading").fadeOut(500);
    $("body").css("overflow", "auto");
  });
});
//=======================================Main Meals=======================================================================//
let allMeals = [];

async function getMealsData(search = "") {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
  );
  response = await response.json();
  allMeals = response.meals;
}

function displayMealsHome() {
  $("#loading").fadeIn();
  $("body").css("overflow", "hidden");
  $(document).ready(function () {
    $("#loading").fadeOut(500);
    $("body").css("overflow", "auto");

    let col = "";
    let allMealslength = allMeals.length;
    if (allMealslength > 19) {
      allMealslength = 20;
    }
    for (let i = 0; i < allMealslength; i++) {
      col += `<div class="col-md-3">
    <figure class="overflow-hidden position-relative rounded-4 my-0" onclick="displayMealDetails('${allMeals[i].idMeal}');">
      <img src='${allMeals[i].strMealThumb}' alt="meal" />
      <div
        class="position-absolute start-0 top-0 w-100 h-100 d-flex align-items-center p-2"
      >
        <h2 class="">${allMeals[i].strMeal}</h2>
      </div>
    </figure>
  </div>
    `;
    }
    $("#main .container .content").html(col);
  });
}

async function homeRender(search) {
  await getMealsData(search);
  displayMealsHome();
}

homeRender();
//=======================================Meal Details=======================================================================//
let mealDetails = [];

async function getMealDetails(mealId) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  response = await response.json();
  mealDetails = response.meals;
}

function displayMealDetail() {
  $("#loading").fadeIn();
  $("body").css("overflow", "hidden");
  $(document).ready(function () {
    $("#loading").fadeOut(500);
    $("body").css("overflow", "auto");

    $("#mealDetails .container .row").html(`          
    <div class="col-md-4">
    <figure class="overflow-hidden rounded-3">
      <img src="${mealDetails[0].strMealThumb}" alt="" />
    </figure>
    <h2>${mealDetails[0].strMeal}</h2>
  </div>
  <div class="col-md-8">
    <h3 class="fw-bold fs-3">Instructions</h3>
    <p class="py-3">
      ${mealDetails[0].strInstructions}
    </p>
    <h4 class="fw-bold my-3 fs-4">Area : <span>${
      mealDetails[0].strArea
    }</span></h4>
    <h4 class="fw-bold my-3  fs-4">Category : <span>${
      mealDetails[0].strCategory
    }</span></h4>
    <div class="py-3">
      <h4 class="fw-bold  my-3 fs-4">Recipes :</h4>
      <ul class="d-flex gap-2 flex-wrap list-unstyled p-0">
        <li class="bg-info rounded-2 p-2">${mealDetails[0].strIngredient1}</li>
        <li class="bg-info rounded-2 p-2">${mealDetails[0].strIngredient2}</li>
        <li class="bg-info rounded-2 p-2">${mealDetails[0].strIngredient3}</li>
        <li class="bg-info rounded-2 p-2">${mealDetails[0].strIngredient4}</li>
      </ul>
    </div>
    <div>
      <h4 class="fw-bold mt-3  fs-4">Tags :</h4>  
      <div class="d-flex gap-2 flex-wrap">${
        mealDetails[0].strTags !== null
          ? displayTags(mealDetails[0].strTags)
          : ""
      }</div>
      <div class="btns mt-3 py-2">
      <button type="button" class="btn btn-success mx-1"><a href="${
        mealDetails[0].strSource
      }" target="_blank">Source</a></button>
      <button type="button" class="btn btn-danger mx-1"><a href="${
        mealDetails[0].strYoutube
      }" target="_blank">Youtube</a></button></div>
    </div>
  </div>`);
  });
}

function displayTags(allTags) {
  let tags = allTags.split(",");
  if (tags != null) {
    let col = "";
    for (let i = 0; i < tags.length; i++) {
      col += `<p class="bg-danger-subtle text-danger-emphasis w-auto rounded-2 p-2">
    ${tags[i]} </p> `;
    }
    return col;
  }
}

async function displayMealDetails(mealId) {
  $("#mealDetails").removeClass("d-none");
  $("#main").addClass("d-none");
  await getMealDetails(mealId);
  displayMealDetail();
}

$("#mealDetails .container div i").on("click", function () {
  $("#mealDetails").addClass("d-none");
  $("#main").removeClass("d-none");
});

//============================================Search==========================================================================//

$("#navBar .left-nav ul .search").on("click", function (e) {
  $("#main .container .search").removeClass("d-none");
  $("#main .container .content").html("");
});

$("#main .container .search input").on("keyup", function (e) {
  homeRender($(this).val());
});

//==========================================categories=======================================================================//
let allCategories = [];

async function getCategories() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  allCategories = response.categories;
}

function displayMealsHomecat() {
  let col = "";
  for (let i = 0; i < allCategories.length; i++) {
    col += `<div class="col-md-3">
    <figure class="overflow-hidden position-relative rounded-4 my-0" onclick="displayCategoriesMeals('${
      allCategories[i].strCategory
    }');">
      <img src='${allCategories[i].strCategoryThumb}' alt="meal" />
      <div
        class="position-absolute start-0 top-0 w-100 h-100 text-center p-2"
      >
        <h2>${allCategories[i].strCategory}</h2>
        <p class="overflow-hidden">${allCategories[
          i
        ].strCategoryDescription.slice(0, 134)}</p>
      </div>
    </figure>
  </div>
    `;
  }
  $("#main .container .content").html(col);
}

async function catRender() {
  await getCategories();
  displayMealsHomecat();
}

$("#navBar .left-nav ul .category").on("click", function () {
  catRender();
});

async function getCategoriesMeals(cat) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  response = await response.json();
  allMeals = response.meals;
}

async function displayCategoriesMeals(cat) {
  console.log("wow");
  await getCategoriesMeals(cat);
  displayMealsHome();
}
//===============================================Area========================================================================//
let allAreas = [];

async function getAreas() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  allAreas = response.meals;
}

function displayMealsArea() {
  let col = "";
  for (let i = 0; i < allAreas.length; i++) {
    col += `
    <div class="col-md-3">
    <figure
      class="text-center text-white"
      onclick="displayAreasMeals('${allAreas[i].strArea}');">
      <i class="fa-solid fa-house-laptop fa-5x"></i>
      <h3>${allAreas[i].strArea}</h3>
    </figure>
  </div>`;
  }
  $("#main .container .content").html(col);
}

async function areaRender() {
  await getAreas();
  displayMealsArea();
}

$("#navBar .left-nav ul .area").on("click", function () {
  areaRender();
});

async function getAreaMeals(area) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  allMeals = response.meals;
}

async function displayAreasMeals(cat) {
  await getAreaMeals(cat);
  displayMealsHome();
}
//=======================================Ingredients=======================================================================//
let ingredients = [];

async function getIngredients() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  ingredients = response.meals;
}

function displayMealsAIngredients() {
  let col = "";
  let ingredientslength = ingredients.length;
  if (ingredientslength > 19) {
    ingredientslength = 20;
  }
  for (let i = 0; i < ingredientslength; i++) {
    col += `
    <div class="col-md-3">
    <figure
      class="text-center text-white"
      onclick="displayIngredientsMeals('${ingredients[i].strIngredient}');">
      <i class="fa-solid fa-drumstick-bite fa-5x"></i>
      <h3>${ingredients[i].strIngredient}</h3>
      <p class="overflow-hidden">${ingredients[i].strDescription.slice(
        0,
        100
      )}</p>
    </figure>
  </div>`;
  }
  $("#main .container .content").html(col);
}

async function ingredientsRender() {
  await getIngredients();
  displayMealsAIngredients();
}

$("#navBar .left-nav ul .ingredients").on("click", function () {
  ingredientsRender();
});

async function getIngredientsMeals(ing) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  response = await response.json();
  allMeals = response.meals;
}

async function displayIngredientsMeals(ing) {
  await getIngredientsMeals(ing);
  displayMealsHome();
}
//=======================================Contact=======================================================================//
function contactRender() {
  $("#main .container .content").html(`
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="userName"
            aria-describedby="emailHelp"
            placeholder="Enter Your Name"
            onKeyup="nameValidation()"
          />
          <div
            class="nameAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
          Name must be more than 3 characters <br/>  
          Special characters and numbers not allowed
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="email"
            class="form-control"
            id="userEmail"
            aria-describedby="emailHelp"
            placeholder="Enter Your Email"
            onKeyup="emailValidation()"
          />
          <div
            class="emailAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
            Email not valid *exemple@yyy.zzz
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="tel"
            class="form-control"
            id="userPhone"
            aria-describedby="emailHelp"
            placeholder="Enter Your Phone"
            onKeyup="phoneValidation()"
          />
          <div
            class="phoneAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
            Enter valid Phone Number <br/>
            Phone must be 11 numbers and start with 01
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="number"
            class="form-control"
            id="userAge"
            aria-describedby="emailHelp"
            placeholder="Enter Your Age"
            onKeyup="ageValidation()"
          />
          <div
            class="ageAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
            Enter valid age between 1 and 99
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            id="userPassword"
            aria-describedby="emailHelp"
            placeholder="Enter Your Password"
            onKeyup="passwordValidation()"
          />
          <div
            class="passwordAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
          Password must be 8 characters at least and contain one capital letter and one symbol
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            id="UserRepassword"
            aria-describedby="emailHelp"
            placeholder="Repassword"
            onKeyup="rePasswordValidation()"
          />
          <div
            class="repasswordAlert bg-danger-subtle text-danger-emphasis p-2 my-2 rounded-2 d-none"
          >
            Enter valid repassword
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="mb-3 text-center" onmouseenter="formValidation()">
          <button type="button" class="btn btn-outline-warning btn-sumbit" disabled="true" onclick="clr()">
            Submit
          </button>
        </div>
      </div>`);
}

$("#navBar .left-nav ul .contact").on("click", function () {
  contactRender();
});

// For Inputs Validation
function nameValidationCheck() {
  let nameRegex = /^[a-zA-Z\s]{3,}$/;
  return nameRegex.test($("#userName").val());
}
function emailValidationCheck() {
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test($("#userEmail").val());
}
function passwordValidationCheck() {
  let passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z!@#$%^&*\d]{8,}$/;
  return passwordRegex.test($("#userPassword").val());
}
function ageValidationCheck() {
  let ageRegex = /^(?:99|[1-9]\d?)$/;
  return ageRegex.test($("#userAge").val());
}
function phoneValidationCheck() {
  let phoneRegex = /^01[0-9]{9}$/;
  return phoneRegex.test($("#userPhone").val());
}

function nameValidation() {
  if (nameValidationCheck()) {
    $(".nameAlert").addClass("d-none");
  } else {
    $(".nameAlert").removeClass("d-none");
  }
}
function emailValidation() {
  if (emailValidationCheck()) {
    $(".emailAlert").addClass("d-none");
  } else {
    $(".emailAlert").removeClass("d-none");
  }
}
function passwordValidation() {
  if (passwordValidationCheck()) {
    $(".passwordAlert").addClass("d-none");
  } else {
    $(".passwordAlert").removeClass("d-none");
  }
}
function ageValidation() {
  if (ageValidationCheck()) {
    $(".ageAlert").addClass("d-none");
  } else {
    $(".ageAlert").removeClass("d-none");
  }
}
function phoneValidation() {
  if (phoneValidationCheck()) {
    $(".phoneAlert").addClass("d-none");
  } else {
    $(".phoneAlert").removeClass("d-none");
  }
}
function rePasswordValidation() {
  if ($("#UserRepassword").val() === $("#userPassword").val()) {
    $(".repasswordAlert").addClass("d-none");
    return true;
  } else {
    $(".repasswordAlert").removeClass("d-none");
    return false;
  }
}

// Show submit button if all form inputs has valid data
function formValidation() {
  if (
    nameValidationCheck() &&
    emailValidationCheck() &&
    passwordValidationCheck() &&
    ageValidationCheck() &&
    phoneValidationCheck() &&
    rePasswordValidation()
  ) {
    $(".btn-sumbit").removeAttr("disabled");
  }
}

//Clear Form Data After Submit
function clr() {
  swal("", "Submit Successfully", "success");
  $("#userName").val("");
  $("#userEmail").val("");
  $("#userPhone").val("");
  $("#userAge").val("");
  $("#userPassword").val("");
  $("#UserRepassword").val("");
}
